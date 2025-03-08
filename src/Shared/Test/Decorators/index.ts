const testMethods: { [key: string]: string[] } = {};

export function Test(target: object, functionName: string, descriptor: TypedPropertyDescriptor<unknown>): void {
	const targetString = tostring(target);

	if (testMethods[targetString] === undefined) {
		testMethods[targetString] = [];
	}
	testMethods[targetString].push(functionName);
}

export function getTestMethods(target: object): string[] {
	const targetString = tostring(target);
	return testMethods[targetString] || [];
}
