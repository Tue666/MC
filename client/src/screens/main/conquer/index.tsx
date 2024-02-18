import { useTheme } from 'react-native-paper';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ConquerStackList, MainConquerStackProps } from '../../../types';
import { CONQUER_RENDERER } from './renderer';
import { useLayoutEffect } from 'react';
import useGlobalStyles from '../../../styles/global.style';

const Stack = createStackNavigator<ConquerStackList>();
const { main, waiting, NHANH_TAY_LE_MAT } = CONQUER_RENDERER;
const HIDDEN_TABS = [waiting.name, NHANH_TAY_LE_MAT.name];

const ConquerStack = ({ navigation, route }: MainConquerStackProps) => {
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
					color: theme.colors.onSurface,
				},
				headerTintColor: theme.colors.onSurface,
				cardStyle: {
					backgroundColor: theme.colors.background,
				},
			}}
		>
			<Stack.Screen name={main.name} options={{ ...main.options }}>
				{(props) => main.onRender(props)}
			</Stack.Screen>
			<Stack.Screen name={waiting.name} options={{ ...waiting.options }}>
				{(props) => waiting.onRender(props)}
			</Stack.Screen>
			<Stack.Screen name={NHANH_TAY_LE_MAT.name} options={{ ...NHANH_TAY_LE_MAT.options }}>
				{(props) => NHANH_TAY_LE_MAT.onRender(props)}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default ConquerStack;
