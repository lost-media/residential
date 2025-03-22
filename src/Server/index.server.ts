import { KnitServer } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "shared/util/Logger/Factory";
import { promisify } from "@rbxts/knit/Knit/Util/Promise";
import { TestRunner } from "@rbxts/lunit";

const TESTS_ENABLED = true;

const testFolder = script.FindFirstChild("tests");

KnitServer.Start()
	.andThen(async () => {
		LoggerFactory.getLogger().log("Server started", LogLevel.Info);

		if (TESTS_ENABLED) {
			LoggerFactory.getLogger().log("Running tests...", LogLevel.Info);
			// Run tests here
			if (testFolder !== undefined) {
				const testRunner = new TestRunner([testFolder]);
				await testRunner.run().catch((e) => {
					LoggerFactory.getLogger().log(`Failed to run tests: ${e}`, LogLevel.Error);
				});
			}

			LoggerFactory.getLogger().log("Tests complete", LogLevel.Info);
		}
	})
	.catch((e) => {
		LoggerFactory.getLogger().log(`Server failed to start ${e}`, LogLevel.Error);
	});
