import { PLOT_PROFILE_STORE_KEY } from "server/utils/constants";
import { PlotProfileSchema } from "./plot-data-service/types";

/**
 * Defines the schema for all profile stores.
 */
export interface ProfileSchemas {
    [PLOT_PROFILE_STORE_KEY]: PlotProfileSchema;
}

/**
 * Represents the keys of all profile schemas.
 */
export type ProfileKey = keyof ProfileSchemas;



/**
 * Utility type to extract the schema type for a given profile key.
 */
export type ProfileSchemaForKey<K extends ProfileKey> = ProfileSchemas[K];