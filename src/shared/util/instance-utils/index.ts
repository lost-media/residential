export function setModelRelativeTransparency(instance: Instance, transparencyDelta: number): void {
	const baseParts = instance.GetChildren().filter((child) => child.IsA("BasePart") === true);

	baseParts.forEach((part) => {
		part.Transparency += transparencyDelta;
	});
}
