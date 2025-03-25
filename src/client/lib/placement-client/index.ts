import { TweenService, UserInputService, Workspace } from "@rbxts/services";
import { PlacementState, Platform, ModelSettings } from "./types";
import { Signal } from "@rbxts/knit";
import { setModelAnchored, setModelCanCollide, setModelRelativeTransparency } from "shared/util/instance-utils";
import { Trove } from "@rbxts/trove";
import Mouse from "../mouse";
import { Player } from "@rbxts/knit/Knit/KnitClient";
import { visualizeRaycast } from "shared/util/raycast-utils";
import { PLATFORM_INSTANCE_NAME, PLOT_STRUCTURES_FOLDER_NAME } from "shared/lib/plot/configs";
import { RepeatableProfiler } from "shared/util/profiler";
import { hitboxIsCollidedInPlot } from "shared/lib/plot/utils/plot-collisions";

const SETTINGS = {
	PLACEMENT_CONFIGS: {
		// Bools
		bools: {
			profileRenderStepped: true,
			enableAngleTilt: true,
			enableFloors: true,
			enableCollisions: true,
			characterCollisions: false,
			transparentModel: true,
			interpolate: true,
			moveByGrid: true,
			blackListCharacterForRaycast: true,
			visualizeRays: false,
		},

		// test
		integers: {
			gridSize: 4,
			maxRaycastRange: 999, // in studs
			maxHeight: 999,
			floorStep: 8,
			rotationStep: 90,
			targetFps: 60,
		},

		// floats
		floats: {
			angleTiltAmplitude: 2.0,
			transparencyDelta: 0.6,
			hitboxTransparency: 0.7,
		},

		colors: {
			hitboxCollidingColor3: Color3.fromRGB(255, 75, 75),
			hitboxNonCollidingColor3: Color3.fromRGB(75, 255, 75),
		},

		misc: {
			defaultRaycastParams: new RaycastParams(),
		},
	},
};

class PlacementClientSettings {
	public repeatPlacement: boolean = true;
	public isStackable: boolean = false;
}

class PlacementClientSignals {
	public onPlaced = new Signal<() => void>();
	public onCollided = new Signal<() => void>();
	public onRotated = new Signal<(rotation: number) => void>();
	public onCancelled = new Signal<() => void>();
	public onLevelChanged = new Signal<(level: number) => void>();
	public outOfRange = new Signal<() => void>();
	public onInitiated = new Signal<() => void>();
	public onPlacementConfirmed = new Signal<(cframe: CFrame) => void>();
	public onDeleteStructure = new Signal<() => void>();
}

class PlacementClientStateMachine {
	// states
	private angleAmplitude: number = SETTINGS.PLACEMENT_CONFIGS.floats.angleTiltAmplitude;
	private gridSize: number = SETTINGS.PLACEMENT_CONFIGS.integers.gridSize;
	private isRotated: boolean = false;
	private placementInitialized: boolean = false;
	private model?: Model = undefined;
	private yLevel: number = 0;
	private rotation: number = 0;
	private initialYPosition: number = 0;
	private hitbox: BasePart | undefined;

	// signals
	public onAngleAmplitudeChanged = new Signal<(amplitude: number) => void>();
	public onHitboxChanged = new Signal<(hitbox?: BasePart) => void>();
	public onGridSizeChanged = new Signal<(gridSize?: number) => void>();
	public onModelChanged = new Signal<(model?: Model) => void>();
	public onLevelChanged = new Signal<(level: number) => void>();
	public onPlacementInitializeChanged = new Signal<(isInitialized: boolean) => void>();
	public onIsRotatedChanged = new Signal<(isRotated: boolean) => void>();
	public onRotationChanged = new Signal<(rotation: number) => void>();
	public onInitialYPositionChanged = new Signal<(rotation: number) => void>();

	// can't make objects of this class
	constructor() {}

	public reset() {
		this.angleAmplitude = SETTINGS.PLACEMENT_CONFIGS.floats.angleTiltAmplitude;
		this.isRotated = false;
		this.rotation = 0;
		this.placementInitialized = false;

		this.model?.Destroy();
		this.model = undefined;

		this.hitbox?.Destroy();
		this.hitbox = undefined;
	}

	public getAngleAmplitude(): number {
		return this.angleAmplitude;
	}

	public setAngleAmplitude(angleAmplitude: number) {
		this.angleAmplitude = angleAmplitude;
		this.onAngleAmplitudeChanged.Fire(angleAmplitude);
	}

	public getHitbox(): Optional<BasePart> {
		return this.hitbox;
	}

	public setHitbox(hitbox: BasePart) {
		this.hitbox = hitbox;
		this.onHitboxChanged.Fire(hitbox);
	}

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

	private settings: PlacementClientSettings;
	private stateMachine: PlacementClientStateMachine;
	private janitor: Trove;
	private mouse: Mouse;
	private raycastParams: RaycastParams;
	private profiler: RepeatableProfiler;

	public signals: PlacementClientSignals;

	constructor(plot: PlotInstance) {
		this.plot = plot;
		this.state = PlacementState.INACTIVE;

		this.settings = new PlacementClientSettings();
		this.settings.isStackable = this.settings.isStackable ?? false;

		this.stateMachine = new PlacementClientStateMachine();

		this.janitor = new Trove();
		this.mouse = new Mouse();
		this.raycastParams = new RaycastParams();
		this.profiler = new RepeatableProfiler();

		this.signals = new PlacementClientSignals();
	}

	public initiatePlacement(model?: Model, settings: Partial<ModelSettings> = {}): void {
		this.stateMachine.setPlacementInitialized(false);

		assert(model !== undefined, `[PlacementClient:initiatePlacement]: Expected model to be defined, got nil`);
		assert(
			model.PrimaryPart !== undefined,
			`[PlacementClient:initiatePlacement]: The model to place DOES NOT have a primary part`,
		);

		const platform = this.plot.WaitForChild(PLATFORM_INSTANCE_NAME) as BasePart | undefined;

		const targetFilter = new Array<Instance>();

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
		targetFilter.push(model);

		this.stateMachine.setModel(model);
		this.stateMachine.setYLevel(0);

		// set up the model's anchored and canCollide properties
		setModelAnchored(model, true);
		setModelCanCollide(model, false);

		// SETTING: sets the model's transparency relative to the transparencyDelta
		if (SETTINGS.PLACEMENT_CONFIGS.bools.transparentModel === true) {
			setModelRelativeTransparency(model, SETTINGS.PLACEMENT_CONFIGS.floats.transparencyDelta);
			model.PrimaryPart.Transparency = SETTINGS.PLACEMENT_CONFIGS.floats.hitboxTransparency;
		}

		if (SETTINGS.PLACEMENT_CONFIGS.bools.blackListCharacterForRaycast === true) {
			if (Player.Character !== undefined) {
				targetFilter.push(Player.Character);
			}
		}

		// set the primary part's hitbox transparency

		// set up the hitbox
		const hitbox = this.janitor.clone(model.PrimaryPart);
		hitbox.ClearAllChildren();
		this.stateMachine.setHitbox(hitbox);

		hitbox.Transparency = 1;
		hitbox.Name = "Hitbox";
		hitbox.Parent = model;

		model.PrimaryPart.Anchored = false;

		this.stateMachine.setinitialYPosition(
			this.calculateYPosition(platform.Position.Y, platform.Size.Y, model.PrimaryPart.Size.Y, 1),
		);

		model.Parent = Workspace;

		// bind all events here
		this.janitor.connect(UserInputService.InputBegan, (input, processed) => {
			if (processed === false) {
				if (input.KeyCode === Enum.KeyCode.Q) {
					this.raiseLevel();
				} else if (input.KeyCode === Enum.KeyCode.E) {
					this.lowerLevel();
				} else if (input.KeyCode === Enum.KeyCode.R) {
					this.rotate();
				} else if (input.KeyCode === Enum.KeyCode.C) {
					this.cancelPlacement();
				} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
					this.confirmPlacement();
				}
			}
		});

		this.mouse.setTargetFilter(targetFilter);
		this.mouse.setFilterType(Enum.RaycastFilterType.Exclude);

		this.raycastParams.FilterDescendantsInstances = targetFilter;
		this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude;

		this.state = PlacementState.MOVING;

		this.janitor.bindToRenderStep("Input", Enum.RenderPriority.Input.Value, (dt) => {
			// Profile the render stepped function
			if (SETTINGS.PLACEMENT_CONFIGS.bools.profileRenderStepped === true) {
				this.profiler.tic();
				this.translateObject(dt);
				this.profiler.toc();
			} else this.translateObject(dt);
		});

		this.stateMachine.setPlacementInitialized(true);
		this.signals.onInitiated.Fire();
	}

	public getRenderLoopAverageTime(): number {
		return this.profiler.getAverageTime();
	}

	public confirmPlacement(): void {
		if (this.state !== PlacementState.MOVING) return;

		const model = this.stateMachine.getModel();

		if (model === undefined) return;

		const finalCFrame = this.getFinalCFrame();
		const isColliding = this.updateHitboxCollisions();

		if (isColliding === true) {
			print("COLLIDING, CANNOT PLACE!");
			return;
		}

		if (this.settings.repeatPlacement === false) {
			this.cancelPlacement();
		}

		this.signals.onPlacementConfirmed.Fire(finalCFrame);
	}

	public cancelPlacement(): void {
		if (this.state === PlacementState.INACTIVE) {
			return;
		}

		// Set the state to inactive
		this.state = PlacementState.INACTIVE;
		this.janitor.clean();

		// reset states to their original values
		this.stateMachine.reset();

		this.signals.onCancelled.Fire();
	}

	public isMoving(): boolean {
		return this.state === PlacementState.MOVING;
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

	private raiseLevel(): void {
		if (this.state === PlacementState.INACTIVE) {
			return;
		}

		if (SETTINGS.PLACEMENT_CONFIGS.bools.enableFloors === false) {
			return;
		}

		let floorHeight = this.stateMachine.getYLevel();
		floorHeight++;
		floorHeight = math.clamp(floorHeight, 0, SETTINGS.PLACEMENT_CONFIGS.integers.maxHeight);

		this.stateMachine.setYLevel(floorHeight);

		this.signals.onLevelChanged.Fire(floorHeight);
	}

	private lowerLevel(): void {
		if (this.state === PlacementState.INACTIVE) {
			return;
		}

		if (SETTINGS.PLACEMENT_CONFIGS.bools.enableFloors === false) {
			return;
		}

		let floorHeight = this.stateMachine.getYLevel();
		floorHeight--;
		floorHeight = math.clamp(floorHeight, 0, SETTINGS.PLACEMENT_CONFIGS.integers.maxHeight);

		this.stateMachine.setYLevel(floorHeight);

		this.signals.onLevelChanged.Fire(floorHeight);
	}

	private rotate(): void {
		if (this.state === PlacementState.INACTIVE) {
			return;
		}

		let rotation = this.stateMachine.getRotation();
		rotation += SETTINGS.PLACEMENT_CONFIGS.integers.rotationStep;

		const rotateAmount = math.round(rotation / 90);

		const isRotated = rotateAmount % 2 === 0;
		if (rotation >= 360) {
			rotation = 0;
		}

		this.stateMachine.setRotation(rotation);
		this.stateMachine.setIsRotated(isRotated);

		this.signals.onRotated.Fire(rotation);
	}

	private translateObject(dt: number) {
		// This function should be as optimized as possible because it runs every frame
		if (this.state === PlacementState.PLACING || this.state === PlacementState.INACTIVE) return;
		if (this.stateMachine.getPlacementInitialized() === false) return;

		const model = this.stateMachine.getModel();
		const hitbox = this.stateMachine.getHitbox();

		if (model === undefined) return;
		if (hitbox === undefined) return;

		const modelPrimaryPart = model.PrimaryPart;
		if (modelPrimaryPart === undefined) return;

		// Update collisions
		if (SETTINGS.PLACEMENT_CONFIGS.bools.enableCollisions === true) {
			this.updateHitboxCollisions();
			this.updateHitboxColor();
		}

		const calculatedPosition = this.calculateModelCFrame(hitbox.CFrame);

		if (SETTINGS.PLACEMENT_CONFIGS.bools.interpolate === true) {
			const SPEED = 1;
			const lerpFactor = SPEED * dt * SETTINGS.PLACEMENT_CONFIGS.integers.targetFps;
			model.PivotTo(modelPrimaryPart.CFrame.Lerp(calculatedPosition, lerpFactor));
			hitbox.PivotTo(calculatedPosition);
		} else {
			model.PivotTo(calculatedPosition);
			hitbox.PivotTo(calculatedPosition);
		}
	}

	private calculateModelCFrame(lastCFrame?: CFrame): CFrame {
		const RAY_RANGE = 10000;

		const isRotated = this.stateMachine.getIsRotated();
		const yLevel = this.stateMachine.getYLevel();
		const model = this.stateMachine.getModel();
		const initialY = this.stateMachine.getInitialYPosition();

		const modelPrimaryPart = model?.PrimaryPart as BasePart;
		const platform = this.getPlatformBasePart();

		if (platform === undefined) {
			return new CFrame();
		}

		const gridSize = SETTINGS.PLACEMENT_CONFIGS.integers.gridSize;

		const camera = Workspace.CurrentCamera ?? new Instance("Camera");
		Workspace.CurrentCamera = camera;

		let sizeX: number = modelPrimaryPart.Size.X * 0.5;
		let sizeZ: number = modelPrimaryPart.Size.Z * 0.5;

		let offsetX: number = sizeX,
			offsetZ: number = sizeZ;

		let finalC: CFrame;

		if (isRotated === false) {
			[sizeX, sizeZ] = [sizeZ, sizeX];
		}

		if (SETTINGS.PLACEMENT_CONFIGS.bools.moveByGrid) {
			offsetX = sizeX - math.floor(sizeX / gridSize) * gridSize;
			offsetZ = sizeZ - math.floor(sizeZ / gridSize) * gridSize;
		}

		let ray: RaycastResult | undefined, nilRay: Vector3, unit: Optional<Ray>;
		let target: Instance;

		if (this.getPlatform() === Platform.MOBILE) {
			const cameraPosition = camera.CFrame.Position;
			ray = Workspace.Raycast(cameraPosition, camera.CFrame.LookVector.mul(RAY_RANGE), this.raycastParams);
			nilRay = cameraPosition.add(
				camera.CFrame.LookVector.mul(
					SETTINGS.PLACEMENT_CONFIGS.integers.maxRaycastRange + platform.Size.X * 0.5 + platform.Size.Z * 0.5,
				),
			);
		} else {
			// Not on Mobile
			const mouseLocation = this.mouse.getPosition();
			unit = camera.ViewportPointToRay(mouseLocation.X, mouseLocation.Y, 0);

			ray = Workspace.Raycast(unit.Origin, unit.Direction.mul(RAY_RANGE), this.raycastParams);
			nilRay = unit.Origin.add(
				unit.Direction.mul(
					SETTINGS.PLACEMENT_CONFIGS.integers.maxRaycastRange + platform.Size.X * 0.5 + platform.Size.Z * 0.5,
				),
			);
		}

		let x: number, y: number, z: number;

		if (ray !== undefined) {
			x = ray.Position.X - offsetX;
			z = ray.Position.Z - offsetZ;
			target = platform;

			if (SETTINGS.PLACEMENT_CONFIGS.bools.visualizeRays) {
				if (unit) {
					this.visualizeRay(ray, unit.Origin);
				}
			}

			// if stackable ...
		} else {
			x = nilRay.X - offsetX;
			z = nilRay.Z - offsetZ;
			target = platform;
		}

		const platformCFrame = platform.CFrame;
		const positionCFrame = new CFrame(x, 0, z).mul(new CFrame(offsetX, 0, offsetZ));

		y =
			this.calculateYPosition(platform.Position.Y, platform.Size.Y, modelPrimaryPart.Size.Y, 1) +
			yLevel * SETTINGS.PLACEMENT_CONFIGS.integers.floorStep;

		if (SETTINGS.PLACEMENT_CONFIGS.bools.moveByGrid === true) {
			const relativeCFrame = platformCFrame.Inverse().mul(positionCFrame);
			let snappedRelativeCFrame = this.getSnappedCFrame(relativeCFrame).mul(new CFrame(offsetX, 0, offsetZ));

			// snap the model to the bounds of the platform
			snappedRelativeCFrame = this.clampToBounds(platform, snappedRelativeCFrame, sizeX, sizeZ);

			finalC = platformCFrame.mul(snappedRelativeCFrame);
		} else {
			finalC = platformCFrame.Inverse().mul(positionCFrame);
			finalC = this.clampToBounds(platform, finalC, sizeX, sizeZ);
			finalC = platformCFrame.mul(finalC);
		}

		y = math.clamp(y, initialY, SETTINGS.PLACEMENT_CONFIGS.integers.maxHeight + initialY);

		if (SETTINGS.PLACEMENT_CONFIGS.bools.enableAngleTilt === false || lastCFrame === undefined) {
			return finalC
				.mul(new CFrame(0, y - platform.Position.Y, 0))
				.mul(CFrame.fromEulerAnglesXYZ(0, (this.stateMachine.getRotation() * math.pi) / 180, 0));
		} else {
			return finalC
				.mul(new CFrame(0, y - platform.Position.Y, 0))
				.mul(CFrame.fromEulerAnglesXYZ(0, (this.stateMachine.getRotation() * math.pi) / 180, 0))
				.mul(this.calculateAngle(lastCFrame, finalC));
		}
	}

	private getSnappedCFrame(cframe: CFrame): CFrame {
		const platform = this.plot.Platform;

		const gridSize = this.stateMachine.getGridSize();

		const offsetX = (platform.Size.X % (2 * gridSize)) / 2;
		const offsetZ = (platform.Size.Z % (2 * gridSize)) / 2;

		const newX = math.round(cframe.X / gridSize) * gridSize - offsetX;
		const newZ = math.round(cframe.Z / gridSize) * gridSize - offsetZ;

		return new CFrame(newX, 0, newZ);
	}

	private calculateYPosition(tp: number, ts: number, o: number, normal: number): number {
		if (normal === 0) return tp + ts * 0.5 - o * 0.5;
		else return tp + ts * 0.5 + o * 0.5;
	}

	private clampToBounds(platform: BasePart, cframe: CFrame, offsetX: number, offsetZ: number): CFrame {
		const xBound: number = platform.Size.X * 0.5 - offsetX;
		const zBound: number = platform.Size.Z * 0.5 - offsetZ;

		const newX: number = math.clamp(cframe.X, -xBound, xBound);
		const newZ: number = math.clamp(cframe.Z, -zBound, zBound);

		return new CFrame(newX, 0, newZ);
	}

	/**
	 *
	 * @returns true if the current model and hitbox are colliding with an unknown object
	 */
	private updateHitboxCollisions(): boolean {
		if (this.state !== PlacementState.MOVING && this.state !== PlacementState.COLLIDING) return false;

		const hitbox = this.stateMachine.getHitbox();
		const model = this.stateMachine.getModel();
		const plot = this.plot;

		const structuresFolder = plot.FindFirstChild(PLOT_STRUCTURES_FOLDER_NAME);

		if (hitbox === undefined) return false;
		if (model === undefined) return false;
		if (SETTINGS.PLACEMENT_CONFIGS.bools.enableCollisions === false) return false;
		if (structuresFolder === undefined) return false;

		this.state = PlacementState.MOVING as PlacementState;

		const isColliding = hitboxIsCollidedInPlot(hitbox, plot, this.mouse.getTargetFilter());

		if (isColliding === true && this.state !== PlacementState.COLLIDING) {
			this.state = PlacementState.COLLIDING;
			this.signals.onCollided.Fire();
		}

		return isColliding;
	}

	private updateHitboxColor(): void {
		const model = this.stateMachine.getModel();
		const hitbox = this.stateMachine.getHitbox();

		const modelPrimaryPart = model?.PrimaryPart;

		if (model === undefined) return;
		if (hitbox === undefined) return;
		if (modelPrimaryPart === undefined) return;

		let hitboxColor = SETTINGS.PLACEMENT_CONFIGS.colors.hitboxNonCollidingColor3;

		if (this.state === PlacementState.COLLIDING || this.state === PlacementState.OUT_OF_RANGE) {
			hitboxColor = SETTINGS.PLACEMENT_CONFIGS.colors.hitboxCollidingColor3;
		}
		modelPrimaryPart.Color = hitboxColor;
	}

	private visualizeRay(ray: RaycastResult, origin: Vector3): void {
		const part = visualizeRaycast(ray, origin);
		part.Parent = Workspace;
		this.raycastParams.AddToFilter(part);

		Promise.delay(2).then(() => {
			const tween = TweenService.Create(part, new TweenInfo(1), { Transparency: 1 });
			tween.Play();

			tween.Completed.Connect(() => {
				part.Destroy();
			});
		});
	}

	private getPlatformBasePart(): BasePart {
		return this.plot[PLATFORM_INSTANCE_NAME];
	}

	private calculateAngle(lastCFrame: CFrame, currentCFrame: CFrame): CFrame {
		if (SETTINGS.PLACEMENT_CONFIGS.bools.enableAngleTilt === false) {
			return CFrame.fromEulerAnglesXYZ(0, 0, 0);
		}

		const amplitude = this.stateMachine.getAngleAmplitude();
		const rotation = this.stateMachine.getRotation();
		const platform = this.getPlatformBasePart();

		const dirZ = math.sign(platform.CFrame.LookVector.Z);
		const dirX = math.sign(platform.CFrame.LookVector.X);

		const tiltX = ((math.clamp(lastCFrame.X - currentCFrame.X, -10, 10) * math.pi) / 180) * amplitude;
		const tiltZ = ((math.clamp(lastCFrame.Z - currentCFrame.Z, -10, 10) * math.pi) / 180) * amplitude;
		const preCalc = ((rotation + platform.Orientation.Y) * math.pi) / 180;

		return CFrame.fromEulerAnglesXYZ(tiltZ, 0, tiltX)
			.Inverse()
			.mul(CFrame.fromEulerAnglesXYZ(0, preCalc, 0))
			.Inverse()
			.mul(CFrame.fromEulerAnglesXYZ(0, preCalc, 0));
	}

	private getFinalCFrame(): CFrame {
		return this.calculateModelCFrame(undefined);
	}
}

export default PlacementClient;

export { SETTINGS as GlobalPlacementSettings };
