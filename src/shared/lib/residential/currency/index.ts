export interface Currency {
	verboseName: string;
	verboseNamePlural: string;
	icon: RbxAssetId;
}

// create typed currency objects

export const Koins: Currency = {
	verboseName: "Koin",
	verboseNamePlural: "Koins",
	icon: "rbxassetid://0",
};

export const Roadbucks: Currency = {
	verboseName: "Roadbuck",
	verboseNamePlural: "Roadbucks",
	icon: "rbxassetid://0",
};
