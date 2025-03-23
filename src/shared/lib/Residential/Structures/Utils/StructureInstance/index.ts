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

	public spawn(): Model;
	public spawn(parent?: Instance): Model {
		const res = this.structure.model.Clone();

		if (parent !== undefined) {
			res.Parent = parent;
		}

		return res;
	}
}

export = StructureInstance;
