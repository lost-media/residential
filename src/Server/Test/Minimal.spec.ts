import { Assert } from "shared/lunit";
import { BeforeAll, BeforeEach, Order, Test, Timeout } from "shared/lunit/decorators";

const sum = (a: number, b: number) => {
	return a + b;
};

class MinimalTest {
	private idk: number;

	constructor() {
		this.idk = 0;
	}

	@Test
	@Timeout(2000)
	@Order(1)
	setUp() {
		this.idk = sum(7, 12);
	}
}

export = MinimalTest;
