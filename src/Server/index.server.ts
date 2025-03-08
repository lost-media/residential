import { KnitServer } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "Shared/Util/Logger/Factory";
import { StructureCategories } from "Shared/Lib/Residential/Structures";

KnitServer.Start()
	.andThen(() => {
		LoggerFactory.getLogger().log("Server started", LogLevel.Info);

		StructureCategories.forEach((category) => {
			LoggerFactory.getLogger().log(
				`Loaded category: ${category.verboseName} with ${category.structures.size()} structures`,
				LogLevel.Info,
			);
		});
	})
	.catch(() => {
		LoggerFactory.getLogger().log("Server failed to start", LogLevel.Error);
	});
