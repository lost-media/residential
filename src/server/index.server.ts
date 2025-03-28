import { KnitServer } from "@rbxts/knit";
import LoggerFactory, { LogLevel } from "shared/util/logger/factory";
import { TestRunner } from "@rbxts/lunit";
import { StructureCategories } from "shared/lib/residential/structures";
import { initializeStructure } from "shared/lib/residential/structures/utils/initialize-structure-models";

const TESTS_ENABLED = true;

const serverTestsFolder = script.FindFirstChild("tests");
const serverUnitTestsFolder = serverTestsFolder?.FindFirstChild("unit");

const SERVICES_FOLDER = script.FindFirstChild("services");

if (SERVICES_FOLDER !== undefined) {
	KnitServer.AddServicesDeep(SERVICES_FOLDER);
}

KnitServer.Start()
	.andThen(async () => {
		LoggerFactory.getLogger().log("Server started", LogLevel.Info);

		// Weld all parts in structures
		StructureCategories.forEach((_, category) => {
			category.structures.forEach((structure) => {
				initializeStructure(structure);
			});
		});

		LoggerFactory.getLogger().log("Welded all structures to primary parts", LogLevel.Info);

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
