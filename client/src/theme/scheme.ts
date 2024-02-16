import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const COMMON_COLORS = {
	primary: '#3DA8F6',
	onPrimary: '#FFF',
	tertiary: '#FFD410',
	onTertiary: '#FFF',
	error: '#F53D2D',
	onError: '#FFF',
	outline: 'rgb(220,220,220)',
};

export const scheme = {
	light: {
		...MD3LightTheme,
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
		colors: {
			...MD3DarkTheme.colors,
			...COMMON_COLORS,
			background: '#312E2E',
			paper: '#242424',
			onSurface: '#FFF',
		},
	},
};
