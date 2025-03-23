import { UserInputService } from "@rbxts/services";
import { PlacementState, Platform, ModelSettings } from "./types";
import { Janitor, Signal } from "@rbxts/knit";

const SETTINGS = {
	PLACEMENT_CONFIGS: {
		// Bools
		enableFloors: true,
		collisions: true,
		characterCollisions: false,
		transparentModel: true,
	},
};

class PlacementClientStateMachine {
	// states
	private model?: Model;
	private level: number = 0;

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

	public getLevel(): number {
		return this.level;
	}

	public setLevel(level: number) {
		this.level = level;
		this.onLevelChanged.Fire(level);
	}
}

class PlacementClient {
	private plot: PlotInstance;
	private state: PlacementState;

	private stateMachine: PlacementClientStateMachine;
	private janitor: Janitor;

	constructor(plot: PlotInstance) {
		this.plot = plot;
		this.state = PlacementState.INACTIVE;
		this.stateMachine = new PlacementClientStateMachine();
		this.janitor = new Janitor();
	}

	initiatePlacement(model?: Model, settings?: ModelSettings): void {
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

		this.stateMachine.setLevel(0);
	}

	cancelPlacement(): void {}

	isPlacing(): boolean {
		return this.state !== PlacementState.MOVING;
	}

	isActive(): boolean {
		return true;
	}

	getPlatform(): Platform {
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

	destroy(): void {
		this.janitor.Cleanup();
	}
}

export default PlacementClient;
