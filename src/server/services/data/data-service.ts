import { OnStart, Service } from "@flamework/core";
import { HttpService, Players } from "@rbxts/services";
import type { ProfileStore as ProfileStoreType, Profile } from "server/lib/profile-store/types";
import LoggerFactory from "shared/util/logger/factory";
import { PlayerService } from "../player-service";
import type { ProfileKey, ProfileSchemaForKey, ProfileSchemas } from "./types";

type AddStoreOptions =
    | {
            attachesToPlayer: true;
            profileKeyGenerator: (player: Player) => string;
      }
    | {
            attachesToPlayer: false;
            profileKeyGenerator: () => string;
      };

@Service()
export class DataService implements OnStart {
    private dataStoreMap = new Map<ProfileKey, ProfileStoreType<ProfileSchemas[ProfileKey]>>();
    private playerSessions = new Map<Player, Map<ProfileKey, Profile<ProfileSchemaForKey<ProfileKey>>>>();

    constructor(private playerService: PlayerService) {}

    /**
     * Called when the service starts.
     */
    public onStart(): void {
        this.playerService.addPlayerLeavingConnection((player) => {
            this.endPlayerSessions(player);
        });
    }

    /**
     * Adds a new profile store to the service.
     */
    public addStore<K extends ProfileKey>(
        store: ProfileStoreType<ProfileSchemas[K]>,
        options: Partial<AddStoreOptions>,
    ): void {
        assert(!this.dataStoreMap.has(store.Name), `Store with name "${store.Name}" already exists.`);
        this.dataStoreMap.set(store.Name, store);

        if (options.attachesToPlayer) {
            this.attachStoreToPlayers(store, options.profileKeyGenerator ?? this.getDefaultProfileKey);
        }
    }

    /**
     * Ends all sessions for a given player.
     */
    private endPlayerSessions(player: Player): void {
        const profiles = this.playerSessions.get(player);

        profiles?.forEach((profile) => {
            profile?.EndSession();
        });

        this.playerSessions.delete(player);
        LoggerFactory.getLogger().log(`Ended Player ${player.Name}'s session`, undefined, "DataService");
    }

    /**
     * Attaches a profile store to players, creating sessions as they join.
     */
    private attachStoreToPlayers<K extends ProfileKey>(
        store: ProfileStoreType<ProfileSchemas[K]>,
        profileKeyGenerator: (player: Player) => string,
    ): void {
        this.playerService.addPlayerJoinConnection((player) => {
            const playerProfiles = new Map<ProfileKey, Profile<ProfileSchemaForKey<ProfileKey>>>();
            this.playerSessions.set(player, playerProfiles);

            const profileKey = profileKeyGenerator(player);
            const newProfile = store.StartSessionAsync(profileKey, {
                Cancel: () => player.Parent !== Players,
            });

            if (newProfile) {
                this.setupPlayerProfile(player, store.Name, newProfile);
            }
        });
    }

    /**
     * Sets up a player's profile and handles session events.
     */
    private setupPlayerProfile<K extends ProfileKey>(
        player: Player,
        storeName: K,
        profile: Profile<ProfileSchemas[K]>,
    ): void {
        profile.AddUserId(player.UserId);
        profile.Reconcile();

        profile.OnSessionEnd.Connect(() => {
            this.playerSessions.delete(player);
            player.Kick(`[DataService]: Profile session ended`);
        });

        if (player.Parent === Players) {
            const playerProfiles = this.playerSessions.get(player) ?? new Map<ProfileKey, Profile<ProfileSchemaForKey<ProfileKey>>>();
            playerProfiles.set(storeName, profile);
            this.playerSessions.set(player, playerProfiles);

            LoggerFactory.getLogger().log(`Player ${player.Name}'s profile loaded`, undefined, "DataService");
        } else {
            profile.EndSession();
        }
    }

    /**
     * Retrieves a profile for a given store and profile key.
     */
    public getProfile<K extends ProfileKey>(
        storeKey: K,
        profileKey: string,
    ): Profile<ProfileSchemas[K]> | undefined {
        const store = this.dataStoreMap.get(storeKey);
        return store?.GetAsync(profileKey);
    }

    /**
     * Retrieves a profile store by its key.
     */
    public getStore<K extends ProfileKey>(key: K): ProfileStoreType<ProfileSchemas[K]> | undefined {
        return this.dataStoreMap.get(key);
    }

    /**
     * Generates a UUID for unique identification.
     */
    public generateUUID(): string {
        return HttpService.GenerateGUID(false);
    }

    /**
     * Default profile key generator for players.
     */
    private getDefaultProfileKey(player: Player): string {
        return `${player.UserId}`;
    }
}