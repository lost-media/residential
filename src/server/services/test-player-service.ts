import { Service } from "@flamework/core";
import { Players } from "@rbxts/services";

@Service()
export class PlayerService {
    private onPlayerJoinedCallbacks = new Array<(player: Player) => void>();
    private onPlayerLeavingCallbacks = new Array<(player: Player) => void>();
    
    private onPlayerJoinedConnection: RBXScriptConnection
    private onPlayerLeavingConnection: RBXScriptConnection
    
    constructor() {
        this.onPlayerJoinedConnection = Players.PlayerAdded.Connect((player) => {
            this.onPlayerJoinedCallbacks.forEach((callback) => {
                callback(player);
            });
        });
        this.onPlayerLeavingConnection = Players.PlayerRemoving.Connect((player) => {
            this.onPlayerLeavingCallbacks.forEach((callback) => {
                callback(player);
            });
        });
    }

    public addPlayerJoinConnection(callback: (player: Player) => void): void {
        // If there are players in the server before the event begins, call the callback for each player
        Players.GetPlayers().forEach((player) => {
            task.spawn(callback, player);
        });

        this.onPlayerJoinedCallbacks.push(callback);
    }

    public addPlayerLeavingConnection(callback: (player: Player) => void): void {
        this.onPlayerLeavingCallbacks.push(callback);
    }

    public getAllCharacters(): Character[] {
        const players = Players.GetPlayers();
        return players.map((player) => player.Character as Character).filter((character) => character !== undefined);
    }
}