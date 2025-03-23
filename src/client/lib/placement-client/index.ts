import { UserInputService, Workspace } from "@rbxts/services";
import { PlacementState, Platform, ModelSettings } from "./types";
import { Janitor, Signal } from "@rbxts/knit";
import { setModelAnchored, setModelCanCollide, setModelRelativeTransparency } from "shared/util/instance-utils";
import { Trove } from "@rbxts/trove";
import Mouse from "../mouse";

const SETTINGS = {
	PLACEMENT_CONFIGS: {
		// Bools
		bools: {
			enableFloors: true,
			collisions: true,
			characterCollisions: false,
			transparentModel: true,
			interpolate: true,
			moveByGrid: true,
		},

		// test
		integers: {
			gridSize: 4,
			maxRaycastRange: 999, // in studs
			maxHeight: 999,
		},

		// floats
		floats: {
			transparencyDelta: 0.6,
			hitboxTransparency: 0.3,
		},

		misc: {
			defaultRaycastParams: new RaycastParams(),
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
	private gridSize: number = SETTINGS.PLACEMENT_CONFIGS.integers.gridSize;
	private isRotated: boolean = false;
	private placementInitialized: boolean = false;
	private model?: Model = undefined;
	private yLevel: number = 0;
	private rotation: number = 0;
	private initialYPosition: number = 0;

	// signals
	public onGridSizeChanged = new Signal<(gridSize?: number) => void>();
	public onModelChanged = new Signal<(model?: Model) => void>();
	public onLevelChanged = new Signal<(level: number) => void>();
	public onPlacementInitializeChanged = new Signal<(isInitialized: boolean) => void>();
	public onIsRotatedChanged = new Signal<(isRotated: boolean) => void>();
	public onRotationChanged = new Signal<(rotation: number) => void>();
	public onInitialYPositionChanged = new Signal<(rotation: number) => void>();

	// can't make objects of this class
	constructor() {}

	public getInitialYPosition(): number {
		return this.initialYPosition;
	}

	public setinitialYPosition(initialYPosition: number) {
		this.initialYPosition = initialYPosition;
		this.onInitialYPositionChanged.Fire(initialYPosition);
	}

	public getRotation(): number {
		return this.rotation;
	}

	public setRotation(rotation: number) {
		this.rotation = rotation;
		this.onRotationChanged.Fire(rotation);
	}

	public getGridSize(): number {
		return this.gridSize;
	}

	public setGridSize(gridSize: number) {
		this.gridSize = gridSize;
		this.onGridSizeChanged.Fire(gridSize);
	}

	public getIsRotated(): boolean {
		return this.isRotated;
	}

	public setIsRotated(isRotated: boolean) {
		this.isRotated = isRotated;
		this.onIsRotatedChanged.Fire(isRotated);
	}

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

	public getPlacementInitialized(): boolean {
		return this.placementInitialized;
	}

	public setPlacementInitialized(isInitialized: boolean) {
		this.placementInitialized = isInitialized;
		this.onPlacementInitializeChanged.Fire(isInitialized);
	}
}

class PlacementClient {
	private plot: PlotInstance;
	private state: PlacementState;

	private stateMachine: PlacementClientStateMachine;
	private janitor: Trove;
	private mouse: Mouse;

	public signals: PlacementClientSignals;

	constructor(plot: PlotInstance) {
		this.plot = plot;
		this.state = PlacementState.INACTIVE;

		this.stateMachine = new PlacementClientStateMachine();
		this.janitor = new Trove();
		this.mouse = new Mouse();

		this.signals = new PlacementClientSignals();
	}

	public initiatePlacement(model?: Model, settings: Partial<ModelSettings> = {}): void {
		this.stateMachine.setPlacementInitialized(false);

		assert(model !== undefined, `[PlacementClient:initiatePlacement]: Expected model to be defined, got nil`);
		assert(
			model.PrimaryPart !== undefined,
			`[PlacementClient:initiatePlacement]: The model to place DOES NOT have a primary part`,
		);

		const platform = this.plot.WaitForChild("Platform") as BasePart | undefined;

		if (platform === undefined) {
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
		this.janitor.add(model);

		this.stateMachine.setModel(model);
		this.stateMachine.setYLevel(0);

		// set up the model's anchored and canCollide properties
		setModelAnchored(model, true);
		setModelCanCollide(model, false);

		// SETTING: sets the model's transparency relative to the transparencyDelta
		if (SETTINGS.PLACEMENT_CONFIGS.bools.transparentModel === true) {
			setModelRelativeTransparency(model, SETTINGS.PLACEMENT_CONFIGS.floats.transparencyDelta);
		}

		// set the primary part's hitbox transparency
		model.PrimaryPart.Transparency = SETTINGS.PLACEMENT_CONFIGS.floats.hitboxTransparency;

		this.state = PlacementState.MOVING;

		this.stateMachine.setPlacementInitialized(true);
		this.stateMachine.setinitialYPosition(
			this.calculateYPosition(platform.Position.Y, platform.Size.Y, model.PrimaryPart.Size.Y, 1),
		);

		this.janitor.bindToRenderStep("Input", Enum.RenderPriority.Input.Value, (dt) => this.translateObject(dt));
	}

	public cancelPlacement(): void {
		this.janitor.destroy();
	}

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

	private translateObject(dt: number) {
		// This function should be as optimized as possible because it runs every frame
		const model = this.stateMachine.getModel();

		if (this.state === PlacementState.PLACING || this.state === PlacementState.INACTIVE) return;

		const modelPrimaryPart = model?.PrimaryPart;
		if (modelPrimaryPart === undefined) return;

		if (this.stateMachine.getPlacementInitialized() === false) return;

		const calculatedPosition = this.calculateModelCFrame();

		if (SETTINGS.PLACEMENT_CONFIGS.bools.interpolate === true) {
			modelPrimaryPart.CFrame.Lerp(calculatedPosition, 1);
		} else {
			model?.PivotTo(calculatedPosition);
		}
	}

	private calculateModelCFrame(): CFrame {
		const RAY_RANGE = 10000;

		const isRotated = this.stateMachine.getIsRotated();
		const yLevel = this.stateMachine.getYLevel();
		const model = this.stateMachine.getModel();
		const initialY = this.stateMachine.getInitialYPosition();

		const modelPrimaryPart = model?.PrimaryPart as BasePart;
		const platform = this.plot.FindFirstChild("Platform") as BasePart | undefined;

		if (platform === undefined) {
			return new CFrame();
		}

		const raycastParams = SETTINGS.PLACEMENT_CONFIGS.misc.defaultRaycastParams;
		const gridSize = SETTINGS.PLACEMENT_CONFIGS.integers.gridSize;

		const camera = Workspace.CurrentCamera ?? new Instance("Camera");
		Workspace.CurrentCamera = camera;

		let x: number, y: number, z: number;
		let sizeX: number = modelPrimaryPart.Size.X * 0.5;
		let sizeZ: number = modelPrimaryPart.Size.Z * 0.5;

		let offsetX: number = sizeX,
			offsetZ: number = sizeZ;

		let finalC: CFrame;

		if (isRotated === false) {
			sizeX = modelPrimaryPart.Size.Z * 0.5;
			sizeZ = modelPrimaryPart.Size.X * 0.5;
		}

		if (SETTINGS.PLACEMENT_CONFIGS.bools.moveByGrid) {
			offsetX = sizeX - math.floor(sizeX / gridSize) * gridSize;
			offsetZ = sizeZ - math.floor(sizeZ / gridSize) * gridSize;
		}

		let ray: RaycastResult | undefined, nilRay: Vector3;
		let target: Instance;

		if (this.getPlatform() === Platform.MOBILE) {
			const cameraPosition = camera.CFrame.Position;
			ray = Workspace.Raycast(cameraPosition, camera.CFrame.LookVector.mul(RAY_RANGE), raycastParams);
			nilRay = cameraPosition.add(
				camera.CFrame.LookVector.mul(
					SETTINGS.PLACEMENT_CONFIGS.integers.maxRaycastRange + platform.Size.X * 0.5 + platform.Size.Z * 0.5,
				),
			);
		} else {
			// Not on Mobile
			const mouseLocation = this.mouse.getPosition();
			const unit = camera.ScreenPointToRay(mouseLocation.X, mouseLocation.Y, 1);

			ray = Workspace.Raycast(unit.Origin, unit.Direction.mul(RAY_RANGE), raycastParams);
			nilRay = unit.Origin.add(
				unit.Direction.mul(
					SETTINGS.PLACEMENT_CONFIGS.integers.maxRaycastRange + platform.Size.X * 0.5 + platform.Size.Z * 0.5,
				),
			);
		}

		if (ray !== undefined) {
			x = ray.Position.X - offsetX;
			z = ray.Position.Z - offsetZ;
			target = platform;
			// if stackable ...
		} else {
			x = nilRay.X - offsetX;
			z = nilRay.Z - offsetZ;
			target = platform;
		}

		const platformCFrame = platform.CFrame;
		const positionCFrame = new CFrame(x, 0, z).mul(new CFrame(offsetX, 0, offsetZ));

		y = this.calculateYPosition(platform.Position.Y, platform.Size.Y, modelPrimaryPart.Size.Y, 1) + yLevel;

		if (SETTINGS.PLACEMENT_CONFIGS.bools.moveByGrid === true) {
			const relativeCFrame = platformCFrame.Inverse().mul(positionCFrame);
			const snappedRelativeCFrame = this.getSnappedCFrame(relativeCFrame).mul(new CFrame(offsetX, 0, offsetZ));

			finalC = platformCFrame.mul(snappedRelativeCFrame);
		} else {
			finalC = platformCFrame.Inverse().mul(positionCFrame);
			finalC = platformCFrame.mul(finalC);
		}

		y = math.clamp(y, initialY, SETTINGS.PLACEMENT_CONFIGS.integers.maxHeight + initialY);

		if (SETTINGS.PLACEMENT_CONFIGS.bools.interpolate === false) {
			return finalC
				.mul(new CFrame(0, y - platform.Position.Y, 0))
				.mul(CFrame.fromEulerAnglesXYZ(0, (this.stateMachine.getRotation() * math.pi) / 180, 0));
		} else {
			return finalC
				.mul(new CFrame(0, y - platform.Position.Y, 0))
				.mul(CFrame.fromEulerAnglesXYZ(0, (this.stateMachine.getRotation() * math.pi) / 180, 0));
		}
	}

	private getSnappedCFrame(cframe: CFrame): CFrame {
		const platform = this.plot.Platform;

		const gridSize = this.stateMachine.getGridSize();

		const offsetX = (platform.Size.X % (2 * gridSize)) / 2;
		const offsetZ = (platform.Size.Z % (2 * gridSize)) / 2;

		const newX = math.round(cframe.X / gridSize) * gridSize - offsetX;
		const newZ = math.round(cframe.Z / gridSize) * gridSize - offsetX;

		return new CFrame(newX, 0, newZ);
	}

	private calculateYPosition(tp: number, ts: number, o: number, normal: number): number {
		if (normal === 0) return tp + ts * 0.5 - o * 0.5;
		else return tp + ts * 0.5 + o * 0.5;
	}
}

export default PlacementClient;
