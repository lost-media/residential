import { IStructureCategory } from "../types";
import RoadCategory from "./categories/Road";
import ResidentialCategory from "./categories/Residential";
import { LinkedList, ReadonlyILinkedList } from "shared/lib/data-structures/linked-list";

export const StructureCategories: ReadonlyILinkedList<string, IStructureCategory> = LinkedList.fromArray([
	[RoadCategory.id, RoadCategory],
	[ResidentialCategory.id, ResidentialCategory],
]);
