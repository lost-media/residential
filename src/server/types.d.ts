import PlayerService from "./services/player-service";
import PlotService from "./services/plot-service";

declare global {
	interface KnitServices {
		PlayerService: typeof PlayerService;
		PlotService: typeof PlotService;
	}
}

export {};
