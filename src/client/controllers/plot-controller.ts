import { Controller, OnStart } from "@flamework/core";
import Signal from "@rbxts/signal";
import { clientEvents } from "client/utils/networking";

@Controller()
export class PlotController implements OnStart {
    private plot?: PlotInstance = undefined;
    public signals = {
        plotAssigned: new Signal<(plot: PlotInstance) => void>(),
    };

    public onStart() {
        this.listenForPlotAssignedCallback();
    }

    public async getPlotAsync(): Promise<PlotInstance> {
		return new Promise((resolve) => {
			if (this.plot !== undefined) {
				resolve(this.plot);
			} else {
				const [res] = this.signals.plotAssigned.Wait();
				resolve(res);
			}
		});
	}

    public async placeStructure(structureId: string, cframe: CFrame): Promise<void> {
        clientEvents.placeStructure.fire(structureId, cframe);
	}

    private listenForPlotAssignedCallback(): void {

		const plotAssignedCallback = (plot: PlotInstance) => {
			this.plot = plot;
			plotAssignedConnection.Disconnect();
			this.signals.plotAssigned.Fire(plot);
		};

		const plotAssignedConnection = clientEvents.plotAssigned.connect(plotAssignedCallback);
    }
}