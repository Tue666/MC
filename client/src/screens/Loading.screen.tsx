import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Logo } from '../components';
import { ConstantConfig } from '../configs';
import { useGlobalStyles, useStackStyles, useTypographyStyles } from '../styles';

const { SPACE_GAP } = ConstantConfig;

const Loading = () => {
	const globalStyles = useGlobalStyles();
	const stackStyles = useStackStyles();
	const typographyStyles = useTypographyStyles();

	return (
		<View style={{ ...styles.container, ...globalStyles.paper, ...stackStyles.center }}>
			<Logo />
			<Text variant="headlineMedium" style={{ ...typographyStyles.highlight, ...styles.text }}>
				Conquer Math
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	text: {
		marginBottom: SPACE_GAP,
	},
});

export default Loading;
