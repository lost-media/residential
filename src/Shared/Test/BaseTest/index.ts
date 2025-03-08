import { profileFunction } from "Shared/Util/Profiler";
import { getTestMethods } from "../Decorators";

export abstract class BaseTest {
	abstract name: string;

	runTests() {
		const methods = getTestMethods(this);
		methods.forEach((method) => {
			const thisAsString = this as unknown as Record<string, () => void>;
			const methodToRun = thisAsString[method];
			const profileData = profileFunction(() => methodToRun());
			print(`Test ${method} took ${profileData.timeElapsed}ms`);
		});
	}
}
