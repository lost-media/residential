import type { IStructure, IStructureCategory } from "shared/lib/residential/types";
import fuzzySearch from "shared/util/fuzzy-search";

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

	getStructuresWithinPrice(price: number) {
		return this.structures.filter((structure) => structure.price.value <= price);
	}

	getSearchResults(query: string) {
		const results: Array<IStructure> = new Array<IStructure>();

		this.structures.forEach((structure) => {
			if (fuzzySearch(query, structure.name + structure.description + structure.id)[0] !== undefined) {
				results.push(structure);
			}
		});
		return results;
	}
}

export default BaseCategory;
