import { KnitServer as Knit } from "@rbxts/knit";
import ProfileStore from "server/lib/profile-store";
import { PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import { SerializedPlot, type PlotProfileSchema } from "./types";

const PlotDataService = Knit.CreateService({
	Name: "PlotDataService",

	plotProfileStore: new ProfileStore<PlotProfileSchema>(PLOT_PROFILE_STORE_KEY, new Map<string, SerializedPlot>()),

	KnitStart() {
		const dataService = Knit.GetService("DataService");
		dataService.addStore(this.plotProfileStore, {
			attachesToPlayer: false,
			profileKeyGenerator: () => dataService.generateUUID()
		});
	},
});

export = PlotDataService;
