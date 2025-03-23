import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Workspace } from "@rbxts/services";
import Plot from "shared/lib/plot";
import PlotFactory from "shared/lib/plot/factory";
import LoggerFactory, { LogLevel } from "shared/util/logger/factory";

const PlotService = Knit.CreateService({
	Name: "PlotService",

	Client: {
		PlotAssigned: new RemoteSignal<(plot: Plot) => void>(),
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
					this.Client.PlotAssigned.Fire(player, plot);
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
});

export = PlotService;
