import { Profile, Test, TestSuite } from "Shared/LMUnit/decorators";
import { Assert } from "Shared/LMUnit/assert";

@TestSuite
class FuzzySearchTest {
	private something: boolean = false;

	setup() {
		this.something = true;
	}

	@Test
	public testMethod() {
		Assert.equal(1, 1);
		Assert.equal(2, 1);

		Assert.equal(2, 5);

		print(this.something);
		Assert.true(this.something);
	}

	@Test
	public testMethod2() {
		Assert.equal(2, 1);
		Assert.equal(2, 5);
	}

	@Test
	@Profile
	public testMethod3() {
		Assert.equal(2, 2);
	}

	public beforeEach(): void {}
}

export = FuzzySearchTest;
