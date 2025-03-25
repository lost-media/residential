import { Players } from "@rbxts/services";

export function getAllCharacters(): Character[] {
	const players = Players.GetPlayers();
	return players.map((player) => player.Character as Character).filter((character) => character !== undefined);
}
