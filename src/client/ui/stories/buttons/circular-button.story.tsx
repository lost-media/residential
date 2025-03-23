import { CircularButton } from "client/ui/components/button";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import { CreateReactStory } from "@rbxts/ui-labs";
import { TooltipProvider } from "@rbxts/react-tooltip";

const controls = {
	text: "Hello, world!!",
};

const story = CreateReactStory(
	{
		react: React,
		controls: controls,
		reactRoblox: ReactRoblox,
	},
	() => {
		return (
			<TooltipProvider>
				<CircularButton
					variant="primary"
					text={"Hello world!"}
					onClick={() => {
						print("Button clicked");
					}}
				/>
			</TooltipProvider>
		);
	},
);

export = story;
