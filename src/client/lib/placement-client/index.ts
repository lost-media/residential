import { UserInputService } from "@rbxts/services";
import { PlacementState, Platform, ModelSettings } from "./types";
import { Janitor, Signal } from "@rbxts/knit";
import { setModelRelativeTransparency } from "shared/util/instance-utils";

const SETTINGS = {
	PLACEMENT_CONFIGS: {
		// Bools
		bools: {
			enableFloors: true,
			collisions: true,
			characterCollisions: false,
			transparentModel: true,
		},

		// test

		// floats
		floats: {
			transparencyDelta: 0.6,
		},
	},
};

class PlacementClientSignals {
	public placed = new Signal<() => void>();
	public collided = new Signal<() => void>();
	public rotated = new Signal<() => void>();
	public cancelled = new Signal<() => void>();
	public onLevelChanged = new Signal<() => void>();
	public outOfRange = new Signal<() => void>();
	public initiated = new Signal<() => void>();
	public onPlacementConfirmed = new Signal<() => void>();
	public onDeleteStructure = new Signal<() => void>();
}

class PlacementClientStateMachine {
	// states
	private model?: Model;
	private yLevel: number = 0;

	// signals
	public onModelChanged = new Signal<(model?: Model) => void>();
	public onLevelChanged = new Signal<(level: number) => void>();

	// can't make objects of this class
	constructor() {}

	public getModel(): Optional<Model> {
		return this.model;
	}

	public setModel(model?: Model) {
		this.model = model;
		this.onModelChanged.Fire(model);
	}

	public getYLevel(): number {
		return this.yLevel;
	}

	public setYLevel(level: number) {
		this.yLevel = level;
		this.onLevelChanged.Fire(level);
	}
}

class PlacementClient {
	private plot: PlotInstance;
	private state: PlacementState;

	private stateMachine: PlacementClientStateMachine;
	private janitor: Janitor;

	public signals: PlacementClientSignals;

	constructor(plot: PlotInstance) {
		this.plot = plot;
		this.state = PlacementState.INACTIVE;

		this.stateMachine = new PlacementClientStateMachine();
		this.janitor = new Janitor();
		this.signals = new PlacementClientSignals();
	}

	public initiatePlacement(model?: Model, settings: Partial<ModelSettings> = {}): void {
		if (model === undefined) {
			return;
		}

		// the state must be inactive before placing
		if (this.state !== PlacementState.INACTIVE) {
			this.cancelPlacement();
		}

		if (this.getPlatform() === Platform.MOBILE) {
			// do something for mobile
		}

		// add to janitor for garbage collecting
		this.janitor.Add(model);

		this.stateMachine.setYLevel(0);

		if (SETTINGS.PLACEMENT_CONFIGS.bools.transparentModel === true) {
			setModelRelativeTransparency(model, SETTINGS.PLACEMENT_CONFIGS.floats.transparencyDelta);
		}
	}

	public cancelPlacement(): void {}

	public isPlacing(): boolean {
		return this.state !== PlacementState.MOVING;
	}

	public getPlatform(): Platform {
		const isXBOX = UserInputService.GamepadEnabled;
		const isMobile = UserInputService.TouchEnabled;

		if (isMobile === true) {
			return Platform.MOBILE;
		} else if (isXBOX === true) {
			return Platform.CONSOLE;
		} else {
			return Platform.PC;
		}
	}

	public destroy(): void {
		this.janitor.Cleanup();
	}
}

export default PlacementClient;
