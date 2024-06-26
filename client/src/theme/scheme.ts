import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { fontConfig } from './font';

const COMMON_CONFIG = {
	fonts: configureFonts({ config: fontConfig }),
};

const COMMON_COLORS = {
	// Main color
	primary: '#3DA8F6',
	onPrimary: '#FFF',

	// Success color
	secondary: '#00AB55',
	onSecondary: '#FFF',

	// Warning color
	tertiary: '#FFD410',
	onTertiary: '#FFF',

	// Error color
	error: '#F53D2D',
	onError: '#FFF',

	outline: 'rgb(220,220,220)',
};

export const scheme = {
	light: {
		...MD3LightTheme,
		...COMMON_CONFIG,
		colors: {
			...MD3LightTheme.colors,
			...COMMON_COLORS,
			background: '#F4F4F4',
			paper: '#FFF',
			onSurface: '#000000',
		},
	},
	dark: {
		...MD3DarkTheme,
		...COMMON_CONFIG,
		colors: {
			...MD3DarkTheme.colors,
			...COMMON_COLORS,
			background: '#312E2E',
			paper: '#242424',
			onSurface: '#FFF',
		},
	},
};
