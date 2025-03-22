import { Assert } from "@rbxts/lunit";
import Plot from ".";
import { LinkedList } from "shared/lib/DataStructures/LinkedList";
import { PlotInstance } from "./types";

class PlotFactory {
	private static plots: LinkedList<Instance, Plot> = new LinkedList();

	private constructor() {}

	public static addPlot(plot: Instance): void {
		// verify that the plot has the right structure before adding it to the array
		Assert.notUndefined(
			plot.FindFirstChild("Structures"),
			() => `[PlotFactory]: Plot "${plot.Name}" does not have a folder called "Structures"`,
		);

		Assert.notUndefined(
			plot.FindFirstChild("Tiles"),
			() => `[PlotFactory]: Plot "${plot.Name}" does not have a folder called "Tiles"`,
		);

		// don't add the plot again if it already exists
		if (this.plots.contains(plot) === true) {
			return;
		}

		const newPlot = new Plot(plot as PlotInstance);

		this.plots.add(plot, newPlot);
	}

	public static assignPlayer(player: Player): Optional<Plot> {
		return undefined;
	}
}

export = PlotFactory;
