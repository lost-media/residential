import DataService from "./services/data/data-service";
import PlotDataService from "./services/data/plot-data-service";
import PlayerService from "./services/player-service";
import PlotService from "./services/plot-service-2";

declare global {
	interface KnitServices {
		PlayerService: typeof PlayerService;
		PlotService: typeof PlotService;
		DataService: typeof DataService;
		PlotDataService: typeof PlotDataService;
	}
}

export {};
