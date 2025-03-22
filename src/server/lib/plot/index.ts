import { Assert } from "@rbxts/lunit";
import { LinkedList } from "shared/lib/DataStructures/LinkedList";
import { IStructureInstance } from "shared/lib/Residential/types";
import { PlotInstance } from "./types";

export default class Plot {
	private player?: Player;
	private instance: PlotInstance;
	private structureList: LinkedList<string, IStructureInstance>;

	constructor(plotInstance: PlotInstance) {
		this.player = undefined;
		this.instance = plotInstance;
		this.structureList = new LinkedList<string, IStructureInstance>();
	}

	public assignPlayer(player: Player): void {
		Assert.undefined(
			this.player,
			() => `[Plot]: Player ${player.Name} cannot be assigned because plot is already assigned`,
		);

		this.player = player;
	}

	public isAssigned(): boolean {
		return this.player !== undefined;
	}

	public unassignPlayer(): void {
		if (this.player === undefined) {
			return;
		}

		this.structureList.forEach((_, value) => {
			value.destroy();
		});

		Assert.empty(
			this.instance.Structures.GetChildren(),
			() => `[Plot]: Object leak detected while unassigning player ${this.player?.Name}`,
		);
	}

	public addStructure(structureInstance: IStructureInstance, cFrame: CFrame): void {
		// spawn a model
		const newStructure = structureInstance.spawn(this.instance.Structures);

		if (newStructure.PrimaryPart === undefined) {
			throw `[Plot]: Primary part of structure model with ID ${structureInstance.structure.id} does not have a Primary Part`;
		}

		newStructure.PrimaryPart.CanCollide = false;
		newStructure.PivotTo(cFrame);

		this.structureList.add(structureInstance.uuid, structureInstance);
	}
}
