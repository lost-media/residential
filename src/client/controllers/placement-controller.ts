import { KnitClient as Knit } from "@rbxts/knit";
import PlacementClient from "client/lib/placement-client";
import { chooseRandomStructure } from "shared/lib/residential/structures/utils/choose-random-structure";
import LoggerFactory from "shared/util/logger/factory";

const PlacementController = Knit.CreateController({
	Name: "PlacementController",

	placementClient: undefined as unknown as PlacementClient,

	async KnitStart(): Promise<void> {
		const plotController = Knit.GetController("PlotController");
		const plot = await plotController.getPlotAsync();

		this.placementClient = new PlacementClient(plot);

		this.placeModel();
	},

	async placeModel(): Promise<void> {
		try {
			this.placementClient.initiatePlacement(chooseRandomStructure()?.model.Clone());
			const connection = this.placementClient.signals.onCancelled.Connect(() => {
				connection.Disconnect();
				this.placeModel();
			});
		} catch (e) {
			LoggerFactory.getLogger().log(`[PlacementController]: Error initiating placement ${e}`);
		}
	},
});

export = PlacementController;
