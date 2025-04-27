import { Dependency } from "@flamework/core";
import type { CommandContext } from "@rbxts/cmdr";
import type { PlotDataService } from "server/services/data/plot-data-service";

export = (context: CommandContext, player: Player) => {
	const plotDataService = Dependency<PlotDataService>();

	const currentPlot = plotDataService.getPlot(player);

	if (currentPlot !== undefined) {
		plotDataService.clearPlot(player.UserId, currentPlot.Data.uuid);
	}
};
