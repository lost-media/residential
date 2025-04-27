import { Assert } from '@rbxts/lunit';
import { ID_ATTRIBUTE_KEY } from 'shared/lib/residential/configs';
import type { IStructure } from 'shared/lib/residential/types';
import { weldModelToPrimaryPart } from 'shared/util/instance-utils';
import LoggerFactory, { LogLevel } from 'shared/util/logger/factory';

export function initializeStructure(structure: IStructure): void {
	Assert.notUndefined(
		structure.model,
		`[initializeStructureModel]: Structure "${structure.name}" has an undefined model`,
	);

	const model = structure.model;

	try {
		weldModelToPrimaryPart(model);
	} catch {
		LoggerFactory.getLogger().log(`Failed to weld structure "${structure.name}"`, LogLevel.Error);
	}

	model.SetAttribute(ID_ATTRIBUTE_KEY, structure.id);
}
