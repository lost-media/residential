import { Koins } from "shared/lib/residential/currency";
import { IStructure } from "shared/lib/residential/types";
import { MODELS_FOLDER } from "shared/lib/residential/configs";
const structure: IStructure = {
	id: "road-curved",

	name: "Curved Road",
	description: "A curved road.",
	model: MODELS_FOLDER?.Road.FindFirstChild("NormalRoad") as Model,

	price: {
		value: 100,
		currency: Koins,
	},
};

export = structure;
