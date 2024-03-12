import { ReactNode, useEffect } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ConstantConfig } from '../configs';
import { stackStyles, typographyStyles } from '../styles';

const { CIRCLE_BORDER } = ConstantConfig;

export interface CircleBorderProps extends ViewProps {
	label?: string;
	animated?: boolean;
	numberOfLines?: number;
	innerStyle?: ViewProps['style'];
}

const CircleBorder = (props: CircleBorderProps) => {
	const {
		children,
		style,
		label,
		animated = false,
		numberOfLines = 2,
		innerStyle = {},
		...rest
	} = props;
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
		<View style={[stackStyles.center, style]} {...rest}>
			<Animated.View
				style={[
					styles.border,
					styles.inner,
					animatedStyle,
					{ borderColor: theme.colors.primary },
					innerStyle,
				]}
			>
				{children}
			</Animated.View>
			{label && (
				<Text numberOfLines={numberOfLines} style={[styles.text, typographyStyles.center]}>
					{label}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	border: {
		borderRadius: 99999,
	},
	inner: {
		marginVertical: CIRCLE_BORDER.MARGIN,
	},
	text: {
		fontWeight: 'bold',
	},
});

export default CircleBorder;
