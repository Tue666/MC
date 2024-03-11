import { useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { globalStyles } from '../../../styles';
import { AccountStackList } from '../../../types';
import { Account, Setting } from '.';

const Stack = createStackNavigator<AccountStackList>();

const AccountStack = () => {
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
			<Stack.Screen name="Account" options={{ headerShown: false }}>
				{(props) => <Account {...props} />}
			</Stack.Screen>
			<Stack.Screen name="Setting" options={{ title: 'Cài đặt' }}>
				{(props) => <Setting {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default AccountStack;
