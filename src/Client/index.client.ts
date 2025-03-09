import { KnitClient } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "shared/util/Logger/Factory";

KnitClient.AddControllers(script.FindFirstChild("controllers") as Instance);

KnitClient.Start()
	.then(() => {
		LoggerFactory.getLogger().log("Client started", LogLevel.Info);
	})
	.catch(() => {
		LoggerFactory.getLogger().log("Client failed to start", LogLevel.Error);
	});
