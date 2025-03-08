import { BaseTest } from "Shared/LMUnit/BaseTest";
import { Profile, Test } from "Shared/LMUnit/Decorators";
import { Assert } from "Shared/LMUnit/Assert";

interface FuzzySearchTestProps {
	someProperty: number;
}

class FuzzySearchTest extends BaseTest<FuzzySearchTest> {
	@Test
	public testMethod() {
		Assert.equal(1, 1);
		Assert.equal(2, 1);

		Assert.equal(2, 5);
	}

	@Test
	public testMethod2() {
		Assert.equal(2, 1);
		Assert.equal(2, 5);
	}

	@Profile
	@Test
	public testMethod3() {
		Assert.equal(2, 2);
	}

	public beforeEach(): void {}
}

export = FuzzySearchTest;
