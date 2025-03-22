import { KnitServer as Knit } from "@rbxts/knit";
import { Workspace } from "@rbxts/services";
import PlotFactory from "server/lib/plot/factory";
import LoggerFactory, { LogLevel } from "shared/util/Logger/Factory";

export = Knit.CreateService({
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
});
