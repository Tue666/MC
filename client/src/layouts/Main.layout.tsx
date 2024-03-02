import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig, ResourceConfig } from '../configs';
import { useSetting } from '../hooks';
import { globalStyles, stackStyles } from '../styles';
import { MainLayoutProps } from '../types';

const { MAIN_LAYOUT } = ConstantConfig;
const { CONQUER_RENDERER } = ResourceConfig;

const { COMMON, RESOURCES } = CONQUER_RENDERER;
const { WAITING } = COMMON;
const { DAU_NHANH } = RESOURCES;
const HIDDEN_BAR_TABS: string[] = [WAITING.name, DAU_NHANH.name];

const MainLayout = (props: PropsWithChildren & Partial<MainLayoutProps>) => {
	const { children, route } = props;
	const routeName = route && getFocusedRouteNameFromRoute(route);
	const isHiddenBar = routeName && HIDDEN_BAR_TABS.indexOf(routeName) !== -1;
	const theme = useTheme();
	const { themeMode, onChangeTheme } = useSetting();

	return (
		<View
			style={[
				styles.container,
				globalStyles.container,
				globalStyles.bg,
				{ paddingBottom: isHiddenBar ? 0 : MAIN_LAYOUT.PADDING_BOTTOM },
			]}
		>
			<View style={[styles.header, globalStyles.paper, globalStyles.shadow, stackStyles.row]}>
				<View style={[stackStyles.row]}>
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
		padding: MAIN_LAYOUT.PADDING,
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
