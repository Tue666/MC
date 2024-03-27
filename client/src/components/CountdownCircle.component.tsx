import { memo } from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { ConstantConfig } from '../configs';

const { CIRCLE_BORDER } = ConstantConfig;

interface CountdownCircleProps extends ViewProps {
	playing?: boolean;
	duration?: number;
	initialRemainingTime?: number;
	size?: number;
	strokeWidth?: number;
	onComplete?: () => any;
}

const CountdownCircle = (props: CountdownCircleProps) => {
	const {
		playing = false,
		duration = 0,
		initialRemainingTime,
		size,
		strokeWidth,
		onComplete,
		children,
		...rest
	} = props;
	const theme = useTheme();

	return (
		<View {...rest}>
			<CountdownCircleTimer
				key={`${playing}`}
				isPlaying={playing}
				duration={duration}
				initialRemainingTime={initialRemainingTime}
				colors={
					[theme.colors.background, theme.colors.primary, theme.colors.primary, theme.colors.error] as any
				}
				colorsTime={[duration, duration, duration / 3, 0]}
				strokeWidth={strokeWidth || CIRCLE_BORDER.BORDER_WIDTH}
				size={size && size + CIRCLE_BORDER.PADDING * 2 + (strokeWidth || CIRCLE_BORDER.BORDER_WIDTH) * 2}
				onComplete={() => onComplete && onComplete()}
			>
				{() => children}
			</CountdownCircleTimer>
		</View>
	);
};

export default memo(CountdownCircle);
