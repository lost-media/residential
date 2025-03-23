import React, { useState } from "@rbxts/react";
import Circle from "client/ui/base/circle";
import Stripe from "client/ui/base/stripe";
import { ColorToken } from "client/ui/theme";
import { useTooltip, TooltipDirection, TooltipComponent } from "@rbxts/react-tooltip";
import { BasicTooltip } from "../tooltips";

import { useSprings } from "client/ui/hooks/useSpring";

import { Padding, Scale, SizeConstraint, Image } from "../lib";

import theme from "client/ui/theme";

export interface ButtonProps {
	variant: ColorToken;
	text: string;
	size?: UDim2;
	anchorPoint: Vector2;
	position: UDim2;
	layoutOrder: number;

	onClick: () => void;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
}

export interface CircularButtonProps extends ButtonProps {
	icon?: string;
	tooltipDirection?: TooltipDirection;
	tooltipDelay?: number;
	tooltipComponent?: TooltipComponent;
}

export function CircularButton(props: Partial<CircularButtonProps>) {
	const { showTooltip, hideTooltip, updatePosition, updateSize } = useTooltip({
		direction: props.tooltipDirection ?? "top",
		delay: props.tooltipDelay ?? 0.25,
		component: props.tooltipComponent ?? BasicTooltip,
	});

	const [hovered, setHovered] = useState<boolean>(false);

	const { background, scale } = useSprings(
		{
			scale: hovered ? 1.1 : 1,
			background: hovered ? Color3.fromRGB(150, 255, 140) : theme.colors.white.DEFAULT,
		},
		{
			frequency: 0.25,
		},
	);

	return (
		<Circle
			active
			size={props.size}
			layoutOrder={props.layoutOrder}
			onMouseEnter={() => {
				if (props.onMouseEnter) {
					props.onMouseEnter();
				}
				setHovered(true);
				showTooltip();
			}}
			onMouseLeave={() => {
				if (props.onMouseLeave) {
					props.onMouseLeave();
				}
				setHovered(false);
				//onMouseLeave();
				hideTooltip();
			}}
			change={{
				AbsolutePosition: updatePosition,
				AbsoluteSize: updateSize,
			}}
		>
			<SizeConstraint max={new Vector2(96, 96)} />
			<Padding all={2} />
			<Scale scale={1} />

			<Circle color={background} size={new UDim2(1, 0, 1, 0)}>
				<Stripe onClick={props.onClick} size={new UDim2(1, 0, 1, 0)}>
					<Padding all={new UDim(0.2, 0)} />
					<Image
						image={"rbxassetid://18476991644"}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Size={new UDim2(1, 0, 1, 0)}
						ImageColor3={theme.colors.black.DEFAULT}
					/>
				</Stripe>
			</Circle>
		</Circle>
	);
}

export const Button = ({ text }: { text: string }) => {
	const { showTooltip, hideTooltip, updatePosition, updateSize } = useTooltip({
		component: BasicTooltip,
	});

	return (
		<textbutton
			Text={text}
			Event={{
				MouseEnter: showTooltip,
				MouseLeave: hideTooltip,
			}}
			Change={{
				AbsolutePosition: updatePosition,
				AbsoluteSize: updateSize,
			}}
		/>
	);
};
