import { assertEqual } from "Shared/Test/Assert";
import { BaseTest } from "Shared/Test/BaseTest";
import { Profile, Test } from "Shared/Test/Decorators";

class FuzzySearchTest extends BaseTest {
	@Test
	public testMethod() {
		assertEqual(1, 1);
		assertEqual(2, 1);

		assertEqual(2, 5);
	}

	@Test
	public testMethod2() {
		assertEqual(2, 1);
		assertEqual(2, 5);
	}

	@Profile
	@Test
	public testMethod3() {
		assertEqual(2, 2);
	}

	public beforeAll(): void {
		print("FuzzySearchTest.beforeAll");
	}
}

export = FuzzySearchTest;
