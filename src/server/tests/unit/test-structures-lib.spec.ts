import { Assert, Decorators } from '@rbxts/lunit';
import { StructureCategories } from 'shared/lib/residential/structures';

@Decorators.Tag('Library')
class TestStructureLibrary {
	@Decorators.Test
	hasCorrectNumberOfKeys() {
		Assert.equal(StructureCategories.keys().size(), 2);
	}

	@Decorators.Test
	eachModelIsDefined() {
		for (const categories of StructureCategories.values()) {
			for (const structure of categories.structures) {
				Assert.notUndefined(
					structure.model,
					() => `Structure with ID "${structure.id}" does not have a defined model`,
				);
			}
		}
	}

	@Decorators.Test
	eachStructureHasUniqueId() {
		const set = new Set<string>();
		for (const categories of StructureCategories.values()) {
			for (const structure of categories.structures) {
				Assert.false(set.has(structure.id), () => `Structure with ID "${structure.id}" is not unique`);
				set.add(structure.id);
			}
		}
	}
}

export = TestStructureLibrary;
