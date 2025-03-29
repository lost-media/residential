import { Flamework } from "@flamework/core";
import LoggerFactory, { LogLevel } from "shared/util/logger/factory";

// Add all paths to Flamework here
Flamework.addPaths("src/client/controllers");

try {
	Flamework.ignite();
	LoggerFactory.getLogger().log("Client started", LogLevel.Info);
} catch {
	LoggerFactory.getLogger().log("Client failed to start", LogLevel.Error);
}
