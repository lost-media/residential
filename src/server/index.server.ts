import { KnitServer } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "shared/Util/Logger/Factory";

KnitServer.Start()
	.andThen(() => {
		LoggerFactory.getLogger().log("Server started", LogLevel.Info);
	})
	.catch(() => {
		LoggerFactory.getLogger().log("Server failed to start", LogLevel.Error);
	});
