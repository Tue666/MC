import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import { scheme } from '../theme/scheme';

const getGlobalStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		bg: {
			backgroundColor: theme.colors.background,
		},
		paper: {
			backgroundColor: theme.dark ? scheme.dark.colors.paper : scheme.light.colors.paper,
		},
		shadow: {
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.2,
			shadowRadius: 1.41,
			elevation: 2,
		},
		fw: {
			width: '100%',
		},
	});

const useGlobalStyles = () => {
	const theme = useTheme();
	const styles = useMemo(() => getGlobalStyles(theme), [theme.colors]);

	return styles;
};

export default useGlobalStyles;
