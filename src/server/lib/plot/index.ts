import { LinkedList } from "shared/lib/DataStructures/LinkedList";

export interface PlotInstance extends Model {
	Structures: Folder;
	Tiles: Model;
}

export default class Plot {
	private player?: Player;
	private instance: PlotInstance;
	private structureList: LinkedList<string, Model>;

	constructor(plotInstance: PlotInstance) {
		this.player = undefined;
		this.instance = plotInstance;
		this.structureList = new LinkedList<string, Model>();
	}

	assignPlayer(player: Player) {
		assert(this.player === undefined, "[Plot]: player cannot be assigned because plot is already assigned");

		this.player = player;
	}

	unassignPlayer() {
		this.player = undefined;
		this.instance.Structures.ClearAllChildren();
	}
}
