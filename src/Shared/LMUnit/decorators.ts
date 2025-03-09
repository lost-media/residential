import { Annotation, Metadata } from "./common";
import { setMetadata, addTest, addAnnotations } from "./utils";

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

export function BeforeEach<T extends object>(
	ctor: T,
	propertyKey: string,
	_: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
): void {
	if (ctor === undefined) throw "Target cannot be null";
	addAnnotations(ctor, propertyKey, Annotation.BeforeEach);
}

export function Before<T extends object>(
	ctor: T,
	propertyKey: string,
	_: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
): void {
	if (ctor === undefined) throw "Target cannot be null";
	addAnnotations(ctor, propertyKey, Annotation.BeforeEach);
}

export function BeforeAll<T extends object>(
	ctor: T,
	propertyKey: string,
	_: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
): void {
	if (ctor === undefined) throw "Target cannot be null";
	addAnnotations(ctor, propertyKey, Annotation.BeforeAll);
}

export function After<T extends object>(
	ctor: T,
	propertyKey: string,
	_: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
): void {
	if (ctor === undefined) throw "Target cannot be null";
	addAnnotations(ctor, propertyKey, Annotation.AfterEach);
}

export function AfterEach<T extends object>(
	ctor: T,
	propertyKey: string,
	_: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
): void {
	if (ctor === undefined) throw "Target cannot be null";
	addAnnotations(ctor, propertyKey, Annotation.AfterEach);
}

export function AfterAll<T extends object>(
	ctor: T,
	propertyKey: string,
	_: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
): void {
	if (ctor === undefined) throw "Target cannot be null";
	addAnnotations(ctor, propertyKey, Annotation.AfterEach);
}
