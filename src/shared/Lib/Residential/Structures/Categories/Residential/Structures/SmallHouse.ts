import { Koins } from "shared/Lib/Residential/Currency";
import { IStructure } from "shared/Lib/Residential/types";

const smallHouse: IStructure = {
	id: "residential-small-house",

	name: "Small House",
	description: "A small house.",
	model: new Instance("Model"),

	price: {
		value: 500,
		currency: Koins,
	},
};

export default smallHouse;
