import { ReplicatedStorage } from "@rbxts/services";

export const MODELS_FOLDER = ReplicatedStorage.FindFirstChild("models") as Instance & {
	Road: Folder;
	Residential: Folder;
};

export const ID_ATTRIBUTE_KEY = "RESIDENTIAL_ID";
