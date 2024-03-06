import { useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { ResourceConfig } from '../../../configs';
import { globalStyles } from '../../../styles';
import { ConquerStackList } from '../../../types';

const { CONQUER_RENDERER } = ResourceConfig;

const { COMMON, RESOURCES } = CONQUER_RENDERER;

const Stack = createStackNavigator<ConquerStackList>();

const ConquerStack = () => {
	const theme = useTheme();

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: [globalStyles.paper],
				headerTitleStyle: [globalStyles.text, { color: theme.colors.onSurface }],
				headerTintColor: theme.colors.onSurface,
				cardStyle: [
					{
						backgroundColor: theme.colors.background,
					},
				],
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
