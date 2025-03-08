import { ReplicatedStorage } from "@rbxts/services";
import { Koins } from "Shared/Lib/Residential/Currency";
import { IStructure } from "Shared/Lib/Residential/types";

const structure: IStructure = {
	id: "road-curved",

	name: "Curved Road",
	description: "A curved road.",
	model: ReplicatedStorage.Models.Road.FindFirstChild("NormalRoad") as Model,

	price: {
		value: 100,
		currency: Koins,
	},
};

export = structure;
