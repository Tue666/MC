import { memo } from 'react';
import { Avatar, useTheme } from 'react-native-paper';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { ConstantConfig } from '../../configs';
import { CircleBorder } from '..';

const { CIRCLE_BORDER, MAIN_LAYOUT } = ConstantConfig;

interface SingleWaitingProps {
	animated?: boolean;
	duration?: number;
	onComplete?: () => any;
}

const SingleWaiting = (props: SingleWaitingProps) => {
	const { animated = false, duration = 0, onComplete } = props;
	const theme = useTheme();

	return (
		<CircleBorder animated={animated}>
			<CountdownCircleTimer
				key={`${animated}`}
				isPlaying={animated}
				duration={duration}
				colors={
					[theme.colors.background, theme.colors.primary, theme.colors.primary, theme.colors.error] as any
				}
				colorsTime={[duration, duration, duration / 3, 0]}
				strokeWidth={CIRCLE_BORDER.BORDER_WIDTH}
				size={
					MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE +
					CIRCLE_BORDER.PADDING +
					CIRCLE_BORDER.BORDER_WIDTH
				}
				onComplete={() => onComplete && onComplete()}
			>
				{() => (
					<Avatar.Image
						size={MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE}
						source={require('../../assets/images/avatar.png')}
					/>
				)}
			</CountdownCircleTimer>
		</CircleBorder>
	);
};

export default memo(SingleWaiting);
