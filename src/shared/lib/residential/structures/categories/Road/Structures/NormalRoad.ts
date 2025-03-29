import { Koins } from "shared/lib/residential/currency";
import { IStructure } from "shared/lib/residential/types";
import { MODELS_FOLDER } from "shared/lib/residential/configs";

const structure: IStructure = {
	id: "road-normal",

	name: "Normal Road",
	description: "A normal road.",
	model: MODELS_FOLDER?.Road.FindFirstChild("NormalRoad") as Model,

	price: {
		value: 100,
		currency: Koins,
	},

	attachments: [
		{
			attachmentName: "sidewalk-attachment-1",
			type: "solo",
		},
		{
			attachmentName: "sidewalk-attachment-2",
			type: "solo",
		},
	],
};

export = structure;
