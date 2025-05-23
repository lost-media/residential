import { IStructure } from "shared/lib/residential/types";
import { loadChildren } from "shared/util/loader-utils";

export const FOLDER_NAME = "Structures";

export function loadStructures(parent: Instance): IStructure[] {
	if (!parent) {
		throw `Expected an instance to load structures from. Got ${parent}.`;
	}
	const structuresFolder = parent.FindFirstChild("Structures");
	if (!structuresFolder || !structuresFolder.IsA("Folder")) {
		throw `Expected a folder named "${FOLDER_NAME}" in the category folder.`;
	}
	return loadChildren(structuresFolder) as IStructure[];
}
