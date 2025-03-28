import { KnitServer as Knit } from "@rbxts/knit";
import ProfileStore from "server/lib/profile-store";
import { PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import { getKeysFromMap } from "shared/util/array-utils";
import type { PlotProfileStore } from "./types";
import { SerializedPlot } from "server/lib/plot";

const PlotDataService = Knit.CreateService({
	Name: "PlotDataService",

	plotProfileStore: new ProfileStore<PlotProfileStore>(PLOT_PROFILE_STORE_KEY, new Map<string, SerializedPlot>()),

	KnitStart() {
		const dataService = Knit.GetService("DataService");

		dataService.addStore(this.plotProfileStore);
	},

	getPlotProfile(player: Player) {
		// create a new UUID
		const dataService = Knit.GetService("DataService");
		return dataService.getProfile(player, PLOT_PROFILE_STORE_KEY);
	},

	getAllPlayerPlotUUIDs(player: Player): string[] {
		const plots = this.getPlotProfile(player);

		if (plots !== undefined) {
			return getKeysFromMap(plots.Data);
		} else {
			return [];
		}
	},
});

export = PlotDataService;
