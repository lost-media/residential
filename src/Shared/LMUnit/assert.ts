type ClassType<T = object, Args extends unknown[] = never[]> = {
	new (...args: Args): T;
};

class AssertionFailedException {
	public readonly message: string;

	public constructor(expected: unknown, actual: unknown);
	public constructor(message?: string);
	public constructor(message: unknown, actual?: unknown) {
		this.message = actual !== undefined ? `Expected: ${message}, Actual: ${actual}` : <string>message;
		error(this.toString(), 4);
	}

	public toString(): string {
		return this.message;
	}
}

export class Assert {
	public static equal<T>(actual: T, expected: T): void;
	public static equal<T>(actual: T, expected: T, message?: string): void {
		if (actual !== expected) {
			if (message !== undefined) {
				throw new AssertionFailedException(message);
			} else {
				throw new AssertionFailedException(expected, actual);
			}
		}
	}

	public static notEqual<T>(actual: T, expected: T): void;
	public static notEqual<T>(actual: T, expected: T, message?: string): void {
		if (actual === expected) {
			if (message !== undefined) {
				throw new AssertionFailedException(message);
			} else {
				throw new AssertionFailedException(expected, actual);
			}
		}
	}

	public static true(actual: boolean): void;
	public static true(actual: boolean, message?: string): void {
		if (actual === true) return;

		if (message !== undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(true, actual);
		}
	}

	public static false(actual: boolean): void;
	public static false(actual: boolean, message?: string): void {
		if (actual === false) return;
		if (message !== undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(false, actual);
		}
	}

	public static undefined(actual: unknown): void;
	public static undefined(actual: unknown, message?: string): void {
		if (actual === undefined) return;
		if (message !== undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(undefined, actual);
		}
	}

	public static notUndefined(actual: unknown): void;
	public static notUndefined(actual: unknown, message?: string): void {
		if (actual !== undefined) return;
		if (message === undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException("not nil", actual);
		}
	}

	public static greaterThan(actual: number, expected: number): void;
	public static greaterThan(actual: number, expected: number, message?: string): void {
		if (actual > expected) return;
		if (message === undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(`Expected ${actual} to be greater than ${expected}`);
		}
	}

	public static greaterThanOrEqual(actual: number, expected: number): void;
	public static greaterThanOrEqual(actual: number, expected: number, message?: string): void {
		if (actual >= expected) return;
		if (message === undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(`Expected ${actual} to be greater than or equal to ${expected}`);
		}
	}

	public static lessThan(actual: number, expected: number): void;
	public static lessThan(actual: number, expected: number, message?: string): void {
		if (actual < expected) return;
		if (message === undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(`Expected ${actual} to be less than ${expected}`);
		}
	}

	public static lessThanOrEqual(actual: number, expected: number): void;
	public static lessThanOrEqual(actual: number, expected: number, message?: string): void {
		if (actual <= expected) return;
		if (message === undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(`Expected ${actual} to be less than or equal to ${expected}`);
		}
	}

	public static between(actual: number, min: number, max: number): void;
	public static between(actual: number, min: number, max: number, message?: string): void {
		if (actual >= min && actual <= max) return;
		if (message === undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(`Expected ${actual} to be between ${min}-${max}`);
		}
	}

	public static throws(method: () => void): void;
	public static throws(method: () => void, exception: string): void;
	public static throws(callback: () => void, exception?: string | ClassType, message?: string): void {
		let thrown: unknown = undefined;

		try {
			callback();
		} catch (e) {
			thrown = e;
			if (exception !== undefined) {
				if (e === exception) return;
				if (exception instanceof <ClassType>exception) return;
			} else {
				return;
			}
		}

		throw new AssertionFailedException(
			message !== undefined
				? message
				: `Expected method to throw${exception !== undefined ? ' "' + tostring(exception) + `", threw "${thrown}"` : ""}`,
		);
	}

	public static doesNotThrow(method: () => void): void;
	public static doesNotThrow(callback: () => void, message?: string): void {
		try {
			callback();
		} catch (e) {
			throw new AssertionFailedException(
				message !== undefined ? message : `Expected method not to throw, threw:\n${e}`,
			);
		}
	}

	// Array Assertions

	public static contains<T extends defined>(expectedElement: T, array: T[]): void;
	public static contains<T extends defined>(array: T[], predicate: (element: T) => boolean): void;
	public static contains<T extends defined>(
		array: T[] | T,
		predicate: T[] | ((element: T) => boolean),
		message?: string,
	): void {
		if (typeOf(predicate) === "function") {
			if ((<T[]>array).some(<(element: T) => boolean>predicate)) return;
			throw new AssertionFailedException(
				message !== undefined ? message : `Expected array to contain elements matching predicate`,
			);
		} else {
			if ((<T[]>predicate).includes(<T>array)) return;
			throw new AssertionFailedException(
				message !== undefined ? message : `Expected array to contain elements matching predicate`,
			);
		}
	}

	public static empty<T extends defined>(array: T[]): void;
	public static empty<T extends defined>(array: T[], message?: string): void {
		const size = array.size();
		if (size === 0) return;
		if (message !== undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(`Expected array to be empty, instead size ${size}`);
		}
	}

	public static notEmpty<T extends defined>(array: T[]): void;
	public static notEmpty<T extends defined>(array: T[], message?: string): void {
		const size = array.size();
		if (size !== 0) return;
		if (message !== undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(`Expected array to be empty, instead size ${size}`);
		}
	}

	// Async Assertions
	public static resolves<T>(promise: Promise<T>): void;
	public static resolves<T>(promise: Promise<T>, message?: string): void {
		const [status] = promise.awaitStatus();

		if (status === "Resolved") return;

		if (message !== undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(`Expected Promise to resolve, instead it ${status}`);
		}
	}

	public static rejects<T>(promise: Promise<T>): void;
	public static rejects<T>(promise: Promise<T>, message?: string): void {
		const [status] = promise.awaitStatus();

		if (status === "Rejected") return;

		if (message !== undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(`Expected Promise to reject, instead it ${status}`);
		}
	}

	public static timeout<T>(promise: Promise<T>, duration: number): void;
	public static timeout<T>(promise: Promise<T>, duration: number, message?: string): void {
		const [status] = promise.timeout(duration).awaitStatus();

		if (status === "Resolved") return;

		if (message !== undefined) {
			throw new AssertionFailedException(message);
		} else {
			throw new AssertionFailedException(`Expected Promise to resolve within ${duration} seconds`);
		}
	}
}
