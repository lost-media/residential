export const PLOT_STRUCTURES_FOLDER_NAME = 'Structures';
export const PLATFORM_INSTANCE_NAME = 'Platform';

declare global {
	interface PlotInstance extends Model {
		[PLOT_STRUCTURES_FOLDER_NAME]: Folder;
		[PLATFORM_INSTANCE_NAME]: BasePart;
	}
}
