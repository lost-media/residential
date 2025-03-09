import { Assert } from "shared/lunit/assert";
import { BeforeEach, BeforeAll, Test, AfterEach, AfterAll } from "shared/lunit/decorators";

class TestTest {
	@Test
	hmm() {}
	@Test
	async test() {
		// Number
		Assert.between(5, 1, 10);
		Assert.greaterThan(5, 0);
		Assert.greaterThanOrEqual(5, 5);
		Assert.lessThan(0, 10);
		Assert.lessThanOrEqual(5, 10);

		// Logic
		Assert.equal(1, 1);
		Assert.false(false);
		Assert.notEqual(1, 2);
		Assert.notUndefined(5);
		Assert.true(true);
		Assert.undefined(undefined);

		// Array
		Assert.contains(2, [1, 2, 3]);
		Assert.empty([]);
		Assert.notEmpty([1]);

		// Promise
		Assert.rejects(Promise.reject(0));
		Assert.resolves(Promise.resolve());
		await Assert.timeout(Promise.delay(5), 2);

		// Control
		Assert.doesNotThrow(() => {});
		Assert.throws(() => error("This should error"));
	}

	/*@BeforeEach
	beforeEach() {
		// runs before each test executes
		print("This runs before each test executes");
	}

	@BeforeAll
	beforeAll() {
		// runs before the first test begins
		print("This runs before the first test executes");
	}

	@AfterEach
	afterEach() {
		// runs after each test executes
		print("This runs after each test executes");
	}

	@AfterAll
	afterAll() {
		// runs after each test executes
		print("This runs after the last test executes");
	}
        */
}

export = TestTest;
