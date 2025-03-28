import { Profile, ProfileStore, StartSessionParams } from "server/lib/profile-store/types";
import { Service } from "@flamework/core";
import { ProfileKey, ProfileSchemas } from "./types";

@Service()
export abstract class AbstractDataService<Schema> {
	protected abstract profileIdentifier: ProfileKey;
	protected abstract profileStore: ProfileStore<Schema>;

	public getProfile(key: string): Optional<Profile<Schema>> {
		return this.profileStore.GetAsync(key);
	}

	public createProfile(key: string, params: Partial<StartSessionParams> = {}) {
		return this.profileStore.StartSessionAsync(key, params);
	}
}
