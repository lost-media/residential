import ProfileStore from "server/lib/profile-store";
import { OnStart, Service } from "@flamework/core";
import { DataService } from "./data-service";
import Plot, { SerializedPlotInstance } from "server/lib/plot";
import { PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import { Profile } from "server/lib/profile-store/types";
import { PlayerService } from "../player-service";
import { Players } from "@rbxts/services";
import { PlayerDataService, PlotMetadata } from "./player-data-service";
import { PlotService } from "../plot-service";
import { getKeysFromMap } from "shared/util/array-utils";

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
						plotName: "TESTTT",
						lastLogin: DateTime.now().UnixTimestampMillis,
					});
				}
			}
		});

		this.plotService.signals.onStructurePlaced.Connect((plot, structure) => {
			const player = plot.getPlayer();

			if (player !== undefined) {
				const profile = this.getProfile(player.UserId);

				if (profile !== undefined) {
					profile.Data.plot = plot.serialize();
					print(profile.Data.plot.structures.size());
				}
			}
		});
	}

	public getProfile(userId: number) {
		const player = Players.GetPlayerByUserId(userId);

		if (player !== undefined) {
			return this.plotProfiles.get(player);
		}
	}

	public loadPlot(player: Player, uuid: string): Optional<Profile<PlotProfileSchema>> {
		const profile = this.profileStore.StartSessionAsync(uuid, {});
		if (profile !== undefined) {
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

	public erasePlot(ownerId: number, uuid: string): boolean {
		// erase all traces of the plot
		this.playerDataService.erasePlot(ownerId, uuid);
		return this.profileStore.RemoveAsync(uuid);
	}

	private initializeProfile(player: Player, profile: Profile<PlotProfileSchema>): void {
		this.plotProfiles.set(player, profile);
		this.dataService.attachProfileToPlayer(player, profile);

		profile.OnSessionEnd.Connect(() => {
			this.plotProfiles.delete(player);
		});
	}
}
