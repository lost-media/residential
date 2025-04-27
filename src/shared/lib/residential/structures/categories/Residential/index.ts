import BaseCategory from 'shared/lib/residential/structures/categories/BaseCategory';
import { loadStructures } from 'shared/lib/residential/structures/utils/load-structures';
import type { IStructureCategory } from 'shared/lib/residential/types';

class ResidentialCategory extends BaseCategory implements IStructureCategory {
	id = 'residential' as const;
	icon = 'rbxassetid://0' as RbxAssetId;
	description = 'Residential structures are used to house citizens.' as const;
	verboseName = 'Residential' as const;
	verboseNamePlural = 'Residentials' as const;
	structures = loadStructures(script);
}

const residentialCategory: IStructureCategory = new ResidentialCategory();
export default residentialCategory;
