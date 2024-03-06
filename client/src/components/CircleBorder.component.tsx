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
	const padding = useSharedValue(CIRCLE_BORDER.PADDING);
	const borderWidth = useSharedValue(CIRCLE_BORDER.BORDER_WIDTH);

	const animatedStyle = useAnimatedStyle(() => ({
		padding: padding.value,
		borderWidth: borderWidth.value,
	}));

	useEffect(() => {
		if (animated) {
			padding.value = withTiming(CIRCLE_BORDER.PADDING * 2);
			borderWidth.value = withTiming(2);
			return;
		}

		padding.value = withTiming(CIRCLE_BORDER.PADDING);
		borderWidth.value = withTiming(CIRCLE_BORDER.BORDER_WIDTH);
	}, [animated]);
	return (
		<View style={[styles.container, style]}>
			<Animated.View style={[styles.border, animatedStyle, { borderColor: theme.colors.primary }]}>
				{children}
			</Animated.View>
			{label && <Text style={[styles.label]}>{label}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// marginVertical: CIRCLE_BORDER.MARGIN_VERTICAL,
		alignItems: 'center',
	},
	border: {
		borderRadius: 99999,
	},
	label: {
		marginTop: 10,
		fontWeight: 'bold',
	},
});

export default CircleBorder;
