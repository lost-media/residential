import { IStructure } from "shared/lib/residential/types";
import { StructureCategories } from "../..";

export function getStructureById(structureId: string): Optional<IStructure> {
	let structure: Optional<IStructure> = undefined;

	StructureCategories.forEach((_, val) => {
		const found = val.getStructureById(structureId);
		if (found !== undefined) {
			structure = found;
		}
	});

	return structure;
}
