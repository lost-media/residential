import { Networking } from '@flamework/networking';

interface ClientToServerFunctions {
	function(param1: string): number;
}

interface ServerToClientFunctions {
	function(param1: string): number;
}

// Returns an object containing a `server` and `client` field.
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
