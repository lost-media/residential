import type { Registry } from "@rbxts/cmdr";

export = (registry: Registry) => {
	registry.RegisterHook("BeforeRun", (context) => {
		if (context.Group === "DefaultAdmin" && context.Executor.UserId !== game.CreatorId) {
			return "You don't have permission to run this command";
		}
	});
};
