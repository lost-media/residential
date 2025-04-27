import { type OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";
import type { SerializedPlotInstance } from "server/lib/plot";
import ProfileStore from "server/lib/profile-store";
import type { Profile } from "server/lib/profile-store/types";
import { PLAYER_PROFILE_STORE_KEY } from "server/utils/constants";
import type { PlayerService } from "../player-service";
import type { DataService } from "./data-service";

export type SerializedPlot = {
	uuid: string;
	ownerId: number;
	plot: SerializedPlotInstance;
};

export type PlotMetadata = {
	plotName: string;
	lastLogin: number; // timestamp of when it was last logged in
};

// Defines player-wide settings that don't depend on any plots.
// i.e settings, list of universal items that the user owns
export type PlayerProfileSchema = {
	roadbucks: number;
	plots: Map<string, PlotMetadata>;
	settings: object;
};

const defaultPlayerProfile: PlayerProfileSchema = {
	roadbucks: 0,
	plots: new Map(),
	settings: {},
};

@Service()
export class PlayerDataService implements OnStart {
	public signals = {
		userProfileLoaded: new Signal<(player: Player, profile: Profile<PlayerProfileSchema>) => void>(),
	};

	private playerProfiles = new Map<Player, Profile<PlayerProfileSchema>>();
	protected profileStore = new ProfileStore<PlayerProfileSchema>(PLAYER_PROFILE_STORE_KEY, defaultPlayerProfile);

	constructor(
		private dataService: DataService,
		private playerService: PlayerService,
	) {}

	public onStart(): void {
		this.playerService.addPlayerJoinConnection((player) => {
			const profile = this.createProfile(player);

			if (profile !== undefined) {
				this.signals.userProfileLoaded.Fire(player, profile);
			}
		});
	}

	public async onUserProfileLoadedAsync(player: Player): Promise<Optional<Profile<PlayerProfileSchema>>> {
		return new Promise((resolve) => {
			const profile = this.getProfile(player.UserId);
			if (profile !== undefined) {
				resolve(profile);
			} else {
				const callback = (_: Player, profile: Profile<PlayerProfileSchema>) => {
					connection.Disconnect();
					resolve(profile);
				};

				const connection = this.signals.userProfileLoaded.Connect(callback);
			}
		});
	}

	public createProfile(player: Player): Optional<Profile<PlayerProfileSchema>> {
		const profileKey = this.getProfileKey(player);
		const profile = this.profileStore.StartSessionAsync(profileKey, {
			Cancel: () => player.IsDescendantOf(Players) === false,
		});

		if (profile !== undefined) {
			this.playerProfiles.set(player, profile);
			this.dataService.attachProfileToPlayer(player, profile);

			profile.OnSessionEnd.Connect(() => {
				this.playerProfiles.delete(player);
			});

			return profile;
		}

		return undefined;
	}

	public getProfile(userId: number) {
		const player = Players.GetPlayerByUserId(userId);

		if (player !== undefined) {
			return this.playerProfiles.get(player);
		}
	}

	public getUserPlots(player: Player) {
		const profile = this.getProfile(player.UserId);

		if (profile !== undefined) {
			return profile.Data.plots;
		} else {
			return [];
		}
	}

	public addPlotToUser(player: Player, uuid: string, metadata: PlotMetadata) {
		const profile = this.getProfile(player.UserId);

		if (profile !== undefined) {
			// Do not include duplicate UUIDs
			if (profile.Data.plots.has(uuid) === false) {
				profile.Data.plots.set(uuid, metadata);
			}
		}
	}

	public erasePlot(ownerId: number, uuid: string) {
		const profile = this.getProfile(ownerId);

		if (profile !== undefined) {
			profile.Data.plots.delete(uuid);
		}
	}

	private getProfileKey(player: Player): string {
		return `${player.UserId}`;
	}
}
