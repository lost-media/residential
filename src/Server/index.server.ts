import { KnitServer, Loader } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "Shared/Util/Logger/Factory";
import { StructureCategories } from "Shared/Lib/Residential/Structures";
import { profileFunction } from "Shared/Util/Profiler";
import { BaseTest } from "Shared/Test/BaseTest";

const TESTS_ENABLED = true;

const testFolder = script.FindFirstChild("Test");

KnitServer.Start()
	.andThen(() => {
		LoggerFactory.getLogger().log("Server started", LogLevel.Info);

		StructureCategories.forEach((_, category) => {
			LoggerFactory.getLogger().log(
				`Loaded category: ${category.verboseName} with ${category.structures.size()} structures`,
				LogLevel.Info,
			);
		});

		if (TESTS_ENABLED) {
			LoggerFactory.getLogger().log("Running tests...", LogLevel.Info);
			// Run tests here
			if (testFolder) {
				const tests = Loader.LoadChildren(testFolder) as BaseTest[];

				tests.forEach((test, index) => {
					const profileData = profileFunction(() => test.runTests());
					LoggerFactory.getLogger().log(`Test ${index} took ${profileData.timeElapsed}ms`, LogLevel.Info);
				});
			}
		}
	})
	.catch(() => {
		LoggerFactory.getLogger().log("Server failed to start", LogLevel.Error);
	});
