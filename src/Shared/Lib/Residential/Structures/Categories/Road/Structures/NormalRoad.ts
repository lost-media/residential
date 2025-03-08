import { ReplicatedStorage } from "@rbxts/services";
import { Koins } from "Shared/Lib/Residential/Currency";
import { IStructure } from "Shared/Lib/Residential/types";

const roadNormal: IStructure = {
	id: "road-normal",

	name: "Normal Road",
	description: "A normal road.",
	model: ReplicatedStorage.Models.Road.FindFirstChild("NormalRoad") as Model,

	price: {
		value: 100,
		currency: Koins,
	},
};

export default roadNormal;
