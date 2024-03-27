import LottieView from 'lottie-react-native';
import { globalStyles, stackStyles } from '../styles';

const Loading = () => {
	return (
		<LottieView
			source={require('../assets/animations/lottie/loading.json')}
			autoPlay
			loop
			style={[globalStyles.container, stackStyles.center]}
		/>
	);
};

export default Loading;
