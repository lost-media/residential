import { PLAYER_PROFILE_STORE_KEY, PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import type { PlayerProfileSchema } from "./player-data-service";
import type { PlotProfileSchema } from "./plot-data-service";

/**
 * Defines the schema for all profile stores.
 */
export interface ProfileSchemas {
	[PLOT_PROFILE_STORE_KEY]: PlotProfileSchema;
	[PLAYER_PROFILE_STORE_KEY]: PlayerProfileSchema;
}

/**
 * Represents the keys of all profile schemas.
 */
export type ProfileKey = keyof ProfileSchemas;

/**
 * Utility type to extract the schema type for a given profile key.
 */
export type ProfileSchemaForKey<K extends ProfileKey> = ProfileSchemas[K];
