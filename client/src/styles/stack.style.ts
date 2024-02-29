import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';

const getStackStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		row: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		rowWrap: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'center',
		},
		center: {
			justifyContent: 'center',
			alignItems: 'center',
		},
	});

const useStackStyles = () => {
	const theme = useTheme();
	const styles = useMemo(() => getStackStyles(theme), [theme.colors]);

	return styles;
};

export let stackStyles: ReturnType<typeof useStackStyles>;
const StackStylesConfiguration = () => {
	stackStyles = useStackStyles();

	return null;
};

export default StackStylesConfiguration;
