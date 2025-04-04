import { CommandDefinition } from "@rbxts/cmdr";

export = {
	Name: "clear-plot",
	Aliases: ["cp"],
	Description: "Clears a plot for the player",
	Group: "Admin",
	Args: [
		{
			Type: "player",
			Name: "player",
			Description: "The players whose plot to clear",
		},
	],
} satisfies CommandDefinition;
