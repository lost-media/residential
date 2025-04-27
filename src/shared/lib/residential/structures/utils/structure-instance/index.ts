import type { IStructure, IStructureInstance, SerializedStructureInstance } from "shared/lib/residential/types";
import { cframeComponentsToArray } from "shared/util/cframe-utils";

class StructureInstance implements IStructureInstance {
	public uuid: string;
	public structure: IStructure;
	public model?: Model | undefined;
	public attachments?: Attachment[] | undefined;

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

		// populate the attachments
		this.attachments?.clear();
		this.attachments = this.getAttachments();

		return res;
	}

	public serialize(relativePlatformCFrame?: CFrame): SerializedStructureInstance {
		const relativeCFrame = relativePlatformCFrame?.Inverse().mul(this.model?.GetPivot() ?? new CFrame());

		return {
			uuid: this.uuid,
			structureId: this.structure.id,
			cframe: relativeCFrame !== undefined ? cframeComponentsToArray(relativeCFrame) : undefined,

			// any properties (i.e physical, metadata, etc) specific to this structure can go here
		};
	}

	public getAttachments(): Array<Attachment> {
		const model = this.model;

		if (model !== undefined) {
			const primaryPart = model.PrimaryPart;

			if (primaryPart !== undefined) {
				const attachments = primaryPart.GetChildren().filter((instance) => instance.IsA("Attachment"));
				// verify that these are attachments in the configurations
				const res = attachments.filter((attachment) => {
					return this.structure.attachments?.find((a) => a.attachmentName === attachment.Name) !== undefined;
				});

				return res;
			}
		}

		return [];
	}

	public canSnapTo(parent: IStructureInstance, attachmentName: string): boolean {
		const attachment = parent.structure.attachments?.find((a) => a.attachmentName === attachmentName);
		if (!attachment) return false;

		// Validate orientation or other constraints here
		// Example: Check if the current structure's orientation matches the attachment's allowed orientation
		if (attachment.type === "pair") {
			const pairedAttachments = attachment.pairedWith ?? [];

			for (const pairedName of pairedAttachments) {
				const pairedAttachment = parent.structure.attachments?.find((a) => a.attachmentName === pairedName);

				if (pairedAttachment === undefined) {
					return false;
				}
			}
		}

		return true;
	}
}

export = StructureInstance;
