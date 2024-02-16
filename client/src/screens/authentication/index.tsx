import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticationLayout } from '../../layouts';
import { RootStackParamList } from '../../types';
import useGlobalStyles from '../../styles/global.style';
import SignIn from '../authentication/SignIn.screen';
import SignUp from '../authentication/SignUp.screen';
import Start from '../authentication/Start.screen';
import { useTheme } from 'react-native-paper';

const Stack = createStackNavigator<RootStackParamList>();

const AuthenticationStacks = () => {
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

export default AuthenticationStacks;
