import { useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { AccountStackList } from '../../../types';
import { Account } from '.';

const Stack = createStackNavigator<AccountStackList>();

const AccountStack = () => {
	const theme = useTheme();

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				cardStyle: [
					{
						backgroundColor: theme.colors.background,
					},
				],
			}}
		>
			<Stack.Screen name="Account">{(props) => <Account {...props} />}</Stack.Screen>
		</Stack.Navigator>
	);
};

export default AccountStack;
