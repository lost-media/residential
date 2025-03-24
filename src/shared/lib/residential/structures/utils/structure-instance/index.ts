import type { IStructure, IStructureInstance } from "shared/lib/residential/types";

class StructureInstance implements IStructureInstance {
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
		this.model = undefined;
	}

	public spawn(): Model;
	public spawn(parent?: Instance): Model {
		const res = this.structure.model.Clone();

		if (parent !== undefined) {
			res.Parent = parent;
		}

		this.model = res;
		return res;
	}

	public serialize(): object {
		return {
			uuid: this.uuid,
			structure_id: this.structure.id,

			// any properties (i.e physical, metadata, etc) specific to this structure can go here
		};
	}
}

export = StructureInstance;
