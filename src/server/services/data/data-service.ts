import { OnStart, Service } from "@flamework/core";
import { HttpService, Players } from "@rbxts/services";
import type { Profile } from "server/lib/profile-store/types";
import LoggerFactory from "shared/util/logger/factory";
import { PlayerService } from "../player-service";

@Service()
export class DataService implements OnStart {
	private playerSessions = new Map<Player, Array<Profile<unknown>>>();

	constructor(private playerService: PlayerService) {}

	/**
	 * Called when the service starts.
	 */
	public onStart(): void {
		this.playerService.addPlayerLeavingConnection((player) => {
			this.endPlayerSessions(player);
		});
	}

	/**
	 * Ends all sessions for a given player.
	 */
	private endPlayerSessions(player: Player): void {
		const profiles = this.playerSessions.get(player);

		let count = 0;
		profiles?.forEach((profile) => {
			profile?.EndSession();
			count++;
		});

		this.playerSessions.delete(player);

		LoggerFactory.getLogger().log(
			`Ended ${count} profile(s) for Player ${player.Name}'s session`,
			undefined,
			"DataService",
		);
	}

	/**
	 * Sets up a player's profile and handles session events.
	 */
	public attachProfileToPlayer<T>(player: Player, profile: Profile<T>): void {
		profile.AddUserId(player.UserId);
		profile.Reconcile();

		profile.OnSessionEnd.Connect(() => {
			this.playerSessions.delete(player);
			player.Kick(`[DataService]: Profile session ended`);
		});

		if (player.Parent === Players) {
			const playerProfiles = this.playerSessions.get(player) ?? [];

			playerProfiles.push(profile);
			this.playerSessions.set(player, playerProfiles);
		} else {
			profile.EndSession();
		}
	}

	/**
	 * Generates a UUID for unique identification.
	 */
	public generateUUID(): string {
		return HttpService.GenerateGUID(false);
	}
}
