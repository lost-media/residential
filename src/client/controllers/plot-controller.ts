import { KnitClient, Signal } from "@rbxts/knit";
import LoggerFactory from "shared/util/logger/factory";

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

	async getPlotAsync(): Promise<PlotInstance> {
		return new Promise((resolve) => {
			if (this.plot !== undefined) {
				resolve(this.plot);
			} else {
				const [res] = this.signals.plotAssigned.Wait();
				resolve(res);
			}
		});
	},

	async placeStructure(structureId: string, cframe: CFrame): Promise<void> {
		const plotService = KnitClient.GetService("PlotService");

		plotService
			.placeStructurePromise(structureId, cframe)
			.then(() => {
				print("Successful!");
			})
			.catch((e) => {
				LoggerFactory.getLogger().log(`[PlotController:placeStructure]: Error from server: ${e}`);
			});
	},
});

export = PlotController;
