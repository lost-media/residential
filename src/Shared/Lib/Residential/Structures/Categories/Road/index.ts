import BaseCategory from "../BaseCategory";
import type { IStructureCategory } from "Shared/Lib/Residential/types";
import { loadStructures } from "../../Utils/LoadStructures";

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
