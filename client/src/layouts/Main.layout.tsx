import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useSetting from '../hooks/useSetting.hook';
import useGlobalStyles from '../styles/global.style';
import useStackStyles from '../styles/stack.style';
import { MAIN_LAYOUT } from '../configs/constant';

const MainLayout = (props: PropsWithChildren) => {
	const { children } = props;
	const theme = useTheme();
	const { themeMode, onChangeTheme } = useSetting();
	const globalStyles = useGlobalStyles();
	const stackStyles = useStackStyles();

	return (
		<View style={{ ...styles.container, ...globalStyles.bg }}>
			<View
				style={{ ...styles.header, ...globalStyles.paper, ...globalStyles.shadow, ...stackStyles.row }}
			>
				<View style={{ ...stackStyles.row }}>
					<Icon name="paid" size={MAIN_LAYOUT.HEADER.ICON_SIZE} color={theme.colors.tertiary} />
					<Text variant="labelSmall"> 999.999.999</Text>
				</View>
				<Icon
					name={themeMode === 'light' ? 'dark-mode' : 'light-mode'}
					size={MAIN_LAYOUT.HEADER.ICON_SIZE}
					color={theme.colors.tertiary}
					onPress={onChangeTheme}
				/>
			</View>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: MAIN_LAYOUT.PADDING,
		paddingBottom: MAIN_LAYOUT.PADDING_BOTTOM,
	},
	header: {
		justifyContent: 'space-between',
		height: MAIN_LAYOUT.HEADER.HEIGHT,
		padding: MAIN_LAYOUT.HEADER.PADDING,
		marginBottom: MAIN_LAYOUT.HEADER.MARGIN_BOTTOM,
		borderRadius: MAIN_LAYOUT.HEADER.BORDER_RADIUS,
	},
});

export default MainLayout;
