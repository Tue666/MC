import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, useTheme } from 'react-native-paper';
import { ConstantConfig } from '../configs';
import { useSetting } from '../hooks';
import { globalStyles, stackStyles } from '../styles';

const { MAIN_LAYOUT } = ConstantConfig;

const MainHeader = () => {
	const theme = useTheme();
	const { themeMode, onChangeTheme } = useSetting();

	return (
		<View style={[styles.header, globalStyles.paper, globalStyles.shadow, stackStyles.row]}>
			<View style={[stackStyles.row]}>
				<Icon name="paid" size={MAIN_LAYOUT.HEADER.ICON_SIZE} color={theme.colors.tertiary} />
				<Text variant="labelSmall"> 0</Text>
			</View>
			<Icon
				name={themeMode === 'light' ? 'dark-mode' : 'light-mode'}
				size={MAIN_LAYOUT.HEADER.ICON_SIZE}
				color={theme.colors.tertiary}
				onPress={onChangeTheme}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		justifyContent: 'space-between',
		height: MAIN_LAYOUT.HEADER.HEIGHT,
		padding: MAIN_LAYOUT.HEADER.PADDING,
		marginBottom: MAIN_LAYOUT.HEADER.MARGIN_BOTTOM,
		borderRadius: MAIN_LAYOUT.HEADER.BORDER_RADIUS,
	},
});

export default MainHeader;
