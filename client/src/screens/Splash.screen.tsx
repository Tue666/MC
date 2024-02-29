import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { stackStyles, typographyStyles } from '../styles';

const Splash = () => {
	const theme = useTheme();

	return (
		<View style={[styles.container, stackStyles.center, { backgroundColor: theme.colors.primary }]}>
			<Text
				variant="headlineMedium"
				style={[typographyStyles.highlight, { color: theme.colors.onPrimary }]}
			>
				Conquer Math
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default Splash;
