import { LinkedList } from "shared/lib/DataStructures/LinkedList";
import { Assert, Decorators } from "@rbxts/lunit";

@Decorators.Tag("Library")
class TestLinkedList {
	private testLinkedList: LinkedList<defined, defined> = new LinkedList<number, number>();

	@Decorators.BeforeEach
	setUp() {
		this.testLinkedList.clear();
	}

	@Decorators.Test
	testListCreate() {
		this.testLinkedList = new LinkedList();

		// Should create an empty linked list
		Assert.equal(this.testLinkedList.size(), 0);
	}

	@Decorators.Test
	testListAdd() {
		this.testLinkedList.add(1, 5);

		// Should add one to the size
		Assert.equal(this.testLinkedList.size(), 1);

		Assert.equal(this.testLinkedList.keys()[0], 1);
		Assert.equal(this.testLinkedList.values()[0], 5);
	}

	@Decorators.Test
	testListRemove() {
		this.testLinkedList.add(1, 5);

		// Should add one to the size
		Assert.equal(this.testLinkedList.size(), 1);

		Assert.equal(this.testLinkedList.keys()[0], 1);
		Assert.equal(this.testLinkedList.values()[0], 5);

		// Remove element
		this.testLinkedList.remove(1);

		Assert.equal(this.testLinkedList.size(), 0);
	}

	@Decorators.Test
	testListClear() {
		this.testLinkedList.add(1, 5);
		this.testLinkedList.add(2, 5);
		this.testLinkedList.add(3, 5);

		// Should add one to the size
		Assert.equal(this.testLinkedList.size(), 3);

		// Clear
		this.testLinkedList.clear();

		Assert.equal(this.testLinkedList.size(), 0);
	}
}

export = TestLinkedList;
