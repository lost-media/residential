import type { IStructureCategory } from "shared/Lib/Residential/types";
import { loadStructures } from "shared/Lib/Residential/Structures/Utils/LoadStructures";
import BaseCategory from "../BaseCategory";

class ResidentialCategory extends BaseCategory implements IStructureCategory {
	id = "residential" as const;
	icon = "rbxassetid://0" as const;
	description = "Residential structures are used to house citizens." as const;
	verboseName = "Residential" as const;
	verboseNamePlural = "Residentials" as const;
	structures = loadStructures(script);

	getStructureById(id: string) {
		return this.structures.find((structure) => structure.id === id);
	}

	getStructureByName(name: string) {
		return this.structures.find((structure) => structure.name === name);
	}
}

const residentialCategory: IStructureCategory = new ResidentialCategory();
export default residentialCategory;
