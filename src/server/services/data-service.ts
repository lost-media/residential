import { KnitServer as Knit } from "@rbxts/knit";
import { Player } from "@rbxts/knit/Knit/KnitClient";
import { HttpService, Players } from "@rbxts/services";
import { SerializedPlot } from "server/lib/plot";
import ProfileStore from "server/lib/profile-store";
import { Profile } from "server/lib/profile-store/types";
import LoggerFactory from "shared/util/logger/factory";

type PlotProfileStore = {
	[uuid: string]: SerializedPlot[];
};

const DataService = Knit.CreateService({
	Name: "DataService",

	plotProfileStore: new ProfileStore<PlotProfileStore>("plots", {}),
	playerDataMap: new Map<Player, Profile<PlotProfileStore> | undefined>(),

	KnitStart() {
		const playerService = Knit.GetService("PlayerService");

		playerService.addPlayerJoinConnection((player) => {
			const newProfile = this.plotProfileStore.StartSessionAsync(`${player.UserId}`, {
				Cancel: () => player.Parent !== Players,
			});

			if (newProfile !== undefined) {
				newProfile.AddUserId(player.UserId);
				newProfile.Reconcile();

				newProfile.OnSessionEnd.Connect(() => {
					this.playerDataMap.delete(player);
					player.Kick(`[DataService]: Profile session ended`);
				});

				if (player.Parent === Players) {
					this.playerDataMap.set(player, newProfile);
					LoggerFactory.getLogger().log(`Player ${player.Name}'s profile loaded`, undefined, "DataService");
				} else {
					// For some reason, the player's parent is not the Player service
					// Could be because the user left before the session could be created
					newProfile.EndSession();
				}
			} else {
				// handle this
			}
		});

		playerService.addPlayerLeavingConnection((player) => {
			const profile = this.playerDataMap.get(player);
			if (profile !== undefined) {
				profile.EndSession();
				LoggerFactory.getLogger().log(`Ended Player ${player.Name}'s session`, undefined, "DataService");
			}
		});
	},

	createNewSaveFile(player: Player): void {
		// create a new UUID
		const uuid = HttpService.GenerateGUID(false);

		// generate an empty save file
	},

	loadSaveFile(player: Player, uuid: string): void {
		// get the player's uuids
	},
});

export = DataService;
