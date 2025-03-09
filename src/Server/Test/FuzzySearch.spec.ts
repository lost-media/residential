import { DisplayName, Test } from "shared/lunit/decorators";
import { Assert } from "shared/lunit/assert";
import { LinkedList } from "shared/lib/DataStructures/LinkedList";

@DisplayName("idk")
class FuzzySearchTest {
	private something: boolean = false;

	public setUp() {
		this.something = true;
	}

	@DisplayName("TEST")
	public testMethod() {
		Assert.equal(1, 1);
		Assert.equal(2, 2);

		Assert.equal(5, 5);
		Assert.true(this.something);
	}

	public testMethod2() {
		Assert.equal(2, 2);
		Assert.equal(5, 5);
	}

	public testMethod3() {
		Assert.equal(2, 2);
	}

	public beforeEach(): void {}
}

export = FuzzySearchTest;
