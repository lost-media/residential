interface Mouse {
	getViewSize(): Vector2;
	getPosition(): Vector2;
	getUnitRay(): Ray;
	getOrigin(): Vector3;
	getDelta(): Vector2;
	screenPointToRay(): RaycastParams;
	castRay(): RaycastResult;
	getHit(): Optional<Vector3>;
	getTarget(): Optional<Instance>;
	getTargetFilter(): Instance[];
	setTargetFilter(objects: Instance | Instance[]): void;
	getRayLength(): number;
	setRayLength(length: number): void;
	getFilterType(): Enum.RaycastFilterType;
	setFilterType(filterType: Enum.RaycastFilterType): void;
	enableIcon(): void;
	disableIcon(): void;
	getModelOfTarget(): Optional<Model>;
	getClosestInstanceToMouseFromParent(parent: Instance): Optional<Instance>;
}

interface MouseConstructor {
	new (): Mouse;
}

declare const Mouse: MouseConstructor;

export = Mouse;
