import { Currency } from "shared/lib/residential/currency";

export type Price = {
	value: number;
	currency: Currency;
};

export type StructureAttachment = {
	attachmentName: string;
	type: "solo" | "group" | "pair"; // Defines how the attachment is used
	pairedWith?: string[];
};

export interface IStructure {
	id: string;
	name: string;
	description: string;
	model: Model;
	price: Price;

	attachments?: Array<StructureAttachment>;
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

export type SerializedStructureInstance = {
	uuid: string;
	structureId: string;
	cframe?: Array<number>;

	snappedTo?: Array<{
		parentUuid: string;
		attachmentName: string;
	}>;
};

export interface IStructureInstance {
	// a unique identifier
	uuid: string;
	structure: IStructure;
	model?: Model;
	attachments?: Array<Attachment>;

	spawn(): Model;
	spawn(parent?: Instance): Model;

	destroy(): void;
	serialize(relativePlatformCFrame?: CFrame): SerializedStructureInstance;

	canSnapTo(parent: IStructureInstance, attachmentName: string): boolean;
}
