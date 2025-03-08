export function assertEqual<T>(actual: T, expected: T, message?: string): void {
	if (actual !== expected) {
		error(message !== undefined ? message : `Expected ${tostring(expected)}, but got ${tostring(actual)}`);
	}
}

export function assertTrue(value: boolean, message?: string): void {
	if (!value) {
		error(message !== undefined ? message : `Expected true, but got ${tostring(value)}`);
	}
}

export function assertFalse(value: boolean, message?: string): void {
	if (value) {
		error(message !== undefined ? message : `Expected false, but got ${tostring(value)}`);
	}
}
