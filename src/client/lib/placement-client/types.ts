export enum PlacementState {
	MOVING,
	PLACING,
	COLLIDING,
	INACTIVE,
	OUT_OF_RANGE,
}

export enum Platform {
	MOBILE,
	CONSOLE,
	PC,
}

export interface ModelSettings {
	canStack: boolean;
	radius: number;
	frontSurface: Enum.NormalId;
}
