import { KnitClient as Knit } from "@rbxts/knit";

const PlacementController = Knit.CreateController({
	Name: "PlacementController",

	async KnitStart() {
		const plotController = Knit.GetController("PlotController");
		const plot = await plotController.getPlotAsync();
	},
});

export = PlacementController;
