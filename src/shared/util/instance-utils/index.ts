export function setModelRelativeTransparency(instance: Instance, transparencyDelta: number): void {
	const baseParts = instance.GetChildren().filter((child) => child.IsA("BasePart") === true);

	baseParts.forEach((part) => {
		part.Transparency += transparencyDelta;
	});
}

export function setModelAnchored(instance: Instance, shouldBeAnchored: boolean): void {
	const baseParts = instance.GetChildren().filter((child) => child.IsA("BasePart") === true);

	baseParts.forEach((part) => {
		part.Anchored = shouldBeAnchored;
	});
}

export function setModelCanCollide(instance: Instance, canCollide: boolean): void {
	const baseParts = instance.GetChildren().filter((child) => child.IsA("BasePart") === true);

	baseParts.forEach((part) => {
		part.CanCollide = canCollide;
	});
}
