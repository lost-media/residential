import { KnitClient as Knit } from "@rbxts/knit";
import PlacementClient from "client/lib/placement-client";
import { chooseRandomStructure } from "shared/lib/residential/structures/utils/choose-random-structure";
import LoggerFactory from "shared/util/logger/factory";

const PlacementController = Knit.CreateController({
	Name: "PlacementController",

	placementClient: undefined as unknown as PlacementClient,

	async KnitStart() {
		const plotController = Knit.GetController("PlotController");
		const plot = await plotController.getPlotAsync();

		this.placementClient = new PlacementClient(plot);

		try {
			this.placementClient.initiatePlacement(chooseRandomStructure()?.model.Clone());
		} catch (e) {
			LoggerFactory.getLogger().log(`[PlacementController]: Error initiating placement ${e}`);
		}
	},
});

export = PlacementController;
