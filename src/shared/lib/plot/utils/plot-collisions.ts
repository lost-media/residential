import { Workspace } from "@rbxts/services";

export function hitboxIsCollidedInPlot(hitbox: BasePart, ignoreDescendants: Instance[]) {
	if (hitbox === undefined) {
		return false;
	}

	const collisionPoints = Workspace.GetPartsInPart(hitbox);

	for (let i = 0; i < collisionPoints.size(); i++) {
		const part = collisionPoints[i];

		if (part.CanTouch === false) {
			continue;
		}

		let isInIgnoreList: boolean = false as boolean;
		ignoreDescendants.forEach((instance) => {
			if (part.IsDescendantOf(instance) === true) {
				isInIgnoreList = true;
			}
		});

		if (isInIgnoreList === true) {
			continue;
		}

		// at this point, the object is colliding with something else
		return true;
	}

	return false;
}
