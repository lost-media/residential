import { type OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import Plot, { type SerializedPlotInstance } from "server/lib/plot";
import ProfileStore from "server/lib/profile-store";
import type { Profile } from "server/lib/profile-store/types";
import { PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import { getKeysFromMap } from "shared/util/array-utils";
import type { PlayerService } from "../player-service";
import type { PlotService } from "../plot-service";
import type { DataService } from "./data-service";
import type { PlayerDataService, PlotMetadata } from "./player-data-service";

export type SerializedPlot = {
	uuid: string;
	ownerId: number;
	currencies: {
		koins: number;
	};
	plot: SerializedPlotInstance;

	metadata: PlotMetadata;
};

export type PlotProfileSchema = SerializedPlot;

const defaultPlotProfile: PlotProfileSchema = {
	uuid: "",
	ownerId: -1,
	currencies: {
		koins: 0,
	},
	plot: Plot.getEmptySerializedPlotInstance(),
	metadata: {
		lastLogin: -1,
		plotName: "",
	},
};

@Service()
export class PlotDataService implements OnStart {
	private plotProfiles = new Map<Player, Profile<PlotProfileSchema>>();
	protected profileStore = new ProfileStore<PlotProfileSchema>(PLOT_PROFILE_STORE_KEY, defaultPlotProfile);

	constructor(
		private dataService: DataService,
		private playerService: PlayerService,
		private plotService: PlotService,
		private playerDataService: PlayerDataService,
	) {}

	public onStart(): void {
		this.playerService.addPlayerJoinConnection(async (player) => {
			const loaded = await this.playerDataService.onUserProfileLoadedAsync(player);

			if (loaded !== undefined) {
				// load a plot
				const loadedPlotUUID = getKeysFromMap(loaded.Data.plots)[0];

				if (loadedPlotUUID !== undefined) {
					this.loadPlot(player, loadedPlotUUID);
				} else {
					// create a plot
					this.createNewPlot(player, {
						plotName: "Test",
						lastLogin: DateTime.now().UnixTimestampMillis,
					});
				}
			}
		});

		this.plotService.signals.onStructuresUpdated.Connect((plot) => {
			const player = plot.getPlayer();

			if (player !== undefined) {
				const profile = this.getPlot(player);

				if (profile !== undefined) {
					profile.Data.plot = plot.serialize();
				}
			}
		});
	}

	public getPlot(player: Player) {
		if (player !== undefined) {
			return this.plotProfiles.get(player);
		}
	}

	public loadPlot(player: Player, uuid: string): Optional<Profile<PlotProfileSchema>> {
		const profile = this.profileStore.StartSessionAsync(uuid, {});
		if (profile !== undefined) {
			profile.Data.uuid = uuid;
			this.initializeProfile(player, profile);

			// load the Physical plot
			this.plotService.loadSerializedPlot(player, profile.Data.plot);
			return profile;
		}

		return undefined;
	}

	public createNewPlot(player: Player, metadata: PlotMetadata): Optional<Profile<PlotProfileSchema>> {
		const plot: PlotProfileSchema = {
			uuid: this.dataService.generateUUID(),
			ownerId: player.UserId,
			plot: Plot.getEmptySerializedPlotInstance(),
			currencies: {
				koins: 0,
			},

			metadata,
		};

		const loadedSession = this.loadPlot(player, plot.uuid);

		// replicate this to the player's data
		this.playerDataService.addPlotToUser(player, plot.uuid, metadata);

		return loadedSession;
	}

	public deletePlot(ownerId: number, uuid: string): boolean {
		// erase all traces of the plot
		this.playerDataService.erasePlot(ownerId, uuid);

		// clear the plot
		const player = Players.GetPlayerByUserId(ownerId);

		if (player !== undefined) {
			this.plotService.clearPlot(player);
		}

		return this.profileStore.RemoveAsync(uuid);
	}

	public clearPlot(ownerId: number, uuid: string): void {
		const player = Players.GetPlayerByUserId(ownerId);

		if (player !== undefined) {
			this.plotService.clearPlot(player);
		}
	}

	private initializeProfile(player: Player, profile: Profile<PlotProfileSchema>): void {
		this.plotProfiles.set(player, profile);
		this.dataService.attachProfileToPlayer(player, profile);

		profile.OnSessionEnd.Connect(() => {
			this.plotProfiles.delete(player);
		});
	}
}
