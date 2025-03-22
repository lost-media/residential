import type { IStructure, IStructureInstance } from "shared/lib/Residential/types";

abstract class StructureInstance implements IStructureInstance {
	public uuid: string;
	public structure: IStructure;
	public model?: Model | undefined;

	constructor(uuid: string, structure: IStructure) {
		this.uuid = uuid;
		this.structure = structure;
		this.model = undefined;
	}

	destroy(): void {
		if (this.model !== undefined) {
			this.model.Destroy();
		}
	}

	public spawn(): Model {
		return this.structure.model.Clone();
	}
}

export = StructureInstance;
