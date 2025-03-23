import { Koins } from "shared/lib/residential/Currency";
import { IStructure } from "shared/lib/residential/types";

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
