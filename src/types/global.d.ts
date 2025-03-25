declare global {
	type RbxAssetId = `rbxassetid://${number}`;
	type Optional<T> = T | undefined;

	interface Character extends Model {
		Humanoid: Humanoid;
	}
}

export {};
