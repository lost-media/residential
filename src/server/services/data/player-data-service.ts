import ProfileStore from "server/lib/profile-store";
import { OnStart, Service } from "@flamework/core";
import { DataService } from "./data-service";
import { SerializedPlotInstance } from "server/lib/plot";
import { PlotService } from "../plot-service";
import { AbstractDataService } from "./abstract-data-service";
import { ProfileKey, ProfileSchemas } from "./types";
import { Profile } from "server/lib/profile-store/types";

export type SerializedPlot = {
	uuid: string;
	ownerId: number;
	plot: SerializedPlotInstance;
};

// Defines player-wide settings that don't depend on any plots.
// i.e settings, list of universal items that the user owns
export type PlayerProfileSchema = {
	roadbucks: number;
	plots: string[];
	settings: {};
};

const defaultPlayerProfile: PlayerProfileSchema = {
	roadbucks: 0,
	plots: [],
	settings: {},
};

@Service()
export class PlayerDataService extends AbstractDataService<PlayerProfileSchema> implements OnStart {
	private playerData: Map<Player, Profile<PlayerProfileSchema>> = new Map();

	protected profileIdentifier: ProfileKey = "PLAYER_PROFILE";
	protected profileStore = new ProfileStore<PlayerProfileSchema>(this.profileIdentifier, defaultPlayerProfile);

	constructor(
		private dataService: DataService,
		private plotService: PlotService,
	) {
		super();
	}

	public onStart(): void {
		this.dataService.addStore(this.profileStore, {
			attachesToPlayer: true,
			profileKeyGenerator: (player) => this.generateProfileKey(player),
		});

		this.plotService.signals.onStructurePlaced.Connect((plot, structure) => {
			const player = plot.getPlayer();
			if (player === undefined) return;
		});
	}

	public addPlotToUser(player: Player, uuid: string) {
		const profileKey = this.generateProfileKey(player);
		const profile = this.getProfile(profileKey);

		if (profile !== undefined) {
			profile.Data.plots.push(uuid);
		}
	}

	private generateProfileKey(player: Player): string {
		return `${player.UserId}`;
	}
}
