import PlacementClient, { GlobalPlacementSettings } from "client/lib/placement-client";
import { chooseRandomStructure } from "shared/lib/residential/structures/utils/choose-random-structure";
import LoggerFactory from "shared/util/logger/factory";
import { Controller, OnStart } from "@flamework/core";
import Signal from "@rbxts/signal";
import { PlotController } from "./plot-controller";
import { IStructure } from "shared/lib/residential/types";

@Controller()
export class PlacementController implements OnStart {
	private placementClient?: PlacementClient;
	private currentStructure?: IStructure;
	public signals = {
		plotAssigned: new Signal<(plot: PlotInstance) => void>(),
	};

	constructor(private plotController: PlotController) {}

	public async onStart() {
		const plot = await this.plotController.getPlotAsync();

		this.placementClient = new PlacementClient(plot);
		this.placeModel();

		if (GlobalPlacementSettings.PLACEMENT_CONFIGS.bools.profileRenderStepped === true) {
			spawn(() => {
				for (let i = 0; i < 50; i++) {
					print(this.placementClient?.getRenderLoopAverageTime());
					task.wait(5);
				}
			});
		}
	}

	public async placeModel(): Promise<void> {
		if (this.placementClient !== undefined) {
			try {
				this.currentStructure = chooseRandomStructure();
				this.placementClient.initiatePlacement(this.currentStructure?.model.Clone());
				const onCancelledConnection = this.placementClient.signals.onCancelled.Connect(() => {
					onCancelledConnection.Disconnect();
				});

				const onPlacementConfirmedConnection = this.placementClient.signals.onPlacementConfirmed.Connect(
					(cframe) => {
						if (this.placementClient !== undefined) {
							if (this.placementClient.isMoving() === false) {
								onPlacementConfirmedConnection.Disconnect();
							}
						}

						if (this.currentStructure !== undefined) {
							this.plotController.placeStructure(this.currentStructure.id, cframe);
						}
					},
				);
			} catch (e) {
				LoggerFactory.getLogger().log(`[PlacementController]: Error initiating placement ${e}`);
			}
		}
	}
}
