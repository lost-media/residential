import { PLAYER_PLOTS_PROFILE_STORE_KEY, PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import type { PlotProfileSchema, PlayerPlotProfileStoreSchema } from "./plot-data-service";

/**
 * Defines the schema for all profile stores.
 */
export interface ProfileSchemas {
    [PLOT_PROFILE_STORE_KEY]: PlotProfileSchema;
	[PLAYER_PLOTS_PROFILE_STORE_KEY]: PlayerPlotProfileStoreSchema
}

/**
 * Represents the keys of all profile schemas.
 */
export type ProfileKey = keyof ProfileSchemas;

/**
 * Utility type to extract the schema type for a given profile key.
 */
export type ProfileSchemaForKey<K extends ProfileKey> = ProfileSchemas[K];