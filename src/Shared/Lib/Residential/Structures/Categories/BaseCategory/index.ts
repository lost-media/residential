import { IStructureCategory, IStructure } from "Shared/Lib/Residential/types";

abstract class BaseCategory implements IStructureCategory {
	abstract id: string;
	abstract icon: RbxAssetId;
	abstract description: string;
	abstract verboseName: string;
	abstract verboseNamePlural: string;
	abstract structures: IStructure[];

	getStructureById(id: string) {
		return this.structures.find((structure) => structure.id === id);
	}

	getStructureByName(name: string) {
		return this.structures.find((structure) => structure.name === name);
	}
}

export default BaseCategory;
