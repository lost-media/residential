import { Networking } from '@flamework/networking';

interface ClientToServerEvents {
	placeStructure(structureId: string, cframe: CFrame, uuid?: string): void;
}

interface ServerToClientEvents {
	// Plot
	plotAssigned(plot: PlotInstance): void;
}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
