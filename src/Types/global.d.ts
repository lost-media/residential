export type RbxAssetId = `rbxassetid://${number}`;

declare global {
	type RbxAssetId = `rbxassetid://${number}`;

	interface ReplicatedStorage extends Instance {
		Models: Folder & {
			Road: Folder;
			Residential: Folder;
		};
	}
}

// extend replicatedstorage
