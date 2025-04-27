export function setModelRelativeTransparency(instance: Instance, transparencyDelta: number): void {
	const baseParts = instance.GetChildren().filter((child) => child.IsA('BasePart') === true);

	baseParts.forEach((part) => {
		part.Transparency += transparencyDelta;
	});
}

export function setModelAnchored(instance: Instance, shouldBeAnchored: boolean): void {
	const baseParts = instance.GetChildren().filter((child) => child.IsA('BasePart') === true);

	baseParts.forEach((part) => {
		part.Anchored = shouldBeAnchored;
	});
}

export function setModelCanCollide(instance: Instance, canCollide: boolean): void {
	const baseParts = instance.GetChildren().filter((child) => child.IsA('BasePart') === true);

	baseParts.forEach((part) => {
		part.CanCollide = canCollide;
	});
}

export function weldParts(part0: BasePart, part1: BasePart): WeldConstraint {
	assert(part0, '[WeldLib] Part0 is nil');
	assert(part1, '[WeldLib] Part1 is nil');
	assert(part0.IsA('BasePart') === true, '[WeldLib] Part0 is not a BasePart');
	assert(part1.IsA('BasePart') === true, '[WeldLib] Part1 is not a BasePart');

	const weld = new Instance('WeldConstraint');
	weld.Part0 = part0;
	weld.Part1 = part1;
	weld.Parent = part0;
	return weld;
}

export function weldModelToPrimaryPart(model: Model): void {
	assert(model !== undefined);
	assert(model.PrimaryPart !== undefined);

	unweldModel(model);

	const primaryPart = model.PrimaryPart;
	primaryPart.Anchored = true;

	const baseParts = model
		.GetDescendants()
		.filter((child) => child.IsA('BasePart') && child !== primaryPart) as BasePart[];

	baseParts.forEach((part) => {
		const weld = weldParts(primaryPart, part);
		weld.Parent = primaryPart;
		part.Anchored = false;
	});
}

export function unweldModel(model: Model) {
	assert(model !== undefined);
	assert(model.PrimaryPart !== undefined);

	const welds = model.GetDescendants().filter((child) => child.IsA('WeldConstraint'));

	welds.forEach((weld) => {
		weld.Destroy();
	});
}
