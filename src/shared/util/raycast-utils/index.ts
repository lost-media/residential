export function visualizeRaycast(raycastResult: RaycastResult, originPosition: Vector3): BasePart {
	const part = new Instance('Part');
	part.Anchored = true;
	part.CanCollide = false;
	part.Transparency = 0.9;
	part.Color = Color3.fromRGB(255, 0, 0);

	const direction = raycastResult.Position.sub(originPosition);
	const length = direction.Magnitude;

	part.Size = new Vector3(0.1, 0.1, length);
	part.CFrame = new CFrame(originPosition.add(direction.div(2)), raycastResult.Position);
	return part;
}
