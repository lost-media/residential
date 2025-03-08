import { LinkedList } from "Shared/Lib/DataStructures/LinkedList";
import { BaseTest } from "Shared/Test/BaseTest";
import { Profile, Test } from "Shared/Test/Decorators";

class TestLinkedList extends BaseTest {
	@Profile
	@Test
	public testMethod() {
		const linkedList = new LinkedList<number, number>();
		for (let i = 0; i < 100000; i++) {
			linkedList.add(i, i);
		}
	}
}

export = TestLinkedList;
