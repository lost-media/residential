// for testing purposes, choose a random structure from any category

import type { IStructure } from "shared/lib/residential/types";
import { StructureCategories } from "../..";

export function chooseRandomStructure(): Optional<IStructure> {
	let structure: Optional<IStructure> = undefined;
	StructureCategories.forEach((_, val) => {
		val.structures.forEach((_structure) => {
			if (_structure.id === "road-normal") {
				structure = _structure;
			}
		});
	});

	return structure;
}
