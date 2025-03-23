import { Koins } from "shared/lib/Residential/Currency";
import { IStructure } from "shared/lib/Residential/types";

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
