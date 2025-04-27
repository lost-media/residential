import type { SpringOptions } from '@rbxts/ripple';

type ValidTokenType = number | Color3 | UDim2 | UDim | Font | SpringOptions;

type FontToken = {
	Light?: Font;
	Regular: Font;
	SemiBold?: Font;
	Bold?: Font;
	Black?: Font;
};

type Token<T extends ValidTokenType> = {
	DEFAULT: T;
	[token: string]: T;
};

type Color3Token = Token<Color3> & {
	foreground: Color3;
	active: Color3;
};

type Theme = {
	spacing: Token<number>;
	borderRadius: Token<number>;
	textSize: Token<number>;
	colors: {
		primary: Color3Token;
		secondary: Color3Token;
		success: Color3Token;
		warning: Color3Token;
		destructive: Color3Token;
		info: Color3Token;
		white: Color3Token;
		black: Color3Token;
	};
	sounds: {
		[key: string]: RbxAssetId;
	};
	images: {
		[key: string]: RbxAssetId;
	};
	fonts: {
		sans: FontToken;
	};
	springs: Token<SpringOptions>;
};

const theme: Theme = {
	spacing: {
		DEFAULT: 8,
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
	},
	textSize: {
		DEFAULT: 18,
		xs: 10,
		sm: 14,
		md: 18,
		lg: 24,
	},
	borderRadius: {
		DEFAULT: 999,
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
	},
	colors: {
		primary: {
			DEFAULT: Color3.fromRGB(0, 0, 0),
			foreground: Color3.fromRGB(255, 255, 255),
			active: Color3.fromRGB(30, 30, 30),
		},
		secondary: {
			DEFAULT: Color3.fromRGB(100, 100, 100),
			foreground: Color3.fromRGB(200, 200, 200),
			active: Color3.fromRGB(120, 120, 120),
		},
		success: {
			DEFAULT: Color3.fromRGB(0, 128, 0),
			foreground: Color3.fromRGB(255, 255, 255),
			active: Color3.fromRGB(0, 150, 0),
		},
		warning: {
			DEFAULT: Color3.fromRGB(255, 165, 0),
			foreground: Color3.fromRGB(0, 0, 0),
			active: Color3.fromRGB(255, 180, 30),
		},
		destructive: {
			DEFAULT: Color3.fromRGB(255, 0, 0),
			foreground: Color3.fromRGB(255, 255, 255),
			active: Color3.fromRGB(200, 0, 0),
		},
		info: {
			DEFAULT: Color3.fromRGB(0, 0, 255),
			foreground: Color3.fromRGB(255, 255, 255),
			active: Color3.fromRGB(30, 30, 255),
		},

		white: {
			DEFAULT: Color3.fromRGB(255, 255, 255),
			foreground: Color3.fromRGB(0, 0, 0),
			active: Color3.fromRGB(200, 200, 200),
		},

		black: {
			DEFAULT: Color3.fromRGB(0, 0, 0),
			foreground: Color3.fromRGB(255, 255, 255),
			active: Color3.fromRGB(30, 30, 30),
		},
	},

	sounds: {
		click: 'rbxassetid://8755541422',
	},

	images: {
		logo: 'rbxassetid://8755541422',
		circle: 'rbxassetid://18416727845',
		stripe: 'rbxassetid://18490111133',
	},
	fonts: {
		sans: {
			Light: Font.fromName('BuilderSans', Enum.FontWeight.Light),
			Regular: Font.fromName('BuilderSans', Enum.FontWeight.Regular),
			SemiBold: Font.fromName('BuilderSans', Enum.FontWeight.SemiBold),
			Bold: Font.fromName('BuilderSans', Enum.FontWeight.Bold),
			Black: Font.fromName('BuilderSans', Enum.FontWeight.ExtraBold),
		},
	},
	springs: {
		DEFAULT: {
			frequency: 0.25,
		},
	},
};

export default theme;

export type ColorToken = keyof Theme['colors'];
