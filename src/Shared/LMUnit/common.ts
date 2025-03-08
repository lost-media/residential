export type TestMethod = {
	name: string;
	shouldProfile: boolean;
};

export const enum Metadata {
	TestSuite = "lmunit:suite",
	Test = "lmunit:test",
	Profile = "lmunit:profile",
	TestList = "lmunit:testList",
}

export type Constructor<T = object> = new (...args: never[]) => T;
export type AbstractConstructor<T = object> = abstract new (...args: never[]) => T;
