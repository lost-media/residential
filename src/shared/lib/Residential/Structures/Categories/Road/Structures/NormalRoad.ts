import { Koins } from "shared/lib/Residential/Currency";
import { IStructure } from "shared/lib/Residential/types";
import { MODELS_FOLDER } from "shared/lib/Residential/configs";

const structure: IStructure = {
	id: "road-normal",

	name: "Normal Road",
	description: "A normal road.",
	model: MODELS_FOLDER?.Road.FindFirstChild("NormalRoad") as Model,

	price: {
		value: 100,
		currency: Koins,
	},
};

export = structure;
