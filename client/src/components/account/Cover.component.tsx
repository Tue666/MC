import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { globalStyles } from '../../styles';

const Cover = () => {
	const theme = useTheme();

	return (
		<LinearGradient
			colors={[theme.colors.primary, theme.colors.primary, globalStyles.paper.backgroundColor]}
			style={[styles.container]}
		></LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 200,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
});

export default Cover;
