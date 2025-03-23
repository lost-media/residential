import PlotController from "client/controllers/plot-controller";

declare global {
	interface KnitControllers {
		PlotController: typeof PlotController;
	}
}

export {};
