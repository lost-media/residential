import { Assert, Decorators } from "@rbxts/lunit";
import { StructureCategories } from "shared/lib/Residential/Structures";

@Decorators.Tag("Library")
class TestStructureLibrary {
	@Decorators.Test
	hasCorrectNumberOfKeys() {
		Assert.equal(StructureCategories.keys().size(), 2);
	}

	@Decorators.Test
	eachModelIsDefined() {
		StructureCategories.forEach((_, categories) => {
			categories.structures.forEach((structure) => {
				Assert.notUndefined(
					structure.model,
					() => `Structure with ID "${structure.id}" does not have a defined model`,
				);
			});
		});
	}

	@Decorators.Test
	eachStructureHasUniqueId() {
		const set = new Set<string>();
		StructureCategories.forEach((_, categories) => {
			categories.structures.forEach((structure) => {
				Assert.false(set.has(structure.id), () => `Structure with ID "${structure.id}" is not unique`);
				set.add(structure.id);
			});
		});
	}
}

export = TestStructureLibrary;
