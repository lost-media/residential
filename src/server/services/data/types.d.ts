import { PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import { PlotProfileSchema } from "./plot-data-service/types";

declare global {
	export interface ProfileStores {
		[PLOT_PROFILE_STORE_KEY]: PlotProfileSchema;
	}
	type ProfileKey = keyof ProfileStores;
}
