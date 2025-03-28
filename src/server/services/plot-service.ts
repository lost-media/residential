import { Service, OnInit, OnStart } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import PlotFactory from "server/lib/plot/factory";
import LoggerFactory, { LogLevel } from "shared/util/logger/factory";
import { PlayerService } from "./player-service";
import { serverEvents } from "server/utils/networking";
import Signal from "@rbxts/signal";
import Plot, { SerializedPlotInstance } from "server/lib/plot";
import { getStructureById } from "shared/lib/residential/structures/utils/get-structures";
import StructureInstance from "shared/lib/residential/structures/utils/structure-instance";
import { DataService } from "./data/data-service";
import { IStructureInstance } from "shared/lib/residential/types";
import { componentsArrayToCFrame } from "shared/util/cframe-utils";

@Service()
export class PlotService implements OnInit, OnStart {
	public signals = {
		onStructurePlaced: new Signal<(plot: Plot, structure: IStructureInstance) => void>(),
		onPlotAssigned: new Signal<(player: Player, plot: Plot) => void>(),
	};

	constructor(
		private playerService: PlayerService,
		private dataService: DataService,
	) {}

	public onInit(): void | Promise<void> {
		const plotsFolder = Workspace.FindFirstChild("Plots");

		if (plotsFolder !== undefined) {
			try {
				PlotFactory.loadPlotsFromParent(plotsFolder);
			} catch (e) {
				LoggerFactory.getLogger().log(`Error loading plots from workspace: ${e}`, LogLevel.Error);
			}
		}

		LoggerFactory.getLogger().log(`Loaded ${PlotFactory.count()} plot instances`, LogLevel.Info);
	}

	public onStart(): void {
		this.playerService.addPlayerJoinConnection((player: Player) => {
			try {
				const plot = PlotFactory.assignPlayer(player);

				if (plot !== undefined) {
					this.signals.onPlotAssigned.Fire(player, plot);

					serverEvents.plotAssigned.fire(player, plot.getInstance());
					LoggerFactory.getLogger().log(`Assigned Player "${player.Name}" to a plot`, LogLevel.Info);
				}
			} catch (e) {
				LoggerFactory.getLogger().log(
					`Error assigning Player "${player.Name}" to a plot: ${e}`,
					LogLevel.Error,
				);
			}
		});

		this.playerService.addPlayerLeavingConnection((player: Player) => {
			const plot = PlotFactory.getPlayersPlot(player);

			if (plot !== undefined) {
				plot.unassignPlayer();
			}
		});

		serverEvents.placeStructure.connect((player, structureId, cframe, uuid) => {
			this.placeStructure(player, structureId, cframe, uuid);
		});
	}

	public placeStructure(player: Player, structureId: string, cframe: CFrame, structureUUID?: string): void {
		const playersPlot = PlotFactory.getPlayersPlot(player);
		assert(playersPlot !== undefined, `[PlotService:placeStructure]: Player "${player.Name}" doesn't have a plot`);

		const structure = getStructureById(structureId);
		assert(
			structure !== undefined,
			`[PlotService:placeStructure]: Structure with ID "${structureId}" doesn't exist`,
		);

		// create a new UUID if one doesn't exist
		const uuid = structureUUID ?? this.dataService.generateUUID();

		try {
			const newStructure = new StructureInstance(uuid, structure);
			playersPlot.addStructure(newStructure, cframe);
			this.signals.onStructurePlaced.Fire(playersPlot, newStructure);
		} catch {}
	}

	public loadSerializedPlot(player: Player, serializedPlot: SerializedPlotInstance) {
		const playersPlot = PlotFactory.getPlayersPlot(player);
		assert(playersPlot !== undefined, `[PlotService:placeStructure]: Player "${player.Name}" doesn't have a plot`);

		serializedPlot.structures.forEach((structure) => {
			const newStructure = getStructureById(structure.structureId);
			if (newStructure !== undefined && structure.cframe !== undefined) {
				const newStructureInstance = new StructureInstance(structure.uuid, newStructure);
				const cframe = componentsArrayToCFrame(structure.cframe);
				playersPlot.addStructure(newStructureInstance, cframe);
			}
		});
	}
}
