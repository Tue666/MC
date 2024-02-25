import { useLayoutEffect } from 'react';
import { useTheme } from 'react-native-paper';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ResourceConfig } from '../../../configs';
import { useGlobalStyles } from '../../../styles';
import { ConquerStackList, MainConquerStackProps } from '../../../types';

const { CONQUER_RENDERER } = ResourceConfig;

const { COMMON, RESOURCES } = CONQUER_RENDERER;
const { WAITING, PREPARE, STATISTIC } = COMMON;
const { DAU_NHANH } = RESOURCES;
const HIDDEN_TABS = [WAITING.name, PREPARE.name, STATISTIC.name, DAU_NHANH.name];

const Stack = createStackNavigator<ConquerStackList>();

const ConquerStack = (props: MainConquerStackProps) => {
	const { navigation, route } = props;
	const theme = useTheme();
	const globalStyles = useGlobalStyles();

	useLayoutEffect(() => {
		const routeName = getFocusedRouteNameFromRoute(route);
		if (!routeName) return;

		if (HIDDEN_TABS.indexOf(routeName as keyof ConquerStackList) !== -1) {
			navigation.setOptions({ tabBarStyle: { display: 'none' } });
		} else {
			navigation.setOptions({ tabBarStyle: { display: 'flex' } });
		}
	}, [navigation, route]);
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: {
					...globalStyles.paper,
				},
				headerTitleStyle: {
					...globalStyles.text,
					color: theme.colors.onSurface,
				},
				headerTintColor: theme.colors.onSurface,
				cardStyle: {
					backgroundColor: theme.colors.background,
				},
			}}
		>
			{Object.entries(COMMON).map(([screen, config]) => {
				const { name, options, onRender } = config;

				return (
					<Stack.Screen key={screen} name={name} options={{ ...options }}>
						{(props) => onRender(props)}
					</Stack.Screen>
				);
			})}
			{Object.entries(RESOURCES).map(([screen, config]) => {
				const { name, options, onRender } = config;

				return (
					<Stack.Screen key={screen} name={name} options={{ ...options }}>
						{(props) => onRender(props)}
					</Stack.Screen>
				);
			})}
		</Stack.Navigator>
	);
};

export default ConquerStack;
