import type { IStructureCategory } from "shared/lib/residential/types";
import { loadStructures } from "shared/lib/residential/Structures/Utils/LoadStructures";
import BaseCategory from "../BaseCategory";

class ResidentialCategory extends BaseCategory implements IStructureCategory {
	id = "residential" as const;
	icon = "rbxassetid://0" as RbxAssetId;
	description = "Residential structures are used to house citizens." as const;
	verboseName = "Residential" as const;
	verboseNamePlural = "Residentials" as const;
	structures = loadStructures(script);
}

const residentialCategory: IStructureCategory = new ResidentialCategory();
export default residentialCategory;
