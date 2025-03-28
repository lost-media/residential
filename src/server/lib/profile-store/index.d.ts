import type { ProfileStore, JSONAcceptable, ConstantName, Profile } from "./types";

interface ProfileStoreInternal<T> extends ProfileStore<T> {
	Mock: ProfileStore<T>;
}

type ProfileStoreName = keyof ProfileStores;

interface ProfileStoreConstructor {
	new <T = unknown>(storeName: ProfileStoreName): ProfileStoreInternal<T>;
	new <T>(storeName: ProfileStoreName, template?: T): ProfileStoreInternal<T>;

	IsClosing: boolean;
	IsCriticalState: boolean;
	OnError: {
		Connect: (
			self: any,
			listener: (message: string, storeName: string, profileKey: string) => void,
		) => { Disconnect: (self: any) => void };
	};
	OnOverwrite: {
		Connect: (
			self: any,
			listener: (storeName: string, profileKey: string) => void,
		) => { Disconnect: (self: any) => void };
	};
	OnCriticalToggle: {
		Connect: (self: any, listener: (isCritical: boolean) => void) => { Disconnect: (self: any) => void };
	};
	DataStoreState: "NotReady" | "NoInternet" | "NoAccess" | "Access";
	SetConstant: (name: ConstantName, value: number) => void;
}

declare const ProfileStore: ProfileStoreConstructor;

export = ProfileStore;
