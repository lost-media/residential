import { SerializedPlot } from "server/lib/plot";
import { PLOT_PROFILE_STORE_KEY } from "server/utils/constants";

export type PlotProfileStore = Map<string, SerializedPlot>;

declare global {
	export interface ProfileStores {
		[PLOT_PROFILE_STORE_KEY]: PlotProfileStore;
	}
	type ProfileKey = keyof ProfileStores;
}
