import PlacementClient, { GlobalPlacementSettings } from "client/lib/placement-client";
import { chooseRandomStructure } from "shared/lib/residential/structures/utils/choose-random-structure";
import LoggerFactory from "shared/util/logger/factory";
import { Controller, OnStart } from "@flamework/core";
import Signal from "@rbxts/signal";
import { PlotController } from "./plot-controller";
import { IStructure } from "shared/lib/residential/types";
import KeybindManager from "client/lib/keybind-manager";

@Controller()
export class PlacementController implements OnStart {
	private keybindManager: KeybindManager;

	private placementClient?: PlacementClient;
	private currentStructure?: IStructure;
	public signals = {
		plotAssigned: new Signal<(plot: PlotInstance) => void>(),
	};

	constructor(private plotController: PlotController) {
		this.keybindManager = new KeybindManager();

		this.plotController
			.getPlotAsync()
			.then((plot) => {
				this.placementClient = new PlacementClient(plot);

				const structure = chooseRandomStructure();
				// Set up default keybinds
				if (structure !== undefined) {
					this.keybindManager.addKeybind(Enum.KeyCode.G, () => this.placeModel(structure));
					this.keybindManager.connect();
				}
			})
			.catch(() => {});
	}

	public async onStart() {
		if (GlobalPlacementSettings.PLACEMENT_CONFIGS.bools.profileRenderStepped === true) {
			spawn(() => {
				for (let i = 0; i < 50; i++) {
					print(this.placementClient?.getRenderLoopAverageTime());
					task.wait(5);
				}
			});
		}
	}

	public async placeModel(structure: IStructure): Promise<void> {
		if (this.placementClient !== undefined) {
			try {
				this.currentStructure = structure;
				this.placementClient.initiatePlacement(structure.model.Clone());
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
