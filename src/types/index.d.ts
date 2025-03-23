interface ReplicatedStorage extends Instance {
	Models: Folder & {
		Road: Folder;
		Residential: Folder;
	};
}

interface Workspace extends Instance {
	Plots: Folder;
}
