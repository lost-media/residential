import { LinkedList } from "Shared/Lib/DataStructures/LinkedList";
import { Test } from "Shared/LMUnit/decorators";
import { Assert } from "Shared/LMUnit/assert";

class TestLinkedList {
	public shouldCreateLinkedList() {
		const linkedList = new LinkedList<number, number>();
		for (let i = 0; i < 100000; i++) {
			linkedList.add(i, i);
		}

		Assert.equal(linkedList.size(), 100000);
		const array = linkedList.toArray();

		Assert.contains(10000, array);
		Assert.notUndefined(array);
	}

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
