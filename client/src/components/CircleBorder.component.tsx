import { StyleSheet, View, ViewProps } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ConstantConfig } from '../configs';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const { CIRCLE_BORDER } = ConstantConfig;

export interface CircleBorderProps extends ViewProps {
	label?: string;
	animated?: boolean;
}

const CircleBorder = (props: CircleBorderProps) => {
	const { children, style, label, animated = false } = props;
	const theme = useTheme();
	const borderWidth = useSharedValue(CIRCLE_BORDER.BORDER_WIDTH);
	const elevation = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => ({
		borderWidth: borderWidth.value,
		elevation: elevation.value,
	}));

	useEffect(() => {
		if (animated) {
			borderWidth.value = withTiming(CIRCLE_BORDER.BORDER_WIDTH + 1);
			elevation.value = withRepeat(
				withSequence(
					withTiming(Math.floor(Math.random() * (5 - 1 + 1)) + 1, { duration: 2000 }),
					withTiming(Math.floor(Math.random() * (50 - 25 + 1)) + 25, { duration: 3000 }),
					withTiming(Math.floor(Math.random() * (100 - 50 + 1)) + 50, { duration: 2000 }),
					withTiming(Math.floor(Math.random() * (20 - 10 + 1)) + 10, { duration: 1000 }),
					withTiming(Math.floor(Math.random() * (70 - 20 + 1)) + 20, { duration: 2000 }),
					withTiming(Math.floor(Math.random() * (5 - 1 + 1)) + 1, { duration: 4000 })
				),
				-1
			);
			return;
		}

		borderWidth.value = withTiming(CIRCLE_BORDER.BORDER_WIDTH);
		elevation.value = withTiming(0, { duration: 2000 });
	}, [animated]);
	return (
		<View style={[styles.container, style]}>
			<Animated.View style={[styles.border, { borderColor: theme.colors.primary }, animatedStyle]}>
				{children}
			</Animated.View>
			{label && <Text style={[styles.label]}>{label}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: CIRCLE_BORDER.MARGIN_VERTICAL,
		alignItems: 'center',
	},
	border: {
		borderRadius: 99999,
		padding: CIRCLE_BORDER.PADDING,
		shadowColor: '#35ADD4',
	},
	label: {
		marginTop: 10,
		fontWeight: 'bold',
	},
});

export default CircleBorder;
