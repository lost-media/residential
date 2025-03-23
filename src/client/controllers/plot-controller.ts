import { ClientRemoteSignal, KnitClient, Signal } from "@rbxts/knit";

const PlotController = KnitClient.CreateController({
	Name: "PlotController",

	plotAssigned: new Signal<(plot: PlotInstance) => void>(),

	plot: undefined as Optional<PlotInstance>,

	KnitStart() {
		this.listenForPlotAssignCallback();
	},

	listenForPlotAssignCallback(): void {
		const plotService = KnitClient.GetService("PlotService");

		const plotAssignedCallback = (plot: PlotInstance) => {
			this.plot = plot;
			plotAssignedConnection.Disconnect();
			this.plotAssigned.Fire(plot);
		};

		const plotAssignedConnection = plotService.PlotAssigned.Connect(plotAssignedCallback);
	},

	getPlotAsync(): Promise<PlotInstance> {
		return new Promise((resolve) => {
			if (this.plot !== undefined) {
				resolve(this.plot);
			} else {
				const [res] = this.plotAssigned.Wait();
				resolve(res);
			}
		});
	},
});

export = PlotController;
