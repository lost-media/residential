import { KnitServer as Knit, RemoteSignal, Signal } from "@rbxts/knit";
import { Workspace } from "@rbxts/services";
import Plot, { SerializedPlotInstance } from "server/lib/plot";
import PlotFactory from "server/lib/plot/factory";
import { getStructureById } from "shared/lib/residential/structures/utils/get-structures";
import StructureInstance from "shared/lib/residential/structures/utils/structure-instance";
import { componentsArrayToCFrame } from "shared/util/cframe-utils";
import LoggerFactory, { LogLevel } from "shared/util/logger/factory";

const PlotService = Knit.CreateService({
	Name: "PlotService",

	signals: {
		plotAssigned: new Signal<(player: Player, plot: Plot) => void>(),
	},

	Client: {
		plotAssigned: new RemoteSignal<(plot: PlotInstance) => void>(),

		placeStructure(player: Player, structureId: string, cframe: CFrame) {
			this.Server.placeStructure(player, structureId, cframe);
		},
	},

	KnitInit() {
		const plotsFolder = Workspace.FindFirstChild("Plots");

		if (plotsFolder !== undefined) {
			try {
				PlotFactory.loadPlotsFromParent(plotsFolder);
			} catch (e) {
				LoggerFactory.getLogger().log(`Error loading plots from workspace: ${e}`, LogLevel.Error);
			}
		}

		LoggerFactory.getLogger().log(`Loaded ${PlotFactory.count()} plot instances`, LogLevel.Info);
	},

	KnitStart() {
		const playerService = Knit.GetService("PlayerService");
		playerService.addPlayerJoinConnection((player: Player) => {
			try {
				const plot = PlotFactory.assignPlayer(player);

				if (plot !== undefined) {
					this.signals.plotAssigned.Fire(player, plot);
					this.Client.plotAssigned.Fire(player, plot.getInstance());
					LoggerFactory.getLogger().log(`Assigned Player "${player.Name}" to a plot`, LogLevel.Info);
				}
			} catch (e) {
				LoggerFactory.getLogger().log(
					`Error assigning Player "${player.Name}" to a plot: ${e}`,
					LogLevel.Error,
				);
			}
		});

		playerService.addPlayerLeavingConnection((player: Player) => {
			const plot = PlotFactory.getPlayersPlot(player);

			if (plot !== undefined) {
				plot.unassignPlayer();
			}
		});
	},

	getPlotAsync(player: Player): Promise<Plot> {
		return new Promise((resolve) => {
			const playerPlot = PlotFactory.getPlayersPlot(player);
			if (playerPlot !== undefined) {
				resolve(playerPlot);
			} else {
				const [_, plot] = this.signals.plotAssigned.Wait();
				resolve(plot);
			}
		});
	},

	loadPlot(player: Player, serializedPlot: SerializedPlotInstance): void {
		const playersPlot = PlotFactory.getPlayersPlot(player);
		assert(playersPlot !== undefined, `[PlotService:loadPlot]: Player "${player.Name}" doesn't have a plot`);

		// Clear the plot before loading in data
		playersPlot.clear();

		serializedPlot.structures.forEach((structure) => {
			const cframe = structure.cframe;
			if (cframe !== undefined) {
				const arrToCFrame = componentsArrayToCFrame(cframe);
				this.placeStructure(player, structure.structureId, arrToCFrame, structure.uuid);
			}
		});
	},

	placeStructure(player: Player, structureId: string, cframe: CFrame, structureUUID?: string): void {
		const playersPlot = PlotFactory.getPlayersPlot(player);
		assert(playersPlot !== undefined, `[PlotService:placeStructure]: Player "${player.Name}" doesn't have a plot`);

		const structure = getStructureById(structureId);
		assert(
			structure !== undefined,
			`[PlotService:placeStructure]: Structure with ID "${structureId}" doesn't exist`,
		);

		// create a new UUID if one doesn't exist
		const dataService = Knit.GetService("DataService");
		const uuid = structureUUID ?? dataService.generateUUID();
		playersPlot.addStructure(new StructureInstance(uuid, structure), cframe);
	},
});

export = PlotService;
