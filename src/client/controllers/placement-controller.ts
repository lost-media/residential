import { KnitClient as Knit } from "@rbxts/knit";
import PlacementClient, { GlobalPlacementSettings } from "client/lib/placement-client";
import { chooseRandomStructure } from "shared/lib/residential/structures/utils/choose-random-structure";
import LoggerFactory from "shared/util/logger/factory";

const PlacementController = Knit.CreateController({
	Name: "PlacementController",

	currentStructure: chooseRandomStructure(),
	placementClient: undefined as unknown as PlacementClient,

	async KnitStart(): Promise<void> {
		const plotController = Knit.GetController("PlotController");
		const plot = await plotController.getPlotAsync();

		this.placementClient = new PlacementClient(plot);

		this.placeModel();

		if (GlobalPlacementSettings.PLACEMENT_CONFIGS.bools.profileRenderStepped === true) {
			spawn(() => {
				for (let i = 0; i < 50; i++) {
					print(this.placementClient.getRenderLoopAverageTime());
					task.wait(5);
				}
			});
		}
	},

	async placeModel(): Promise<void> {
		try {
			this.placementClient.initiatePlacement(chooseRandomStructure()?.model.Clone());
			const onCancelledConnection = this.placementClient.signals.onCancelled.Connect(() => {
				onCancelledConnection.Disconnect();
			});

			const onPlacementConfirmedConnection = this.placementClient.signals.onPlacementConfirmed.Connect(
				(cframe) => {
					if (this.placementClient.isMoving() === false) {
						onPlacementConfirmedConnection.Disconnect();
					}

					const plotController = Knit.GetController("PlotController");
					if (this.currentStructure !== undefined) {
						plotController.placeStructure(this.currentStructure.id, cframe);
					}
				},
			);
		} catch (e) {
			LoggerFactory.getLogger().log(`[PlacementController]: Error initiating placement ${e}`);
		}
	},
});

export = PlacementController;
