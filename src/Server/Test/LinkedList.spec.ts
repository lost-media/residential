import { BaseTest } from "Shared/Test/BaseTest";
import { Test } from "Shared/Test/Decorators";

class TestLinkedList extends BaseTest {
	public name: string = "TestLinkedList";

	@Test
	public testMethod() {
		// Test goes here
		print("TestLinkedList.testMethod");
	}
}

export = TestLinkedList;
