import useAuthentication from '../hooks/useAuthentication.hook';
import Loading from './Loading.screen';
import AuthenticationStacks from './authentication';
import MainTabs from './main';

const Main = () => {
	const { isInitialized, isAuthenticated } = useAuthentication();

	if (!isInitialized) {
		return <Loading />;
	}

	if (isInitialized && !isAuthenticated) {
		return <AuthenticationStacks />;
	}

	return <MainTabs />;
};

export default Main;
