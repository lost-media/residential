import { KnitServer } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "shared/util/logger/factory";
import { TestRunner } from "@rbxts/lunit";

const TESTS_ENABLED = true;

const serverTestsFolder = script.FindFirstChild("tests");
const serverUnitTestsFolder = serverTestsFolder?.FindFirstChild("unit");

const SERVICES_FOLDER = script.FindFirstChild("services");

if (SERVICES_FOLDER !== undefined) {
	KnitServer.AddServices(SERVICES_FOLDER);
}

KnitServer.Start()
	.andThen(async () => {
		LoggerFactory.getLogger().log("Server started", LogLevel.Info);

		if (TESTS_ENABLED) {
			LoggerFactory.getLogger().log("Running tests...", LogLevel.Info);
			// Run tests here
			if (serverUnitTestsFolder !== undefined) {
				const testRunner = new TestRunner([serverUnitTestsFolder]);
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
