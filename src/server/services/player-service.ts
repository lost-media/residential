import { KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { LinkedList } from "shared/lib/data-structures/linked-list";

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

	addPlayerLeavingConnection<K extends defined>(callback: (player: Player) => void): void {
		this.onPlayerLeavingCallbacks.push(callback);
	},
});

export = PlayerService;
