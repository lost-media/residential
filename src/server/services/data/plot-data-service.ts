import ProfileStore from "server/lib/profile-store";
import { PLAYER_PLOTS_PROFILE_STORE_KEY, PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import { OnStart, Service } from "@flamework/core";
import { DataService } from "./data-service";
import { SerializedPlotInstance } from "server/lib/plot";
import type { Profile } from "server/lib/profile-store/types";

export type SerializedPlot = {
	uuid: string;
	ownerId: number;
	plot: SerializedPlotInstance;
};

export type PlayerPlotProfileStoreSchema = string[];
export type PlotProfileSchema = Map<string, SerializedPlot>;

@Service()
export class PlotDataService implements OnStart {
	private playerPlotsProfileStore = new ProfileStore<PlayerPlotProfileStoreSchema>(PLAYER_PLOTS_PROFILE_STORE_KEY);
	private plotProfileStore = new ProfileStore<PlotProfileSchema>(PLOT_PROFILE_STORE_KEY, new Map());

	constructor(private dataService: DataService) {}

	public onStart(): void {
		this.dataService.addStore(this.playerPlotsProfileStore, {
			attachesToPlayer: true,
		})
		this.dataService.addStore(this.plotProfileStore, {
			attachesToPlayer: false,
			profileKeyGenerator: () => this.dataService.generateUUID()
		});
	}

	public getProfile(uuid: string): Optional<Profile<PlotProfileSchema>> {
		return this.dataService.getProfile(PLOT_PROFILE_STORE_KEY, uuid);
	}
}