class Node<K, V> {
	public key: K;
	public value: V;
	public next: Node<K, V> | undefined;
	public prev: Node<K, V> | undefined;

	constructor(key: K, value: V) {
		this.key = key;
		this.value = value;
	}
}

export interface ILinkedList<K extends defined, V extends defined> {
	add(key: K, value: V): void;
	remove(key: K): void;

	get(key: K): V | undefined;
	size(): number;
	clear(): void;

	contains(key: K): boolean;
	forEach(callback: (key: K, value: V) => void): void;
	map<T extends defined>(callback: (key: K, value: V) => T): Array<T>;
	filter(callback: (key: K, value: V) => boolean): Array<V>;
	find(callback: (key: K, value: V) => boolean): V | undefined;
	toArray(): Array<V>;
	keys(): Array<K>;
	values(): Array<V>;
}

export type ReadonlyILinkedList<K extends defined, V extends defined> = Omit<
	ILinkedList<K, V>,
	'add' | 'remove' | 'clear'
>;

export class LinkedList<K extends defined, V extends defined> implements ILinkedList<K, V> {
	private head: Node<K, V> | undefined;
	private tail: Node<K, V> | undefined;
	private _size: number;

	constructor() {
		this._size = 0;
	}

	public add(key: K, value: V): void {
		const node = new Node(key, value);

		if (!this.head) {
			this.head = node;
			this.tail = node;
		} else {
			node.prev = this.tail;
			this.tail!.next = node;
			this.tail = node;
		}

		this._size++;
	}

	public remove(key: K): void {
		let current = this.head;

		while (current) {
			if (current.key === key) {
				if (current.prev) {
					current.prev.next = current.next;
				} else {
					this.head = current.next;
				}

				if (current.next) {
					current.next.prev = current.prev;
				} else {
					this.tail = current.prev;
				}

				this._size--;
				return;
			}

			current = current.next;
		}
	}

	public get(key: K): V | undefined {
		let current = this.head;

		while (current) {
			if (current.key === key) {
				return current.value;
			}

			current = current.next;
		}

		return undefined;
	}

	public size(): number {
		return this._size;
	}

	public clear(): void {
		this.head = undefined;
		this.tail = undefined;
		this._size = 0;
	}

	public forEach(callback: (key: K, value: V) => void): void {
		let current = this.head;

		while (current) {
			callback(current.key, current.value);
			current = current.next;
		}
	}

	public map<T extends defined>(callback: (key: K, value: V) => T): Array<T> {
		const result: Array<T> = [];
		let current = this.head;

		while (current) {
			result.push(callback(current.key, current.value));
			current = current.next;
		}

		return result;
	}

	public filter(callback: (key: K, value: V) => boolean): Array<V> {
		const result: Array<V> = [];
		let current = this.head;

		while (current) {
			if (callback(current.key, current.value)) {
				result.push(current.value);
			}

			current = current.next;
		}

		return result;
	}

	public find(callback: (key: K, value: V) => boolean): V | undefined {
		let current = this.head;

		while (current) {
			if (callback(current.key, current.value)) {
				return current.value;
			}

			current = current.next;
		}

		return undefined;
	}

	public contains(key: K): boolean {
		return this.find((_key) => _key === key) !== undefined;
	}

	public toArray(): Array<V> {
		const result: Array<V> = [];
		let current = this.head;

		while (current) {
			result.push(current.value);
			current = current.next;
		}

		return result;
	}

	public keys(): Array<K> {
		const result: Array<K> = [];

		this.forEach((key) => {
			result.push(key);
		});

		return result;
	}

	public values(): Array<V> {
		const result: Array<V> = [];

		this.forEach((_, value) => {
			result.push(value);
		});

		return result;
	}

	public static fromArray<K extends defined, V extends defined>(array: Array<[K, V]>): LinkedList<K, V> {
		const list = new LinkedList<K, V>();

		array.forEach(([key, value]) => {
			list.add(key, value);
		});

		return list;
	}
}
