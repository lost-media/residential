export type TestMethod = {
	name: string;
	options: TestAnnotationOptions;
};

export enum Annotation {
	BeforeEach = "BeforeEach",
	BeforeAll = "BeforeAll",
	AfterEach = "AfterEach",
	AfterAll = "AfterAll",
}

export const enum Metadata {
	TestSuite = "lmunit:suite",
	Test = "lmunit:test",
	Profile = "lmunit:profile",
	TestList = "lmunit:testList",
	Annotations = "lmunit:annotations",
}

export type Constructor<T = object> = new (...args: never[]) => T;
export type AbstractConstructor<T = object> = abstract new (...args: never[]) => T;

export type TestAnnotationOptions = {
	timeout?: number;
};
