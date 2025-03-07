import { IStructureCategory } from "../types";
import RoadCategory from "./Categories/Road";
import ResidentialCategory from "./Categories/Residential";

export const StructureCategories: Readonly<IStructureCategory>[] = [RoadCategory, ResidentialCategory];
