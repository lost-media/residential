export function cframeComponentsToArray(cframe: CFrame): Array<number> {
	const [x, y, z, r00, r01, r02, r10, r11, r12, r20, r21, r22] = cframe.GetComponents();
	return [x, y, z, r00, r01, r02, r10, r11, r12, r20, r21, r22];
}

export function componentsArrayToCFrame(components: Array<number>) {
	return new CFrame(
		components[0],
		components[1],
		components[2],
		components[3],
		components[4],
		components[5],
		components[6],
		components[7],
		components[8],
		components[9],
		components[10],
		components[11],
	);
}
