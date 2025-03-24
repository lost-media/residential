import { KnitClient, Signal } from "@rbxts/knit";

const PlotController = KnitClient.CreateController({
	Name: "PlotController",

	// Signals
	signals: {
		plotAssigned: new Signal<(plot: PlotInstance) => void>(),
	},

	plot: undefined as Optional<PlotInstance>,

	KnitStart() {
		this.listenForPlotAssignCallback();
	},

	listenForPlotAssignCallback(): void {
		const plotService = KnitClient.GetService("PlotService");

		const plotAssignedCallback = (plot: PlotInstance) => {
			this.plot = plot;
			plotAssignedConnection.Disconnect();
			this.signals.plotAssigned.Fire(plot);
		};

		const plotAssignedConnection = plotService.PlotAssigned.Connect(plotAssignedCallback);
	},

	getPlotAsync(): Promise<PlotInstance> {
		return new Promise((resolve) => {
			if (this.plot !== undefined) {
				resolve(this.plot);
			} else {
				const [res] = this.signals.plotAssigned.Wait();
				resolve(res);
			}
		});
	},
});

export = PlotController;
