import { GlobalEvents } from "shared/networking/events";
import { GlobalFunctions } from "shared/networking/functions";

export const clientEvents = GlobalEvents.createClient({
	disableIncomingGuards: true,
});
export const clientFunctions = GlobalFunctions.createClient({});
