import { Metadata } from "./common";

export function flatten<T extends defined>(arr: (T | T[])[]): T[] {
	const result: T[] = [];
	for (const item of arr) {
		if (typeIs(item, "table")) {
			const flattenedItem = flatten(item as T[]);
			for (const subItem of flattenedItem) {
				result.push(subItem);
			}
		} else {
			result.push(item);
		}
	}
	return result;
}

export function hasMetadata<T extends object>(ctor: T, data: Metadata): boolean {
	const ctorCast = <{ [key: string]: unknown }>ctor;
	return ctorCast[data] !== undefined;
}

export function setMetadata<T extends object, U>(ctor: T, data: Metadata, value: U): void {
	const ctorCast = <{ [key: string]: unknown }>ctor;
	ctorCast[data] = value;
}
