import { KnitServer } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "Shared/Util/Logger/Factory";
import { promisify } from "@rbxts/knit/Knit/Util/Promise";
import { TestRunner } from "Shared/LMUnit/test-runner";

const TESTS_ENABLED = true;

const testFolder = script.FindFirstChild("Test");

KnitServer.Start()
	.andThen(() => {
		LoggerFactory.getLogger().log("Server started", LogLevel.Info);

		if (TESTS_ENABLED) {
			LoggerFactory.getLogger().log("Running tests...", LogLevel.Info);
			// Run tests here
			if (testFolder) {
				promisify(() => {
					const testRunner = new TestRunner(testFolder);

					testRunner.run();
				})()
					.then(() => {
						LoggerFactory.getLogger().log("Tests complete", LogLevel.Info);
					})
					.catch((e) => {
						LoggerFactory.getLogger().log(`Failed to run tests: ${e}`, LogLevel.Error);
					});
			}
		}
	})
	.catch((e) => {
		LoggerFactory.getLogger().log(`Server failed to start ${e}`, LogLevel.Error);
	});
