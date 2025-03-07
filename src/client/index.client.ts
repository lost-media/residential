import { KnitClient } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "shared/Util/Logger/Factory";

import { StructureCategories } from "shared/Lib/Residential/Structures";

KnitClient.AddControllers(script.FindFirstChild("controllers") as Instance);

KnitClient.Start()
	.then(() => {
		LoggerFactory.getLogger().log("Client started", LogLevel.Info);

		StructureCategories.forEach((category) => {
			LoggerFactory.getLogger().log(`Loaded category: ${category.verboseName}`, LogLevel.Info);
		});
	})
	.catch(() => {
		LoggerFactory.getLogger().log("Client failed to start", LogLevel.Error);
	});
