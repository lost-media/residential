/* Profiler
 * Function: To track the performance of requests for debugging purposes
 */

import { getAverageOfList } from "../array-utils";

type Function<T> = () => T;

export type ProfileObject<T> = {
	timeElapsed: number;
	result: T;
};

/**
 * Profiles the execution time of a given function.
 *
 * @template T - The return type of the function being profiled.
 * @param fnc - The function to profile.
 * @returns An object containing the time elapsed during the function's execution and the function's result.
 *
 * @example
 * const result = profileFunction(() => {
 *     // Some expensive operation
 *     for (let i = 0; i < 1000000; i++) {}
 *     return "Done";
 * });
 *
 * print(`Time Elapsed: ${result.timeElapsed} seconds`);
 * print(`Result: ${result.result}`);
 */
export function profileFunction<T>(fnc: Function<T>): ProfileObject<T> {
	const start = os.clock();

	// do function here
	const result = fnc();

	const finish = os.clock();

	return {
		timeElapsed: finish - start,
		result,
	} satisfies ProfileObject<T>;
}

/**
 * A utility class for profiling repeated operations and calculating average execution times.
 */
export class RepeatableProfiler {
	private maxEntries: number;

	private entries: Array<number>;

	private isTracking: boolean;
	private lastUpdate: number;
	private nextIndexToUpdate;

	/**
	 * Creates a new instance of `RepeatableProfiler`.
	 *
	 * @example
	 * const profiler = new RepeatableProfiler();
	 */
	constructor(maxEntries?: number) {
		this.maxEntries = maxEntries ?? 1000;
		this.entries = new Array<number>(this.maxEntries);

		this.isTracking = false;
		this.lastUpdate = os.clock();
		this.nextIndexToUpdate = 0;
	}

	/**
	 * Starts tracking the time for an operation.
	 * If tracking is already active, this method does nothing.
	 *
	 * @example
	 * profiler.tic();
	 */
	tic(): void {
		if (this.isTracking === true) {
			return;
		}

		this.isTracking = true;
		this.lastUpdate = os.clock();
	}

	/**
	 * Stops tracking the time for an operation and records the elapsed time.
	 * If the maximum number of entries is reached, it overwrites the oldest entry.
	 *
	 * @example
	 * profiler.tic();
	 * // Perform some operation
	 * profiler.toc();
	 */
	toc(): void {
		if (this.isTracking === false) {
			return;
		}

		const time = os.clock() - this.lastUpdate;

		this.isTracking = false;
		this.entries[this.nextIndexToUpdate] = time;

		this.nextIndexToUpdate++;

		if (this.nextIndexToUpdate >= this.maxEntries) {
			this.nextIndexToUpdate = 0;
		}
	}

	/**
	 * Calculates the average time of all recorded entries.
	 *
	 * @returns The average time in seconds.
	 *
	 * @example
	 * const averageTime = profiler.getAverageTime();
	 * print(`Average Time: ${averageTime} seconds`);
	 */
	getAverageTime(): number {
		return getAverageOfList(this.entries.filter((val, index) => index <= this.nextIndexToUpdate));
	}

	/**
	 * Returns the average time of all recorded entries as a formatted string.
	 *
	 * @returns A string representing the average time in seconds.
	 *
	 * @example
	 * const formattedAverage = profiler.getFormattedAverage();
	 * print(`Average Time: ${formattedAverage}`);
	 */
	getFormattedAverage(): string {
		return string.format("%2f s", this.getAverageTime());
	}
}
