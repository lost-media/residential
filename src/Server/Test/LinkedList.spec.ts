import { LinkedList } from "Shared/Lib/DataStructures/LinkedList";
import { Profile, Test, TestSuite } from "Shared/LMUnit/decorators";
import { Assert } from "Shared/LMUnit/assert";

@TestSuite
class TestLinkedList {
	@Profile
	@Test
	public shouldCreateLinkedList() {
		const linkedList = new LinkedList<number, number>();
		for (let i = 0; i < 100000; i++) {
			linkedList.add(i, i);
		}

		Assert.equal(linkedList.size(), 100000);
		const array = linkedList.toArray();

		Assert.contains(100000, array);
		Assert.notUndefined(array);
	}

	@Test
	public shouldClearLinkedList() {
		const linkedList = new LinkedList<number, number>();
		for (let i = 0; i < 100000; i++) {
			linkedList.add(i, i);
		}

		Assert.equal(linkedList.size(), 100000);
		linkedList.clear();

		Assert.empty(linkedList.toArray());
	}
}

export = TestLinkedList;
