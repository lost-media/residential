import { ID_ATTRIBUTE_KEY } from "shared/lib/residential/configs";
import type { IStructure } from "shared/lib/residential/types";
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

export function getIdFromModel(model: Instance): Optional<string> {
	const id = model.GetAttribute(ID_ATTRIBUTE_KEY);
	if (model.GetAttribute(ID_ATTRIBUTE_KEY) !== undefined) {
		return tostring(id);
	} else {
		return undefined;
	}
}
