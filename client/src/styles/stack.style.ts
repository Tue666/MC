import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';

const getStackStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		row: {
			flexDirection: 'row',
			alignItems: 'center',
		},
	});

const useStackStyles = () => {
	const theme = useTheme();
	const styles = useMemo(() => getStackStyles(theme), [theme.colors]);

	return styles;
};

export default useStackStyles;
