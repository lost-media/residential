import { BeforeEach, BeforeAll, Test, AfterEach, AfterAll } from "Shared/LMUnit/decorators";

class FuzzySearchTest {
	@Test
	testMethod() {}

	@Test
	testMethod2() {}

	@BeforeEach
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
}

export = FuzzySearchTest;
