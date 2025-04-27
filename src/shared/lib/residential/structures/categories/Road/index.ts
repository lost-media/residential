import BaseCategory from "shared/lib/residential/structures/categories/BaseCategory";
import { loadStructures } from "shared/lib/residential/structures/utils/load-structures";
import type { IStructureCategory } from "shared/lib/residential/types";

class RoadCategory extends BaseCategory implements IStructureCategory {
	id = "road" as const;
	icon = "rbxassetid://0" as RbxAssetId;
	description = "Roads are used to connect structures and provide a path for vehicles to travel on." as const;
	verboseName = "Road" as const;
	verboseNamePlural = "Roads" as const;
	structures = loadStructures(script);
}

const roadCategory: IStructureCategory = new RoadCategory();
export default roadCategory;
