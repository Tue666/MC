import { useEffect } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ConstantConfig } from '../configs';

const { CIRCLE_BORDER } = ConstantConfig;

export interface CircleBorderProps extends ViewProps {
	animated?: boolean;
}

const CircleBorder = (props: CircleBorderProps) => {
	const { animated, children, style, ...rest } = props;
	const theme = useTheme();
	const padding = useSharedValue(CIRCLE_BORDER.PADDING);
	const borderWidth = useSharedValue(CIRCLE_BORDER.BORDER_WIDTH);

	const animatedStyle = useAnimatedStyle(() => ({
		padding: padding.value,
		borderWidth: borderWidth.value,
	}));

	useEffect(() => {
		if (animated) {
			padding.value = withTiming(CIRCLE_BORDER.PADDING * 4);
			borderWidth.value = withTiming(2);
			return;
		}

		padding.value = withTiming(CIRCLE_BORDER.PADDING);
		borderWidth.value = withTiming(CIRCLE_BORDER.BORDER_WIDTH);
	}, [animated]);
	return (
		<Animated.View
			style={[styles.border, animatedStyle, { borderColor: theme.colors.primary }, style]}
			{...rest}
		>
			{children}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	border: {
		borderRadius: 99999,
	},
});

export default CircleBorder;
