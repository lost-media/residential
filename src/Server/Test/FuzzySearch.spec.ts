import { Test } from "Shared/LMUnit/decorators";
import { Assert } from "Shared/LMUnit/assert";
import { LinkedList } from "Shared/Lib/DataStructures/LinkedList";

class FuzzySearchTest {
	private something: boolean = false;

	public setUp() {
		this.something = true;
	}

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
