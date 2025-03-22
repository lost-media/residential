import { MODELS_FOLDER } from "shared/lib/Residential/configs";
import { Koins } from "shared/lib/Residential/Currency";
import { IStructure } from "shared/lib/Residential/types";

const structure: IStructure = {
	id: "road-t-intersection",

	name: "T-Intersection",
	description: "A T-intersection.",
	model: MODELS_FOLDER?.Road.FindFirstChild("NormalRoad") as Model,

	price: {
		value: 100,
		currency: Koins,
	},
};

export = structure;
