import { Annotation } from "./common";
import { addTest, addAnnotations } from "./utils";

export function Test<T extends object>(
	ctor: T,
	propertyKey: string,
	properties: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
): void {
	if (ctor === undefined) throw "Target cannot be null";
	addTest(ctor, propertyKey, {});
}

export function Disabled(message?: string) {
	return function <T extends object>(
		ctor: T,
		propertyKey?: string,
		_?: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
	): void {
		if (ctor === undefined) throw "Target cannot be null";
		// addTest(ctor, propertyKey, options);
	};
}

export function DisplayName(name: string) {
	return function <T extends object>(
		ctor: T,
		propertyKey?: string,
		_?: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
	): void {
		if (ctor === undefined) throw "Target cannot be null";
		// addTest(ctor, propertyKey, options);
	};
}

export function Timeout(timeInMilliseconds: number) {
	return function <T extends object>(
		ctor: T,
		propertyKey?: string,
		_?: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
	): void {
		if (ctor === undefined) throw "Target cannot be null";
		// addTest(ctor, propertyKey, options);
	};
}

export function Order(orderIndex: number) {
	return function <T extends object>(
		ctor: T,
		propertyKey?: string,
		_?: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
	): void {
		if (ctor === undefined) throw "Target cannot be null";
		// addTest(ctor, propertyKey, options);
	};
}

type Scope = "Client" | "Server" | "Both";

export function EnableInScope(scope: Scope) {
	return function <T extends object>(
		ctor: T,
		propertyKey?: string,
		_?: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
	): void {
		if (ctor === undefined) throw "Target cannot be null";
		// addTest(ctor, propertyKey, options);
	};
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
	addAnnotations(ctor, propertyKey, Annotation.AfterAll);
}

export default {
	Test,
	DisplayName,
	Before,
	BeforeAll,
	BeforeEach,
	After,
	AfterEach,
	AfterAll,
};
