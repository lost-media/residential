import { Dependency } from "@flamework/core";
import { CommandContext } from "@rbxts/cmdr";
import { PlotDataService } from "server/services/data/plot-data-service";

export = function (context: CommandContext, player: Player) {
	const plotDataService = Dependency<PlotDataService>();

	const currentPlot = plotDataService.getPlot(player);

	if (currentPlot !== undefined) {
		plotDataService.clearPlot(player.UserId, currentPlot.Data.uuid);
	}
};
