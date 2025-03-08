import { getTestMethods } from "../Decorators";

export abstract class BaseTest<T = object> {
	private totalTests: number = 0;
	private testsPassed: number = 0;

	public beforeAll(): void {}
	public beforeEach(): void {}

	runTests() {
		const methods = getTestMethods(this);
		const classAsString = tostring(this);

		this.totalTests = methods.size();
		this.testsPassed = 0;

		print(`--- Running tests for ${classAsString} ---`);

		methods.forEach((method) => {
			this.beforeEach();

			const [success, data] = pcall(() => {
				const thisAsString = this as unknown as Record<string, () => void>;
				const methodToRun = thisAsString[method.name];
				methodToRun();
			});

			if (!success) {
				warn(`\t-  ${tostring(data)}`);
			} else {
				this.testsPassed += 1;
				print(`\t- Test passed`);
			}
		});

		print(`Tests for ${classAsString} complete. ${this.testsPassed}/${this.totalTests} test(s) passed.`);
	}
}
