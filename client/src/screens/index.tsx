import useAuthentication from '../hooks/useAuthentication.hook';
import Loading from './Loading.screen';
import AuthenticationStack from './authentication';
import MainTab from './main';

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
