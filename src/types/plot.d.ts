declare global {
	interface PlotInstance extends Model {
		Structures: Folder;
		Platform: BasePart;
	}
}

export {};
