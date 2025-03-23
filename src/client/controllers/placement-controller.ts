import { KnitClient as Knit } from "@rbxts/knit";
import PlacementClient from "client/lib/placement-client";
import { chooseRandomStructure } from "shared/lib/residential/structures/utils/choose-random-structure";

const PlacementController = Knit.CreateController({
	Name: "PlacementController",

	placementClient: undefined as unknown as PlacementClient,

	async KnitStart() {
		const plotController = Knit.GetController("PlotController");
		const plot = await plotController.getPlotAsync();

		print(plot);
		this.placementClient = new PlacementClient(plot);
		this.placementClient.initiatePlacement(chooseRandomStructure()?.model.Clone());
	},
});

export = PlacementController;
