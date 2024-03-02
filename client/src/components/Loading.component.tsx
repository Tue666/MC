import { useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles, stackStyles } from '../styles';

const Loading = () => {
	const theme = useTheme();
	const marginBottom = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => ({
		marginBottom: marginBottom.value,
	}));

	useEffect(() => {
		marginBottom.value = withRepeat(withSequence(withTiming(30), withTiming(0)), -1);
	}, []);
	return (
		<View style={[globalStyles.container, stackStyles.center]}>
			<Animated.View style={[animatedStyle]}>
				<Icon name="hourglass-bottom" size={60} color={theme.colors.primary} />
			</Animated.View>
		</View>
	);
};

export default Loading;
