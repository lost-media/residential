import { Koins } from "shared/Lib/Residential/Currency";
import { IStructure } from "shared/Lib/Residential/types";

const roadNormal: IStructure = {
	id: "road-normal",

	name: "Normal Road",
	description: "A normal road.",
	model: new Instance("Model"),

	price: {
		value: 100,
		currency: Koins,
	},
};

export default roadNormal;
