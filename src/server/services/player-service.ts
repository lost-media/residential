import { KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { LinkedList } from "shared/lib/DataStructures/LinkedList";

const PlayerService = Knit.CreateService({
	Name: "PlayerService",

	onPlayerJoinedEvents: new LinkedList<defined, RBXScriptConnection>(),
	onPlayerLeavingEvents: new LinkedList<defined, RBXScriptConnection>(),

	addPlayerJoinConnection<K extends defined>(key: K, callback: (player: Player) => void): void {
		// If there are players in the server before the event begins, call the callback for each player
		spawn(() => {
			Players.GetPlayers().forEach((player) => {
				callback(player);
			});
		});

		const signal = Players.PlayerAdded.Connect(callback);
		this.onPlayerJoinedEvents.add(key, signal);
	},

	addPlayerLeavingConnection<K extends defined>(key: K, callback: (player: Player) => void): void {
		this.onPlayerLeavingEvents.add(key, Players.PlayerRemoving.Connect(callback));
	},

	removePlayerJoinConnection<K extends defined>(key: K): void {
		this.onPlayerJoinedEvents.remove(key);
	},

	removePlayerLeavingConnection<K extends defined>(key: K): void {
		this.onPlayerJoinedEvents.remove(key);
	},
});

export = PlayerService;
