import { LinkedList, type ReadonlyILinkedList } from 'shared/lib/data-structures/linked-list';
import type { IStructureCategory } from '../types';
import ResidentialCategory from './categories/Residential';
import RoadCategory from './categories/Road';

export const StructureCategories: ReadonlyILinkedList<string, IStructureCategory> = LinkedList.fromArray([
	[RoadCategory.id, RoadCategory],
	[ResidentialCategory.id, ResidentialCategory],
]);
