export enum PlacementState {
	MOVING = 0,
	PLACING = 1,
	COLLIDING = 2,
	INACTIVE = 3,
	OUT_OF_RANGE = 4,
}

export enum Platform {
	MOBILE = 0,
	CONSOLE = 1,
	PC = 2,
}

export type Keybind = Enum.KeyCode | Enum.UserInputType;

export interface ModelSettings {
	canStack: boolean;
	radius: number;
	frontSurface: Enum.NormalId;
}
