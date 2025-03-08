type TestMethod = {
	name: string;
	shouldProfile: boolean;
};

const testMethods: { [key: string]: TestMethod[] } = {};
const profiledMethods: { [key: string]: string[] } = {};

export function Test(target: object, functionName: string, descriptor: TypedPropertyDescriptor<unknown>): void {
	const targetString = tostring(target);

	if (testMethods[targetString] === undefined) {
		testMethods[targetString] = [];
	}
	testMethods[targetString].push({
		name: functionName,
		shouldProfile:
			profiledMethods[targetString] !== undefined && profiledMethods[targetString].includes(functionName),
	});
}

export function Profile(target: object, functionName: string, descriptor: TypedPropertyDescriptor<unknown>): void {
	const targetString = tostring(target);

	if (profiledMethods[targetString] === undefined) {
		profiledMethods[targetString] = [];
	}
	profiledMethods[targetString].push(functionName);

	if (testMethods[targetString] === undefined) {
		testMethods[targetString] = [];
	}
	if (testMethods[targetString].find((method) => method.name === functionName) === undefined) {
		testMethods[targetString].push({
			name: functionName,
			shouldProfile: true,
		});
	} else {
		testMethods[targetString].find((method) => method.name === functionName)!.shouldProfile = true;
	}
}

export function getTestMethods(target: object): TestMethod[] {
	const targetString = tostring(target);
	return testMethods[targetString] || [];
}
