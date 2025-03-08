import { profileFunction, ProfileObject } from "Shared/Util/Profiler";
import { getTestMethods } from "../Decorators";

export abstract class BaseTest {
	private totalTests: number = 0;
	private testsPassed: number = 0;

	public beforeAll() {}

	runTests() {
		const methods = getTestMethods(this);
		const classAsString = tostring(this);

		this.totalTests = methods.size();
		this.testsPassed = 0;

		print(`----------- Running tests for ${classAsString} -----------`);
		print("                                                        ");

		methods.forEach((method) => {
			const shouldProfile = method.shouldProfile;
			const [success, data] = pcall(() => {
				const thisAsString = this as unknown as Record<string, () => void>;

				const methodToRun = thisAsString[method.name];

				if (shouldProfile) {
					const profileData = profileFunction(() => methodToRun());
					return profileData;
				} else {
					methodToRun();
				}
			});

			if (!success) {
				print(`\t- Test %s failed: %s`.format(method.name, tostring(data).split(":")[2]));
			} else {
				this.testsPassed += 1;
				if (shouldProfile && data !== undefined && (data as ProfileObject<void>).timeElapsed !== undefined)
					print(
						`\t- Test %s passed. Took %2f.ms`.format(
							method.name,
							(data as ProfileObject<void>).timeElapsed,
						),
					);
				else print(`\t- Test %s passed`.format(method.name));
			}
		});

		print("                                                        ");
		print(`Tests for ${classAsString} complete. ${this.testsPassed}/${this.totalTests} test(s) passed.`);
		print("                                                        ");
	}
}
