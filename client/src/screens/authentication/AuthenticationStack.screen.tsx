import { useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticationLayout } from '../../layouts';
import { useGlobalStyles } from '../../styles';
import { AuthenticationStackList } from '../../types';
import { SignIn, SignUp, Start } from '.';

const Stack = createStackNavigator<AuthenticationStackList>();

const AuthenticationStack = () => {
	const theme = useTheme();
	const globalStyles = useGlobalStyles();

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
			}}
		>
			<Stack.Screen name="Start" options={{ headerShown: false }}>
				{(props) => (
					<AuthenticationLayout>
						<Start {...props} />
					</AuthenticationLayout>
				)}
			</Stack.Screen>
			<Stack.Screen name="SignIn" options={{ title: 'Đăng nhập' }}>
				{(props) => (
					<AuthenticationLayout>
						<SignIn {...props} />
					</AuthenticationLayout>
				)}
			</Stack.Screen>
			<Stack.Screen name="SignUp" options={{ title: 'Đăng ký' }}>
				{(props) => (
					<AuthenticationLayout>
						<SignUp {...props} />
					</AuthenticationLayout>
				)}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default AuthenticationStack;
