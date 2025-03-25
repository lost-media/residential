import { KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";

const PlayerService = Knit.CreateService({
	Name: "PlayerService",

	onPlayerJoinedCallbacks: new Array<(player: Player) => void>(),
	onPlayerLeavingCallbacks: new Array<(player: Player) => void>(),

	onPlayerJoinedConnection: undefined as unknown as RBXScriptConnection,
	onPlayerLeavingConnection: undefined as unknown as RBXScriptConnection,

	KnitInit() {
		this.onPlayerJoinedConnection = Players.PlayerAdded.Connect((player) => {
			this.onPlayerJoinedCallbacks.forEach((callback) => {
				callback(player);
			});
		});
		this.onPlayerLeavingConnection = Players.PlayerRemoving.Connect((player) => {
			this.onPlayerLeavingCallbacks.forEach((callback) => {
				callback(player);
			});
		});
	},

	addPlayerJoinConnection(callback: (player: Player) => void): void {
		// If there are players in the server before the event begins, call the callback for each player
		spawn(() => {
			Players.GetPlayers().forEach((player) => {
				callback(player);
			});
		});

		this.onPlayerJoinedCallbacks.push(callback);
	},

	addPlayerLeavingConnection(callback: (player: Player) => void): void {
		this.onPlayerLeavingCallbacks.push(callback);
	},

	getAllCharacters(): Character[] {
		const players = Players.GetPlayers();
		return players.map((player) => player.Character as Character).filter((character) => character !== undefined);
	},
});

export = PlayerService;
