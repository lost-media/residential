declare global {
	type RbxAssetId = `rbxassetid://${number}`;
	type Optional<T> = T | undefined;

	interface PlotInstance extends Model {
		Structures: Folder;
		Tiles: Model;
	}
}

export {};
