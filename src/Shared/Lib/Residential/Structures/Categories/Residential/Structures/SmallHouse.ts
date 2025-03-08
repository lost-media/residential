import { Koins } from "Shared/Lib/Residential/Currency";
import { IStructure } from "Shared/Lib/Residential/types";

const structure: IStructure = {
	id: "residential-small-house",

	name: "Small House",
	description: "A small house.",
	model: new Instance("Model"),

	price: {
		value: 500,
		currency: Koins,
	},
};

export = structure;
