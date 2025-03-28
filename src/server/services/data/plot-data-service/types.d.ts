import { SerializedPlotInstance } from "server/lib/plot";

export type SerializedPlot = {
    ownerId: number;
    plot: SerializedPlotInstance;
};

export type PlotProfileSchema = Map<string, SerializedPlot>;

export const idk = "SDF";