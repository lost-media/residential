import ProfileStore from "server/lib/profile-store";
import { PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import { SerializedPlot, type PlotProfileSchema } from "./types";
import { OnStart, Service } from "@flamework/core";
import { DataService } from "../data-service";

@Service()
export class PlotDataService implements OnStart {
	private plotProfileStore = new ProfileStore<PlotProfileSchema>(PLOT_PROFILE_STORE_KEY, new Map<string, SerializedPlot>());

	constructor(private dataService: DataService) {}
	onStart(): void {
		this.dataService.addStore(this.plotProfileStore, {
			attachesToPlayer: false,
			profileKeyGenerator: () => this.dataService.generateUUID()
		});
	}
}