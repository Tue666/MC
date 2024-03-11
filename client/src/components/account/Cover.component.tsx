import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { ConstantConfig } from '../../configs';
import { globalStyles } from '../../styles';

const { MAIN_LAYOUT } = ConstantConfig;

const Cover = () => {
	const theme = useTheme();

	return (
		<LinearGradient
			colors={[theme.colors.primary, theme.colors.primary, globalStyles.paper.backgroundColor]}
			style={[styles.container]}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		height: MAIN_LAYOUT.SCREENS.ACCOUNT.AVATAR.COVER_HEIGHT,
		borderTopLeftRadius: MAIN_LAYOUT.SCREENS.ACCOUNT.BORDER_RADIUS,
		borderTopRightRadius: MAIN_LAYOUT.SCREENS.ACCOUNT.BORDER_RADIUS,
	},
});

export default Cover;
