import PlotController from "./controllers/plot-controller";
import PlacementController from "./controllers/placement-controller";

declare global {
	interface KnitControllers {
		PlotController: typeof PlotController;
		PlacementController: typeof PlacementController;
	}
}

export {};
