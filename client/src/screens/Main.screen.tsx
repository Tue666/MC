import { useAuthentication } from '../hooks';
import { AuthenticationStack } from './authentication';
import { MainTab } from './main';
import { Splash } from '.';

const Main = () => {
	const { isInitialized, isAuthenticated } = useAuthentication();

	if (!isInitialized) {
		return <Splash />;
	}

	if (isInitialized && !isAuthenticated) {
		return <AuthenticationStack />;
	}

	return <MainTab />;
};

export default Main;
