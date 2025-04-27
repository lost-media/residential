import React, { type Binding } from '@rbxts/react';

export type NumberOrUDim = number | UDim;

interface BorderRadiusProps extends Partial<Omit<WritableProperties<UICorner>, 'CornerRadius'>> {
	radius?: number;
}

export function getPadding(udim?: NumberOrUDim): UDim {
	if (typeIs(udim, 'number')) {
		return new UDim(0, udim);
	}

	return udim ?? new UDim(0, 0);
}

export const BorderRadius = React.forwardRef((props: BorderRadiusProps, ref: React.Ref<UICorner>) => {
	//destructure without using the destructor operator, radius and ...props
	return <uicorner ref={ref} CornerRadius={new UDim(0, props.radius)} />;
});

interface PaddingProps
	extends Partial<
		Omit<WritableProperties<UIPadding>, 'PaddingBottom' | 'PaddingLeft' | 'PaddingRight' | 'PaddingTop'>
	> {
	all?: NumberOrUDim;
	horizontal?: NumberOrUDim;
	vertical?: NumberOrUDim;
	top?: NumberOrUDim;
	right?: NumberOrUDim;
	bottom?: NumberOrUDim;
	left?: NumberOrUDim;
}

export const Padding = React.forwardRef((props: PaddingProps, ref: React.Ref<UIPadding>) => {
	const { all, horizontal, vertical, top, right, bottom, left } = props;

	return (
		<uipadding
			ref={ref}
			PaddingTop={getPadding(top ?? all ?? vertical)}
			PaddingRight={getPadding(right ?? all ?? horizontal)}
			PaddingBottom={getPadding(bottom ?? all ?? vertical)}
			PaddingLeft={getPadding(left ?? all ?? horizontal)}
		/>
	);
});

interface TextSizeConstraintProps
	extends Partial<Omit<WritableProperties<UITextSizeConstraint>, 'MaxTextSize' | 'MinTextSize'>> {
	min?: number;
	max?: number;
}

export const TextSizeConstraint = React.forwardRef(
	(props: TextSizeConstraintProps, ref: React.Ref<UITextSizeConstraint>) => {
		const { min, max } = props;

		return <uitextsizeconstraint ref={ref} MaxTextSize={max} MinTextSize={min} />;
	},
);

interface ScaleProps extends Partial<Omit<WritableProperties<UIScale>, 'Scale'>> {
	scale?: number | Binding<number>;
}

export const Scale = React.forwardRef((props: ScaleProps, ref: React.Ref<UIScale>) => {
	const { scale } = props;

	return <uiscale ref={ref} Scale={scale} />;
});

interface AspectRatioProps extends Partial<Omit<WritableProperties<UIAspectRatioConstraint>, 'AspectRatio'>> {
	aspectRatio?: number;
}

export const AspectRatio = React.forwardRef((props: AspectRatioProps, ref: React.Ref<UIAspectRatioConstraint>) => {
	const { aspectRatio } = props;

	return <uiaspectratioconstraint ref={ref} AspectRatio={aspectRatio} />;
});

interface SizeConstraintProps extends Partial<Omit<WritableProperties<UISizeConstraint>, 'MaxSize' | 'MinSize'>> {
	min?: Vector2;
	max?: Vector2;
}

export const SizeConstraint = React.forwardRef((props: SizeConstraintProps, ref: React.Ref<UISizeConstraint>) => {
	const { min, max } = props;

	return <uisizeconstraint ref={ref} MaxSize={max} MinSize={min} />;
});

interface ImageLabelProps extends Partial<Omit<WritableProperties<ImageLabel>, 'Image'>> {
	image: RbxAssetId;
}

export const Image = React.forwardRef((props: ImageLabelProps, ref: React.Ref<ImageLabel>) => {
	const { image } = props;

	return (
		<imagelabel
			ref={ref}
			Image={image}
			BackgroundTransparency={props.BackgroundTransparency ?? 1}
			Size={props.Size}
			Position={props.Position}
			AnchorPoint={props.AnchorPoint}
			BackgroundColor3={props.BackgroundColor3}
			BorderSizePixel={props.BorderSizePixel ?? 0}
			BorderColor3={props.BorderColor3}
			Rotation={props.Rotation}
			Visible={props.Visible}
			ZIndex={props.ZIndex}
			ClipsDescendants={props.ClipsDescendants ?? false}
			ImageColor3={props.ImageColor3 ?? new Color3(1, 1, 1)}
			ImageRectOffset={props.ImageRectOffset}
			ImageRectSize={props.ImageRectSize}
			ImageTransparency={props.ImageTransparency ?? 0}
			ScaleType={props.ScaleType ?? Enum.ScaleType.Slice}
			SliceCenter={props.SliceCenter}
			SliceScale={props.SliceScale}
			TileSize={props.TileSize}
		/>
	);
});

export interface StrokeProps
	extends Partial<Omit<WritableProperties<UIStroke>, 'Color' | 'Transparency' | 'Thickness'>> {
	color?: Color3;
	transparency?: number;
	thickness?: number;
}

export const Stroke = React.forwardRef((props: StrokeProps, ref: React.Ref<UIStroke>) => {
	const { color, transparency, thickness } = props;

	return <uistroke ref={ref} Color={color} Transparency={transparency} Thickness={thickness} />;
});

interface ListLayoutProps extends Partial<Omit<WritableProperties<UIListLayout>, 'Padding' | 'FillDirection'>> {
	padding?: NumberOrUDim;
	fillDirection?: Enum.FillDirection;
}

export const ListLayout = React.forwardRef((props: ListLayoutProps, ref: React.Ref<UIListLayout>) => {
	const { padding, fillDirection } = props;

	return (
		<uilistlayout
			ref={ref}
			Padding={getPadding(padding)}
			FillDirection={fillDirection}
			HorizontalAlignment={props.HorizontalAlignment}
			SortOrder={props.SortOrder}
			VerticalAlignment={props.VerticalAlignment}
		/>
	);
});
