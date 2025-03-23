import { KnitClient } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "shared/util/logger/factory";

const CONTROLLERS_FOLDER = script.FindFirstChild("controllers");

if (CONTROLLERS_FOLDER !== undefined) {
	KnitClient.AddControllers(CONTROLLERS_FOLDER);
}

KnitClient.Start()
	.then(() => {
		LoggerFactory.getLogger().log("Client started", LogLevel.Info);
	})
	.catch(() => {
		LoggerFactory.getLogger().log("Client failed to start", LogLevel.Error);
	});
