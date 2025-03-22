import { ReplicatedStorage } from "@rbxts/services";
import { Koins } from "shared/lib/Residential/Currency";
import { IStructure } from "shared/lib/Residential/types";

const structure: IStructure = {
	id: "road-t-intersection",

	name: "T-Intersection",
	description: "A T-intersection.",
	model: ReplicatedStorage.Models.Road.FindFirstChild("NormalRoad") as Model,

	price: {
		value: 100,
		currency: Koins,
	},
};

export = structure;
