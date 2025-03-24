import { Assert } from "@rbxts/lunit";
import Plot from ".";
import { LinkedList } from "shared/lib/data-structures/linked-list";
import { PLATFORM_INSTANCE_NAME, PLOT_STRUCTURES_FOLDER_NAME } from "shared/lib/plot/configs";

class PlotFactory {
	private static plots: LinkedList<Instance, Plot> = new LinkedList();

	private constructor() {}

	public static loadPlotsFromParent(parent: Instance) {
		Assert.notUndefined(parent, () => `[PlotFactory:addPlotsFromParent]: Expected a defined parent instance`);

		parent.GetChildren().forEach((instance) => {
			PlotFactory.addPlot(instance);
		});
	}

	public static count(): number {
		return this.plots.size();
	}

	public static addPlot(plot: Instance): void {
		// verify that the plot has the right structure before adding it to the array
		Assert.notUndefined(
			plot.FindFirstChild(PLOT_STRUCTURES_FOLDER_NAME),
			() =>
				`[PlotFactory:addPlot]: Plot "${plot.Name}" does not have a folder called "${PLOT_STRUCTURES_FOLDER_NAME}"`,
		);

		Assert.notUndefined(
			plot.FindFirstChild(PLATFORM_INSTANCE_NAME),
			() => `[PlotFactory:addPlot]: Plot "${plot.Name}" does not have a folder called ${PLATFORM_INSTANCE_NAME}`,
		);

		// don't add the plot again if it already exists
		if (this.plots.contains(plot) === true) {
			return;
		}

		const newPlot = new Plot(plot as PlotInstance);

		this.plots.add(plot, newPlot);
	}

	public static assignPlayer(player: Player): Optional<Plot> {
		// first, check if the player is assigned. don't do anything if they are assigned
		if (this.getPlayersPlot(player) !== undefined) {
			return;
		}

		const plotToAdd = this.plots.find((_, plot) => plot.isAssigned() === false);

		if (plotToAdd !== undefined) {
			return plotToAdd;
		} else {
			throw `[PlotFactory:assignPlayer]: Unable to find an available plot for player ${player.Name}`;
		}
	}

	private static getPlayersPlot(player: Player): Optional<Plot> {
		return this.plots.find((_, plot) => plot.getPlayer() === player);
	}
}

export = PlotFactory;
