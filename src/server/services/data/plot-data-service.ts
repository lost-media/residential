import ProfileStore from "server/lib/profile-store";
import { PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import { OnStart, Service } from "@flamework/core";
import { DataService } from "./data-service";
import { SerializedPlotInstance } from "server/lib/plot";
import { PlotService } from "../plot-service";
import { AbstractDataService } from "./abstract-data-service";
import { ProfileKey } from "./types";

export type SerializedPlot = {
	uuid: string;
	ownerId: number;
	currencies: {
		koins: number;
	};
	plot: SerializedPlotInstance;
};

export type PlotProfileSchema = Map<string, SerializedPlot>;

const defaultPlotProfile: PlotProfileSchema = new Map<string, SerializedPlot>();

@Service()
export class PlotDataService extends AbstractDataService<PlotProfileSchema> implements OnStart {
	protected profileIdentifier: ProfileKey = "PLOT_PROFILE";
	protected profileStore = new ProfileStore<PlotProfileSchema>(this.profileIdentifier, defaultPlotProfile);

	constructor(
		private dataService: DataService,
		private plotService: PlotService,
	) {
		super();
	}

	public onStart(): void {
		this.dataService.addStore(this.profileStore, {
			attachesToPlayer: false,
			profileKeyGenerator: () => this.dataService.generateUUID(),
		});
	}
}
