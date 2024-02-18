import 'react-native-gesture-handler';
import { SocketClientProvider } from './contexts/SocketClient.context';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import ThemeProvider from './theme';
import { SettingProvider } from './contexts/Setting.context';
import { AuthenticationProvider } from './contexts/Authentication.context';
import Main from './screens';
import { store } from './redux/store';
import { Dialog } from './components/overrides';
import DialogUtilConfiguration from './utils/dialog.util';

const App = () => {
	return (
		<SocketClientProvider>
			<ReduxProvider store={store}>
				<SettingProvider>
					<ThemeProvider>
						<AuthenticationProvider>
							<NavigationContainer>
								<Main />
								<DialogUtilConfiguration />
								<Dialog />
							</NavigationContainer>
						</AuthenticationProvider>
					</ThemeProvider>
				</SettingProvider>
			</ReduxProvider>
		</SocketClientProvider>
	);
};

export default App;
