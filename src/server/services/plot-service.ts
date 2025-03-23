import { KnitServer as Knit } from "@rbxts/knit";
import { Workspace } from "@rbxts/services";
import PlotFactory from "server/lib/plot/factory";
import LoggerFactory, { LogLevel } from "shared/util/logger/factory";

const PlotService = Knit.CreateService({
	Name: "PlotService",

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
		playerService.addPlayerJoinConnection(1, (player: Player) => {
			try {
				PlotFactory.assignPlayer(player);
				LoggerFactory.getLogger().log(`Assigned Player "${player.Name}" to a plot`, LogLevel.Info);
			} catch (e) {
				LoggerFactory.getLogger().log(
					`Error assigning Player "${player.Name}" to a plot: ${e}`,
					LogLevel.Error,
				);
			}
		});
	},
});

export = PlotService;
