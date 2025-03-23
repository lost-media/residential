import { ClientRemoteSignal, KnitClient } from "@rbxts/knit";
import Plot from "shared/lib/plot";

const PlotController = KnitClient.CreateController({
	Name: "PlotController",

	plot: undefined as Optional<Plot>,

	KnitStart() {
		const plotService = KnitClient.GetService("PlotService");
		let plotAssignedConnection: Optional<ClientRemoteSignal.Connection> =
			undefined as unknown as ClientRemoteSignal.Connection;

		const plotAssignedCallback = (plot: Plot) => {
			this.plot = plot;
			print(plot);
			if (plotAssignedConnection) {
				plotAssignedConnection.Disconnect();
			}
		};

		plotAssignedConnection = plotService.PlotAssigned.Connect(plotAssignedCallback);
	},
});

export = PlotController;
