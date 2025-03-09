import { LinkedList } from "shared/lib/DataStructures/LinkedList";
import { Test } from "shared/lunit/decorators";
import { Assert } from "shared/lunit/assert";

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
