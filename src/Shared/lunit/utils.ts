import { Annotation, Metadata, TestMethod, TestAnnotationOptions } from "./common";

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

export function addTest<T extends object>(ctor: T, testName: string, options: TestAnnotationOptions): void {
	const ctorCast = <{ [key: string]: unknown }>ctor;
	if (ctorCast[Metadata.TestList] !== undefined) {
		const map = <Map<string, TestMethod>>ctorCast[Metadata.TestList];
		map.set(testName, {
			name: testName,
			options,
		});
	} else {
		ctorCast[Metadata.TestList] = {
			[testName]: {
				name: testName,
				options,
			},
		};
	}
}

export function addAnnotations<T extends object>(ctor: T, functionName: string, annotation: Annotation): void {
	const ctorCast = <{ [key: string]: unknown }>ctor;
	if (ctorCast[Metadata.Annotations] !== undefined) {
		const map = <Map<Annotation, Callback[]>>ctorCast[Metadata.Annotations];
		const gottenAnnotations = map.get(annotation);

		if (gottenAnnotations !== undefined) {
			gottenAnnotations.push(ctorCast[functionName] as Callback);
		} else {
			map.set(annotation, [ctorCast[functionName] as Callback]);
		}
	} else {
		// add it here
		ctorCast[Metadata.Annotations] = {
			[annotation]: [ctorCast[functionName] as Callback],
		};
	}
}

export function getAnnotation<T extends object>(ctor: T, annotation: Annotation): Callback[] {
	const ctorCast = <{ [key: string]: unknown }>ctor;
	if (ctorCast[Metadata.Annotations] === undefined) return [];

	const map = <Map<Annotation, Callback[]>>(ctorCast[Metadata.Annotations] as unknown);
	const gottenAnnotations = map.get(annotation);

	return gottenAnnotations || [];
}
