import { KnitServer, Loader } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "Shared/Util/Logger/Factory";
import { StructureCategories } from "Shared/Lib/Residential/Structures";
import { profileFunction } from "Shared/Util/Profiler";
import { BaseTest } from "Shared/LMUnit/BaseTest";
import { promisify } from "@rbxts/knit/Knit/Util/Promise";

const TESTS_ENABLED = true;

const testFolder = script.FindFirstChild("Test");

KnitServer.Start()
	.andThen(() => {
		LoggerFactory.getLogger().log("Server started", LogLevel.Info);

		if (TESTS_ENABLED) {
			LoggerFactory.getLogger().log("Running tests...", LogLevel.Info);
			print("                                                       ");
			print("-------------------- Running Tests --------------------");
			print("                                                       ");
			// Run tests here
			if (testFolder) {
				promisify(() => {
					const tests = Loader.LoadChildren(testFolder) as BaseTest[];

					tests.forEach((test) => {
						test.runTests();
					});
				})()
					.then(() => {
						LoggerFactory.getLogger().log("Tests complete", LogLevel.Info);
					})
					.catch(() => {
						LoggerFactory.getLogger().log("Failed to run tests", LogLevel.Error);
					});
			}

			print("                                                        ");
			print("-------------------- Tests Complete --------------------");
			print("                                                        ");
		}
	})
	.catch(() => {
		LoggerFactory.getLogger().log("Server failed to start", LogLevel.Error);
	});
