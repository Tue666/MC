import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ConstantConfig } from '../configs';
import { globalStyles, stackStyles, typographyStyles } from '../styles';

const { APP_NAME } = ConstantConfig;

const Splash = () => {
	const theme = useTheme();

	return (
		<View
			style={[globalStyles.container, stackStyles.center, { backgroundColor: theme.colors.primary }]}
		>
			<Text
				variant="headlineMedium"
				style={[typographyStyles.highlight, { color: theme.colors.onPrimary }]}
			>
				{APP_NAME}
			</Text>
		</View>
	);
};

export default Splash;
