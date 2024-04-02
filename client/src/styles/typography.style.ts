import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';

const getTypographyStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		highlight: {
			color: theme.colors.primary,
			fontWeight: 'bold',
		},
		bold: {
			fontWeight: 'bold',
		},
		italic: {
			fontStyle: 'italic',
		},
		center: {
			textAlign: 'center',
		},
	});

const useTypographyStyles = () => {
	const theme = useTheme();
	const styles = useMemo(() => getTypographyStyles(theme), [theme.colors]);

	return styles;
};

export let typographyStyles: ReturnType<typeof useTypographyStyles>;
const TypographyStylesConfiguration = () => {
	typographyStyles = useTypographyStyles();

	return null;
};

export default TypographyStylesConfiguration;
