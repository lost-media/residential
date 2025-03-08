import { Metadata, TestMethod } from "./common";
import { setMetadata } from "./utils";

function addTest<T extends object>(ctor: T, testName: string, shouldProfile: boolean = false): void {
	const ctorCast = <{ [key: string]: unknown }>ctor;
	if (ctorCast[Metadata.TestList] !== undefined) {
		const map = <Map<string, TestMethod>>ctorCast[Metadata.TestList];
		map.set(testName, {
			name: testName,
			shouldProfile: map.get(testName)?.shouldProfile || shouldProfile,
		});
	} else {
		ctorCast[Metadata.TestList] = {
			[testName]: {
				name: testName,
				shouldProfile: shouldProfile,
			},
		};
	}
}

export function TestSuite<T extends object>(ctor: T): void {
	if (ctor === undefined) throw "Target cannot be null";
	setMetadata(ctor, Metadata.TestSuite, true);
}

export function Test<T extends object>(
	ctor: T,
	propertyKey: string,
	_: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
): void {
	if (ctor === undefined) throw "Target cannot be null";
	addTest(ctor, propertyKey);
}

export function Profile<T extends object>(
	ctor: T,
	propertyKey: string,
	_: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
): void {
	if (ctor === undefined) throw "Target cannot be null";
	addTest(ctor, propertyKey, true);
}
