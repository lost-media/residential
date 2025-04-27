import { Flamework } from "@flamework/core";
import { Cmdr } from "@rbxts/cmdr";
import { TestRunner } from "@rbxts/lunit";
import { StructureCategories } from "shared/lib/residential/structures";
import { initializeStructure } from "shared/lib/residential/structures/utils/initialize-structure-models";
import LoggerFactory, { LogLevel } from "shared/util/logger/factory";

const TESTS_ENABLED = true;
const serverUnitTestsFolder = script.FindFirstChild("tests");

const serverCmdrFolder = script.FindFirstChild("cmdr");
const serverCmdrCommandsFolder = serverCmdrFolder?.FindFirstChild("commands");
const serverCmdrHooksFolder = serverCmdrFolder?.FindFirstChild("hooks");

// Add all paths to Flamework here
Flamework.addPaths("src/server/services");

try {
	Flamework.ignite();
	Cmdr.RegisterDefaultCommands();

	if (serverCmdrCommandsFolder !== undefined) {
		Cmdr.RegisterCommandsIn(serverCmdrCommandsFolder);
	}

	if (serverCmdrHooksFolder !== undefined) {
		Cmdr.RegisterHooksIn(serverCmdrHooksFolder);
	}

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
			testRunner
				.run()
				.then(() => {
					LoggerFactory.getLogger().log("Tests complete", LogLevel.Info);
				})
				.catch((e) => {
					LoggerFactory.getLogger().log(`Failed to run tests: ${e}`, LogLevel.Error);
				});
		}
	}
} catch (e) {
	LoggerFactory.getLogger().log(`Server failed to start ${e}`, LogLevel.Error);
}
