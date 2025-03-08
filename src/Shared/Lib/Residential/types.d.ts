import { Currency } from "Shared/Lib/Residential/Currency";

export type Price = {
	value: number;
	currency: Currency;
};

export interface IStructure {
	id: string;

	name: string;
	description: string;
	model: Model;

	price: Price;
}

export interface IStructureCategory {
	id: string;
	icon: RbxAssetId;

	verboseName: string;
	verboseNamePlural: string;
	description: string;

	structures: Array<IStructure>;

	getStructureById(id: string): IStructure | undefined;
	getStructureByName(name: string): IStructure | undefined;
	getStructuresWithinPrice(price: number): IStructure[];
	getSearchResults(query: string): IStructure[];
}
