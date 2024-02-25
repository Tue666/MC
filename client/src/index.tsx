import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { Dialog, Modal, Snackbar } from './components';
import { AuthenticationProvider } from './contexts/Authentication.context';
import { SettingProvider } from './contexts/Setting.context';
import { SocketClientProvider } from './contexts/SocketClient.context';
import { store } from './redux/store';
import { Main } from './screens';
import ThemeProvider from './theme';
import {
	DialogUtilConfiguration,
	ModalUtilConfiguration,
	SnackbarUtilConfiguration,
} from './utils';

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
								<SnackbarUtilConfiguration />
								<Snackbar />
								<ModalUtilConfiguration />
								<Modal />
							</NavigationContainer>
						</AuthenticationProvider>
					</ThemeProvider>
				</SettingProvider>
			</ReduxProvider>
		</SocketClientProvider>
	);
};

export default App;
