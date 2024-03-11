import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { ConstantConfig } from '../../configs';
import { IAccount } from '../../types';
import { Avatar, CircleBorder } from '..';

const { CIRCLE_BORDER, MAIN_LAYOUT } = ConstantConfig;

interface SingleWaitingProps {
	avatar?: IAccount.Account['avatar'];
	animated?: boolean;
	duration?: number;
	onComplete?: () => any;
}

const SingleWaiting = (props: SingleWaitingProps) => {
	const { avatar, animated = false, duration = 0, onComplete } = props;
	const theme = useTheme();

	return (
		<CircleBorder animated={animated} style={[styles.container]}>
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
					CIRCLE_BORDER.PADDING * 2 +
					(animated ? CIRCLE_BORDER.BORDER_WIDTH * 2 : 0)
				}
				onComplete={() => onComplete && onComplete()}
			>
				{() => <Avatar hiddenBorder={true} avatar={avatar} />}
			</CountdownCircleTimer>
		</CircleBorder>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: CIRCLE_BORDER.MARGIN_VERTICAL,
	},
});

export default memo(SingleWaiting);
