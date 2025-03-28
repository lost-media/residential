import { KnitServer as Knit } from "@rbxts/knit";
import { HttpService, Players } from "@rbxts/services";
import ProfileStore from "server/lib/profile-store";
import type { ProfileStore as ProfileStoreType, Profile } from "server/lib/profile-store/types";
import LoggerFactory from "shared/util/logger/factory";
import type { PlotProfileStore } from "./types";

const DataService = Knit.CreateService({
	Name: "DataService",

	dataStoreMap: new Map<ProfileKey, ProfileStoreType<ProfileStores[ProfileKey]>>(),
	playerDataMap: new Map<Player, Map<ProfileKey, Profile<ProfileStores[ProfileKey]> | undefined>>(),

	KnitStart() {
		const playerService = Knit.GetService("PlayerService");

		playerService.addPlayerLeavingConnection((player) => {
			const profiles = this.playerDataMap.get(player);

			profiles?.forEach((profile) => {
				if (profile !== undefined) {
					profile.EndSession();
				}
			});

			LoggerFactory.getLogger().log(`Ended Player ${player.Name}'s session`, undefined, "DataService");
		});
	},

	addStore<K extends ProfileKey>(store: ProfileStoreType<ProfileStores[K]>): void {
		// Make sure key doesn't override existing entry
		assert(this.dataStoreMap.has(store.Name) === false);

		this.dataStoreMap.set(store.Name, store);

		const playerService = Knit.GetService("PlayerService");

		playerService.addPlayerJoinConnection((player) => {
			this.playerDataMap.set(player, new Map<ProfileKey, Profile<ProfileStores[ProfileKey]>>());

			const newProfile = store.StartSessionAsync(this.getProfileKey(player), {
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
					const playerMap = this.playerDataMap.get(player);

					if (playerMap !== undefined) {
						playerMap.set(store.Name, newProfile);
					} else {
						const newMap = new Map<ProfileKey, Profile<ProfileStores[K]>>();
						newMap.set(store.Name, newProfile);
						this.playerDataMap.set(player, newMap);
					}

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
	},

	getStore<K extends ProfileKey>(key: K): Optional<ProfileStoreType<ProfileStores[K]>> {
		return this.dataStoreMap.get(key);
	},

	getProfile<K extends ProfileKey>(player: Player, storeKey: ProfileKey): Optional<Profile<ProfileStores[K]>> {
		const profiles = this.playerDataMap.get(player);
		if (profiles !== undefined) {
			return profiles.get(storeKey);
		}

		return undefined;
	},

	generateUUID(): string {
		return HttpService.GenerateGUID(false);
	},

	getProfileKey(player: Player): string {
		return `${player.UserId}`;
	},
});

export = DataService;
