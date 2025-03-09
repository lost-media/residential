import { LinkedList } from "Shared/Lib/DataStructures/LinkedList";
import { BeforeEach, BeforeAll, Test, AfterEach, AfterAll, Test2 } from "Shared/LMUnit/decorators";

class TestTest {
	testMethod() {}

	@Test2({ timeout: 1000 })
	testMethod2() {
		for (let i = 0; i < 10000000; i++) {
			new LinkedList().add(i, i);
		}
	}

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

export = TestTest;
