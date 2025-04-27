import { Flamework } from '@flamework/core';
import { CmdrClient } from '@rbxts/cmdr';
import LoggerFactory, { LogLevel } from 'shared/util/logger/factory';

// Add all paths to Flamework here
Flamework.addPaths('src/client/controllers');

try {
	Flamework.ignite();
	CmdrClient.SetActivationKeys([Enum.KeyCode.F2]);

	LoggerFactory.getLogger().log('Client started', LogLevel.Info);
} catch {
	LoggerFactory.getLogger().log('Client failed to start', LogLevel.Error);
}
