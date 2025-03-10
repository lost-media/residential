import { AssertionFailedException } from "./exceptions";

type MessageType = string | (() => string);

type ClassType<T = object, Args extends unknown[] = never[]> = {
	new (...args: Args): T;
};

/**
 * Container for all assert statements for unit testing
 *
 * Go to specific function declarations to see statement usage
 *
 * ### List of Assert Statements
 * ---
 * ---
 * #### Logical Assertions
 * - `Assert.equal()`
 * - `Assert.notEqual()`
 * - `Assert.true()`
 * - `Assert.false()`
 * - `Assert.defined()`
 * - `Assert.notDefined()`
 *
 * #### Numerical Assertions
 * - `Assert.greaterThan()`
 * - `Assert.greaterThanOrEqual()`
 * - `Assert.lessThan()`
 * - `Assert.lessThanOrEqual()`
 * - `Assert.between()`
 *
 * #### Array Assertions
 * - `Assert.empty()`
 * - `Assert.notEmpty()`
 * - `Assert.contains()`
 * - `Assert.doesNotContain()`
 *
 * #### Control Assertions
 * - `Assert.throws()`
 * - `Assert.doesNotThrow()`
 *
 * #### Promise Assertions
 * - `Assert.resolves()`
 * - `Assert.rejects()`
 * - `Assert.timeout()`
 */
export abstract class Assert {
	// Helper functions
	private static resolveMessageOrCallback(message: MessageType): string {
		if (typeOf(message) === "string") {
			return message as string;
		} else {
			return (message as () => string)();
		}
	}

	private static throwAssertionFailedException(fallbackMessage: string, message?: MessageType): void {
		throw new AssertionFailedException(
			message !== undefined ? Assert.resolveMessageOrCallback(message) : fallbackMessage,
		);
	}

	public static equal<T>(actual: T, expected: T): void;
	public static equal<T>(actual: T, expected: T, message?: string): void;
	public static equal<T>(actual: T, expected: T, message?: () => string): void;
	public static equal<T>(actual: T, expected: T, message?: MessageType): void {
		if (actual !== true) {
			Assert.throwAssertionFailedException(`Expected: ${expected}, Actual: ${actual}`, message);
		}
	}

	public static notEqual<T>(actual: T, expected: T): void;
	public static notEqual<T>(actual: T, expected: T, message?: string): void;
	public static notEqual<T>(actual: T, expected: T, message?: () => string): void;
	public static notEqual<T>(actual: T, expected: T, message?: MessageType): void {
		if (actual === expected) {
			Assert.throwAssertionFailedException(`Expected ${actual} to not equal ${expected}`, message);
		}
	}

	public static true(actual: boolean): void;
	public static true(actual: boolean, message?: string): void;
	public static true(actual: boolean, message?: () => string): void;
	public static true(actual: boolean, message?: MessageType): void {
		if (actual !== true) {
			Assert.throwAssertionFailedException(`Expected ${actual} to be true`, message);
		}
	}

	public static false(actual: boolean): void;
	public static false(actual: boolean, message?: string): void;
	public static false(actual: boolean, message?: () => string): void;
	public static false(actual: boolean, message?: MessageType): void {
		if (actual === true) {
			Assert.throwAssertionFailedException(`Expected ${actual} to be false`, message);
		}
	}

	public static undefined(actual: unknown): void;
	public static undefined(actual: boolean, message?: string): void;
	public static undefined(actual: boolean, message?: () => string): void;
	public static undefined(actual: unknown, message?: MessageType): void {
		if (actual !== undefined) {
			Assert.throwAssertionFailedException(`Expected ${actual} to be undefined`, message);
		}
	}

	public static notUndefined(actual: unknown): void;
	public static notUndefined(actual: boolean, message?: string): void;
	public static notUndefined(actual: boolean, message?: () => string): void;
	public static notUndefined(actual: unknown, message?: MessageType): void {
		if (actual === undefined) {
			Assert.throwAssertionFailedException(`Expected ${actual} to be defined`, message);
		}
	}

	public static greaterThan(num1: number, num2: number): void;
	public static greaterThan(num1: number, num2: number, message?: string): void;
	public static greaterThan(num1: number, num2: number, message?: () => string): void;
	public static greaterThan(num1: number, num2: number, message?: MessageType): void {
		if (num1 <= num2) {
			Assert.throwAssertionFailedException(`Expected ${num1} to be greater than ${num2}`, message);
		}
	}

	public static greaterThanOrEqual(num1: number, num2: number): void;
	public static greaterThanOrEqual(num1: number, num2: number, message?: string): void;
	public static greaterThanOrEqual(num1: number, num2: number, message?: () => string): void;
	public static greaterThanOrEqual(num1: number, num2: number, message?: MessageType): void {
		if (num1 < num2) {
			Assert.throwAssertionFailedException(`Expected ${num1} to be greater than or equal to ${num2}`, message);
		}
	}

	public static lessThan(num1: number, num2: number): void;
	public static lessThan(num1: number, num2: number, message?: string): void;
	public static lessThan(num1: number, num2: number, message?: () => string): void;
	public static lessThan(num1: number, num2: number, message?: MessageType): void {
		if (num1 >= num2) {
			Assert.throwAssertionFailedException(`Expected ${num1} to be less than ${num2}`, message);
		}
	}

	public static lessThanOrEqual(num1: number, num2: number): void;
	public static lessThanOrEqual(num1: number, num2: number, message?: string): void;
	public static lessThanOrEqual(num1: number, num2: number, message?: () => string): void;
	public static lessThanOrEqual(num1: number, num2: number, message?: MessageType): void {
		if (num1 > num2) {
			Assert.throwAssertionFailedException(`Expected ${num1} to be less than ${num2}`, message);
		}
	}

	public static between(actual: number, min: number, max: number): void;
	public static between(actual: number, min: number, max: number, message?: string): void;
	public static between(actual: number, min: number, max: number, message?: () => string): void;
	public static between(actual: number, min: number, max: number, message?: MessageType): void {
		if (actual > max || actual < min) {
			Assert.throwAssertionFailedException(`Expected ${actual} to be between ${min}-${max}`, message);
		}
	}

	public static throws(method: () => void): void;
	public static throws(method: () => void, exception: string): void;
	public static throws(method: () => void, exception: string, message?: string): void;
	public static throws(method: () => void, exception: string, message?: () => string): void;
	public static throws(callback: () => void, exception?: string | ClassType, message?: MessageType): void {
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

		this.throwAssertionFailedException(
			`Expected method to throw${exception !== undefined ? ' "' + tostring(exception) + `", threw "${thrown}"` : ""}`,
			message,
		);
	}

	public static doesNotThrow(method: () => void): void;
	public static doesNotThrow(method: () => void, message?: string): void;
	public static doesNotThrow(method: () => void, message?: () => string): void;
	public static doesNotThrow(callback: () => void, message?: MessageType): void {
		try {
			callback();
		} catch (e) {
			this.throwAssertionFailedException(`Expected method not to throw, threw:\n${e}`, message);
		}
	}

	// Array Assertions
	public static contains<T extends defined>(expectedElement: T, array: T[]): void;
	public static contains<T extends defined>(array: T[], predicate: (element: T) => boolean): void;
	public static contains<T extends defined>(array: T[], predicate: (element: T) => boolean, message?: string): void;
	public static contains<T extends defined>(
		array: T[],
		predicate: (element: T) => boolean,
		message?: () => string,
	): void;
	public static contains<T extends defined>(
		array: T[] | T,
		predicate: T[] | ((element: T) => boolean),
		message?: MessageType,
	): void {
		if (typeOf(predicate) === "function") {
			if ((<T[]>array).some(<(element: T) => boolean>predicate)) return;
			this.throwAssertionFailedException(`Expected array to contain elements matching predicate`, message);
		} else {
			if ((<T[]>predicate).includes(<T>array)) return;
			this.throwAssertionFailedException(`Expected array to contain elements matching predicate`, message);
		}
	}

	public static doesNotContain<T extends defined>(expectedElement: T, array: T[]): void;
	public static doesNotContain<T extends defined>(array: T[], predicate: (element: T) => boolean): void;
	public static doesNotContain<T extends defined>(
		array: T[],
		predicate: (element: T) => boolean,
		message?: string,
	): void;
	public static doesNotContain<T extends defined>(
		array: T[],
		predicate: (element: T) => boolean,
		message?: () => string,
	): void;
	public static doesNotContain<T extends defined>(
		array: T[] | T,
		predicate: T[] | ((element: T) => boolean),
		message?: MessageType,
	): void {
		if (typeOf(predicate) === "function") {
			if ((<T[]>array).some(<(element: T) => boolean>predicate)) return;
			this.throwAssertionFailedException(`Expected array to contain elements matching predicate`, message);
		} else {
			if ((<T[]>predicate).includes(<T>array)) return;
			this.throwAssertionFailedException(`Expected array to contain elements matching predicate`, message);
		}
	}

	public static empty<T extends defined>(array: T[]): void;
	public static empty<T extends defined>(array: T[], message?: string): void;
	public static empty<T extends defined>(array: T[], message?: () => string): void;
	public static empty<T extends defined>(array: T[], message?: MessageType): void {
		const size = array.size();
		if (size === 0) return;

		if (message !== undefined) {
			throw new AssertionFailedException(Assert.resolveMessageOrCallback(message));
		} else {
			throw new AssertionFailedException(`Expected array to be empty, instead size ${size}`);
		}
	}

	public static notEmpty<T extends defined>(array: T[]): void;
	public static notEmpty<T extends defined>(array: T[], message?: string): void;
	public static notEmpty<T extends defined>(array: T[], message?: () => string): void;
	public static notEmpty<T extends defined>(array: T[], message?: MessageType): void {
		const size = array.size();
		if (size !== 0) return;
		if (message !== undefined) {
			throw new AssertionFailedException(Assert.resolveMessageOrCallback(message));
		} else {
			throw new AssertionFailedException(`Expected array to be empty, instead size ${size}`);
		}
	}

	// Async Assertions
	public static resolves<T>(promise: Promise<T>): void;
	public static resolves<T>(promise: Promise<T>, message?: string): void;
	public static resolves<T>(promise: Promise<T>, message?: () => string): void;
	public static resolves<T>(promise: Promise<T>, message?: MessageType): void {
		const [status] = promise.awaitStatus();

		if (status === "Resolved") return;

		if (message !== undefined) {
			throw new AssertionFailedException(Assert.resolveMessageOrCallback(message));
		} else {
			throw new AssertionFailedException(`Expected Promise to resolve, instead it ${status}`);
		}
	}

	public static rejects<T>(promise: Promise<T>): void;
	public static rejects<T>(promise: Promise<T>, message?: string): void;
	public static rejects<T>(promise: Promise<T>, message?: () => string): void;
	public static rejects<T>(promise: Promise<T>, message?: MessageType): void {
		const [status] = promise.awaitStatus();

		if (status === "Rejected") return;

		if (message !== undefined) {
			throw new AssertionFailedException(Assert.resolveMessageOrCallback(message));
		} else {
			throw new AssertionFailedException(`Expected Promise to reject, instead it ${status}`);
		}
	}

	public static async timeout<T>(promise: Promise<T>, duration: number): Promise<void>;
	public static async timeout<T>(promise: Promise<T>, duration: number, message?: string): Promise<void>;
	public static async timeout<T>(promise: Promise<T>, duration: number, message?: () => string): Promise<void>;
	public static async timeout<T>(promise: Promise<T>, duration: number, message?: MessageType): Promise<void> {
		const [status] = promise.timeout(duration).awaitStatus();

		if (status === "Resolved") return;

		if (message !== undefined) {
			throw new AssertionFailedException(Assert.resolveMessageOrCallback(message));
		} else {
			throw new AssertionFailedException(`Expected Promise to resolve within ${duration} seconds`);
		}
	}
}
