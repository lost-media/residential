import { Koins } from "shared/lib/Residential/Currency";
import { IStructure } from "shared/lib/Residential/types";
import { MODELS_FOLDER } from "shared/lib/Residential/configs";

const structure: IStructure = {
	id: "road-t-dead-end",

	name: "Dead End",
	description: "A dead end.",
	model: MODELS_FOLDER?.Road.FindFirstChild("NormalRoad") as Model,

	price: {
		value: 100,
		currency: Koins,
	},
};

export = structure;
