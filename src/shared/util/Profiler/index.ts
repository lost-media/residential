/* Profiler
 * Function: To track the performance of requests for debugging purposes
 */

type Function<T> = () => T;

export type ProfileObject<T> = {
	timeElapsed: number;
	result: T;
};

export function profileFunction<T>(fnc: Function<T>): ProfileObject<T> {
	const start = tick();

	// do function here
	const result = fnc();

	const finish = tick();

	return {
		timeElapsed: finish - start,
		result,
	} satisfies ProfileObject<T>;
}
