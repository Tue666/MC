import { PropsWithChildren, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { ConstantConfig, ResourceConfig } from '../configs';
import { globalStyles } from '../styles';
import { MainLayoutProps as IMainLayoutProps } from '../types';
import { MainHeader } from '../components';

const { MAIN_LAYOUT } = ConstantConfig;
const { CONQUER_RENDERER } = ResourceConfig;

const { COMMON, RESOURCES } = CONQUER_RENDERER;
const { WAITING, FIND_ROOM, FORMING, PREPARE, LOADING_QUESTION, STATISTIC } = COMMON;
const { DAU_NHANH } = RESOURCES;

const HIDDEN_HEADER: string[] = ['Account', 'Setting'];

const HIDDEN_BAR_TABS: string[] = [
	WAITING.name,
	FIND_ROOM.name,
	FORMING.name,
	PREPARE.name,
	LOADING_QUESTION.name,
	STATISTIC.name,
	DAU_NHANH.name,
];

export type MainLayoutProps = PropsWithChildren &
	Partial<IMainLayoutProps> & {
		hiddenHeader?: boolean;
	};

const MainLayout = (props: MainLayoutProps) => {
	const { children, navigation, route, hiddenHeader = false } = props;
	const [isHiddenHeader, setIsHiddenHeader] = useState(hiddenHeader);
	const [isHiddenBar, setIsHiddenBar] = useState(false);

	useLayoutEffect(() => {
		const routeName = route && getFocusedRouteNameFromRoute(route);
		if (!routeName || !navigation) return;

		const hiddenHeader = HIDDEN_HEADER.indexOf(routeName) !== -1;
		const hiddenBar = HIDDEN_BAR_TABS.indexOf(routeName) !== -1;

		setIsHiddenHeader(hiddenHeader);
		setIsHiddenBar(hiddenBar);
		navigation.setOptions({ tabBarStyle: { display: hiddenBar ? 'none' : 'flex' } });
	}, [navigation, route]);
	return (
		<View
			style={[
				styles.container,
				globalStyles.container,
				globalStyles.bg,
				{ paddingBottom: isHiddenBar ? 0 : MAIN_LAYOUT.PADDING_BOTTOM },
			]}
		>
			{!isHiddenHeader && <MainHeader />}
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: MAIN_LAYOUT.PADDING,
	},
});

export default MainLayout;
