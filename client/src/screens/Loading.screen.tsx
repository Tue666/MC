import { StyleSheet, View } from 'react-native';
import useGlobalStyles from '../styles/global.style';
import { Logo } from '../components';
import { Text } from 'react-native-paper';
import useTypographyStyles from '../styles/typography.style';
import { SPACE_GAP } from '../configs/constant';

const Loading = () => {
	const globalStyles = useGlobalStyles();
	const typographyStyles = useTypographyStyles();

	return (
		<View style={{ ...styles.container, ...globalStyles.paper }}>
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
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		marginBottom: SPACE_GAP,
	},
});

export default Loading;
