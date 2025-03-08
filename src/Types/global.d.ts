export type RbxAssetId = `rbxassetid://${number}`;

declare global {
	type RbxAssetId = `rbxassetid://${number}`;
	type Optional<T> = T | undefined;
}
