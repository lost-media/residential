import { Annotation, TestAnnotationOptions } from "./common";
import { addTest, addAnnotations } from "./utils";

export function Test<T extends object>(
	ctor: T,
	propertyKey: string,
	properties: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
): void {
	if (ctor === undefined) throw "Target cannot be null";
	addTest(ctor, propertyKey, {});
}

export function Test2(options: TestAnnotationOptions) {
	return function <T extends object>(
		ctor: T,
		propertyKey: string,
		_: TypedPropertyDescriptor<(this: T, ...args: void[]) => void>,
	): void {
		if (ctor === undefined) throw "Target cannot be null";
		addTest(ctor, propertyKey, options);
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
