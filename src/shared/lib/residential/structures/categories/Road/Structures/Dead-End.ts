import { MODELS_FOLDER } from 'shared/lib/residential/configs';
import { Koins } from 'shared/lib/residential/currency';
import type { IStructure } from 'shared/lib/residential/types';

const structure: IStructure = {
	id: 'road-t-dead-end',

	name: 'Dead End',
	description: 'A dead end.',
	model: MODELS_FOLDER?.Road.FindFirstChild('NormalRoad') as Model,

	price: {
		value: 100,
		currency: Koins,
	},
};

export = structure;
