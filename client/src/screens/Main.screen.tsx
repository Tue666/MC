import { useAuthentication } from '../hooks';
import { AuthenticationStack } from './authentication';
import { MainTab } from './main';
import { Loading } from '.';

const Main = () => {
	const { isInitialized, isAuthenticated } = useAuthentication();

	if (!isInitialized) {
		return <Loading />;
	}

	if (isInitialized && !isAuthenticated) {
		return <AuthenticationStack />;
	}

	return <MainTab />;
};

export default Main;
