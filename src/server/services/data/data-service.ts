import { KnitServer as Knit } from "@rbxts/knit";
import { HttpService, Players } from "@rbxts/services";
import type { ProfileStore as ProfileStoreType, Profile } from "server/lib/profile-store/types";
import LoggerFactory from "shared/util/logger/factory";

type AddStoreOptions =
	| {
			attachesToPlayer: true;
			profileKeyGenerator: (player: Player) => string;
	  }
	| {
			attachesToPlayer: false;
			profileKeyGenerator: () => string;
	  };

const DataService = Knit.CreateService({
	Name: "DataService",

	dataStoreMap: new Map<ProfileKey, ProfileStoreType<ProfileStores[ProfileKey]>>(),
	playerSessions: new Map<Player, Map<ProfileKey, Profile<ProfileStores[ProfileKey]> | undefined>>(),

	KnitStart() {
		const playerService = Knit.GetService("PlayerService");

		playerService.addPlayerLeavingConnection((player) => {
			this.endPlayerSessions(player);
		});
	},

	endPlayerSessions(player: Player): void {
		const profiles = this.playerSessions.get(player);

		profiles?.forEach((profile) => {
			if (profile !== undefined) {
				profile.EndSession();
			}
		})

		LoggerFactory.getLogger().log(`Ended Player ${player.Name}'s session`, undefined, "DataService");
	},

	addStore<K extends ProfileKey>(
		store: ProfileStoreType<ProfileStores[K]>,
		options: Partial<AddStoreOptions>,
	): void {
        assert(!this.dataStoreMap.has(store.Name), `Store with name "${store.Name}" already exists.`);
		this.dataStoreMap.set(store.Name, store);

		if (options.attachesToPlayer === true) {
			this.attachStoreToPlayers(store, options.profileKeyGenerator ?? this.getPlayerProfileKey)
		} else {
			// doesn't attach to player
		}
	},

	attachStoreToPlayers<K extends ProfileKey>(
        store: ProfileStoreType<ProfileStores[K]>,
        profileKeyGenerator: (player: Player) => string,
    ) {
        const playerService = Knit.GetService("PlayerService");

        playerService.addPlayerJoinConnection((player) => {
            this.playerSessions.set(player, new Map<ProfileKey, Profile<ProfileStores[ProfileKey]>>());

            const newProfile = store.StartSessionAsync(profileKeyGenerator(player), {
                Cancel: () => player.Parent !== Players,
            });

            if (newProfile !== undefined) {
                this.setupPlayerProfile(player, store.Name, newProfile);
            }
        });
    },

	setupPlayerProfile<K extends ProfileKey>(
        player: Player,
        storeName: K,
        profile: Profile<ProfileStores[K]>,
    ) {
        profile.AddUserId(player.UserId);
        profile.Reconcile();

        profile.OnSessionEnd.Connect(() => {
            this.playerSessions.delete(player);
            player.Kick(`[DataService]: Profile session ended`);
        });

        if (player.Parent === Players) {
            const playerMap = this.playerSessions.get(player) ?? new Map<ProfileKey, Profile<ProfileStores[K]>>();
            playerMap.set(storeName, profile);
            this.playerSessions.set(player, playerMap);

            LoggerFactory.getLogger().log(`Player ${player.Name}'s profile loaded`, undefined, "DataService");
        } else {
            profile.EndSession();
        }
    },

	getProfile<K extends ProfileKey>(storeKey: K, profileKey: string): Optional<Profile<ProfileStores[K]>> {
		const store = this.dataStoreMap.get(storeKey);

		if (store !== undefined) {
			return store.GetAsync(profileKey);
		}

		return undefined;
	},

	getStore<K extends ProfileKey>(key: K): Optional<ProfileStoreType<ProfileStores[K]>> {
		return this.dataStoreMap.get(key);
	},

	generateUUID(): string {
		return HttpService.GenerateGUID(false);
	},

	getPlayerProfileKey(player: Player): string {
		return `${player.UserId}`;
	},
});

export = DataService;
