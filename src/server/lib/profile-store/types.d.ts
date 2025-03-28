export class Signal<T> {
    Connect(callback: (args: T) => void): Connection
}

export class Connection {
    Disconnect(): void;
}

export type JSONAcceptable = JSONAcceptable[] | { [key: string]: JSONAcceptable } | number | string | boolean | buffer;

export interface Profile<T> {
    Data: T & JSONAcceptable;
    LastSavedData: T & JSONAcceptable;
    FirstSessionTime: number,
	SessionLoadCount: number,
	Session?: {PlaceId: number, JobId: string},
	RobloxMetaData: JSONAcceptable,
	UserIds: number[],
	KeyInfo: DataStoreKeyInfo,
	OnSave: Signal<void>,
	OnLastSave: Signal<"Manual" | "External" | "Shutdown">;
	OnSessionEnd: Signal<void>
	OnAfterSave: Signal<T & JSONAcceptable>;
	ProfileStore: JSONAcceptable,
	Key: string,

    IsActive(): boolean;
    Reconcile(): void;
    EndSession(): void;
    AddUserId(userId: number): void;
    RemoveUserId(userId: number): void;
    MessageHandler(callback: (message: JSONAcceptable, processed: () => void) => void): void;
    Save(): void;
    SetAsync(): void;
}

export interface VersionQuery<T> {
    NextAsync(): Profile<T> | undefined;
}

export interface ProfileStore<T> {
    Name: string;
    StartSessionAsync(profileKey: string, params: Partial<{
        Steal: boolean;
        Cancel: () => boolean;
    }>): Profile<T> | undefined;
    MessageAsync(profileKey: string, message: JSONAcceptable): boolean;
    GetAsync(profileKey: string, version?: string): Profile<T> | undefined;
    RemoveAsync(profileKey: string): boolean;
}

export type ConstantName = "AUTO_SAVE_PERIOD" | "LOAD_REPEAT_PERIOD" | "FIRST_LOAD_REPEAT" | "SESSION_STEAL"
| "ASSUME_DEAD" | "START_SESSION_TIMEOUT" | "CRITICAL_STATE_ERROR_COUNT" | "CRITICAL_STATE_ERROR_EXPIRE"
| "CRITICAL_STATE_EXPIRE" | "MAX_MESSAGE_QUEUE"
