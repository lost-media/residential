import React, { Binding, InstanceChangeEvent } from "@rbxts/react";
import theme from "../theme";
import { AspectRatio } from "../components/lib";

interface CircleProps {
	active?: boolean;
	size: UDim2;
	color: Color3 | Binding<Color3>;
	position: UDim2;
	anchorPoint: Vector2;
	transparency: number;
	layoutOrder: number;

	children: React.ReactNode;

	onClick: () => void;
	onMouseEnter: () => void;
	onMouseLeave: () => void;

	change: InstanceChangeEvent<ImageButton>;
}

export default function Circle(props: Partial<CircleProps>) {
	return (
		<imagebutton
			Active={props.active ?? false}
			LayoutOrder={props.layoutOrder ?? 0}
			BackgroundTransparency={1}
			Image={theme.images.circle}
			ImageColor3={props.color ?? theme.colors.white.DEFAULT}
			ImageTransparency={props.transparency ?? 0}
			Size={props.size ?? new UDim2(0, 100, 0, 100)}
			Position={props.position ?? new UDim2(0.5, 0, 0.5, 0)}
			AnchorPoint={props.anchorPoint ?? new Vector2(0.5, 0.5)}
			Event={{
				MouseEnter: props.onMouseEnter,
				MouseLeave: props.onMouseLeave,
				MouseButton1Click: props.onClick,
			}}
			Change={props.change}
		>
			<AspectRatio aspectRatio={1} />
			{props.children}
		</imagebutton>
	);
}
