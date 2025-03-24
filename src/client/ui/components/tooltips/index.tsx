import React from "@rbxts/react";

import { TooltipComponent } from "@rbxts/react-tooltip";
import { useSpring, useSprings } from "client/ui/hooks/useSpring";
import theme from "client/ui/theme";

import { TextSizeConstraint, Padding, Stroke, BorderRadius, Scale } from "client/ui/components/lib";

type TooltipComponentProps = Parameters<TooltipComponent>[0];

export interface TooltipComponentProps2 extends TooltipComponentProps {
	position: UDim2;
	visible: boolean;
	text?: string;
	smooth?: boolean;
}

export function BasicTooltip({ smooth = false, position, visible, text }: TooltipComponentProps2) {
	const { scale, position2 } = useSprings(
		{
			scale: visible ? 1 : 0,
			position2: position,
		},
		theme.springs.DEFAULT,
	);

	return (
		<canvasgroup
			BackgroundColor3={theme.colors.white.DEFAULT}
			BorderSizePixel={0}
			ZIndex={100}
			AutomaticSize={Enum.AutomaticSize.X}
			Position={smooth ? position2 : position}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={new UDim2(0, 0, 0, 30)}
			GroupTransparency={scale.map((s) => 1 - s)}
		>
			<Padding vertical={new UDim(0.1, 0)} horizontal={16} />
			<Stroke color={theme.colors.black.DEFAULT} thickness={2} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
			<BorderRadius radius={theme.borderRadius.DEFAULT} />
			<Scale scale={scale} />

			<textlabel
				RichText={true}
				BackgroundTransparency={1}
				AutomaticSize={Enum.AutomaticSize.X}
				Size={new UDim2(0, 0, 1, 0)}
				Text={text}
				TextScaled={true}
				TextWrapped={false}
				FontFace={theme.fonts.sans.SemiBold}
				TextSize={theme.textSize.md}
			>
				<TextSizeConstraint max={theme.textSize.lg} />
			</textlabel>
		</canvasgroup>
	);
}

export function BlackTooltip({ smooth = false, position, visible, text }: TooltipComponentProps2) {
	const { scale, position2 } = useSprings(
		{
			scale: visible ? 1 : 0,
			position2: position,
		},
		theme.springs.DEFAULT,
	);

	return (
		<canvasgroup
			BackgroundColor3={theme.colors.black.DEFAULT}
			BorderSizePixel={0}
			ZIndex={100}
			AutomaticSize={Enum.AutomaticSize.X}
			Position={smooth ? position2 : position}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={new UDim2(0, 0, 0, 40)}
			GroupTransparency={scale.map((s) => 1 - s)}
		>
			<Padding vertical={new UDim(0.1, 0)} horizontal={16} />
			<BorderRadius radius={theme.borderRadius.sm} />

			<textlabel
				RichText={true}
				BackgroundTransparency={1}
				AutomaticSize={Enum.AutomaticSize.X}
				Size={new UDim2(0, 0, 1, 0)}
				Text={text}
				TextScaled={true}
				TextWrapped={false}
				FontFace={theme.fonts.sans.SemiBold}
				TextSize={theme.textSize.md}
				TextColor3={theme.colors.white.DEFAULT}
			>
				<TextSizeConstraint max={theme.textSize.lg} />
			</textlabel>
		</canvasgroup>
	);
}

export const Tooltip = ({ position, visible, text }: TooltipComponentProps & { text: string }) => {
	const opacity = useSpring(visible ? 0 : 1, theme.springs.DEFAULT);

	return (
		<canvasgroup
			GroupTransparency={opacity} // Use the opacity value from the animation library to apply a smooth fade-in and fade-out effect
			Position={position}
			Size={new UDim2(0, 0, 0, 40)}
			BorderSizePixel={0}
			BackgroundColor3={new Color3(0, 0, 0)}
			AutomaticSize={Enum.AutomaticSize.X}
			AnchorPoint={new Vector2(0.5, 0.5)}
		>
			<uipadding
				PaddingTop={new UDim(0, 4)}
				PaddingBottom={new UDim(0, 4)}
				PaddingLeft={new UDim(0, 8)}
				PaddingRight={new UDim(0, 8)}
			/>
			<uicorner CornerRadius={new UDim(0, 4)} />
			<textlabel
				Text={text}
				TextColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={1}
				Size={new UDim2(0, 0, 1, 0)}
				TextScaled={true}
				AutomaticSize={Enum.AutomaticSize.X}
			/>
		</canvasgroup>
	);
};
