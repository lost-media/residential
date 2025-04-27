import { Koins } from 'shared/lib/residential/currency';
import type { IStructure } from 'shared/lib/residential/types';

const structure: IStructure = {
	id: 'residential-small-house',

	name: 'Small House',
	description: 'A small house.',
	model: new Instance('Model'),

	price: {
		value: 500,
		currency: Koins,
	},
};

export = structure;
