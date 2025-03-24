import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Player } from "@rbxts/knit/Knit/KnitClient";
import { HttpService, Workspace } from "@rbxts/services";
import PlotFactory from "server/lib/plot/factory";
import { getStructureById } from "shared/lib/residential/structures/utils/get-structures";
import StructureInstance from "shared/lib/residential/structures/utils/structure-instance";
import LoggerFactory, { LogLevel } from "shared/util/logger/factory";

const PlotService = Knit.CreateService({
	Name: "PlotService",

	Client: {
		PlotAssigned: new RemoteSignal<(plot: PlotInstance) => void>(),

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
					this.Client.PlotAssigned.Fire(player, plot.getInstance());
					LoggerFactory.getLogger().log(`Assigned Player "${player.Name}" to a plot`, LogLevel.Info);
				}
			} catch (e) {
				LoggerFactory.getLogger().log(
					`Error assigning Player "${player.Name}" to a plot: ${e}`,
					LogLevel.Error,
				);
			}
		});
	},

	placeStructure(player: Player, structureId: string, cframe: CFrame): void {
		/*const playersPlot = PlotFactory.getPlayersPlot(Player);
		assert(playersPlot !== undefined, `[PlotService:placeStructure]: Player "${player.Name}" doesn't have a plot`);

		const structure = getStructureById(structureId);
		assert(
			structure !== undefined,
			`[PlotService:placeStructure]: Structure with ID "${structureId}" doesn't exist`,
		);

		// create a new UUID
		const uuid = HttpService.GenerateGUID(false);
		playersPlot.addStructure(new StructureInstance(uuid, structure), cframe);
		*/
	},
});

export = PlotService;
