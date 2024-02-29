import { Fragment, useEffect } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { MD3TypescaleKey, Text } from 'react-native-paper';
import { ConstantConfig } from '../configs';
import { useTimer } from '../hooks';
import { stackStyles } from '../styles';

const { COUNT_DOWN_TIMER } = ConstantConfig;

export type Timer = 'D' | 'H' | 'M';

export interface CountdownTimerProps extends ViewProps {
	timer: number; // In second
	timerSelected: Timer[];
	timerVariant?: MD3TypescaleKey;
	onExpired?: () => void;
}

const CountdownTimer = (props: CountdownTimerProps) => {
	const {
		timer,
		timerSelected = ['D', 'H', 'M'],
		timerVariant = 'headlineSmall',
		onExpired,
		...rest
	} = props;
	const { isExpired, days, hours, minutes, seconds } = useTimer(timer);

	useEffect(() => {
		if (isExpired) onExpired && onExpired();
	}, [onExpired, isExpired]);

	if (isExpired) return null;

	return (
		<View style={[stackStyles.row]} {...rest}>
			{timerSelected.includes('D') && (
				<Fragment>
					<View style={[styles.timer]}>
						<Text variant={timerVariant}>{days < 10 ? `0${days}` : days}</Text>
					</View>
					<Text variant={timerVariant}>:</Text>
				</Fragment>
			)}
			{timerSelected.includes('H') && (
				<Fragment>
					<View style={[styles.timer]}>
						<Text variant={timerVariant}>{hours < 10 ? `0${hours}` : hours}</Text>
					</View>
					<Text variant={timerVariant}>:</Text>
				</Fragment>
			)}
			{timerSelected.includes('M') && (
				<Fragment>
					<View style={[styles.timer]}>
						<Text variant={timerVariant}>{minutes < 10 ? `0${minutes}` : minutes}</Text>
					</View>
					<Text variant={timerVariant}>:</Text>
				</Fragment>
			)}
			<View style={[styles.timer]}>
				<Text variant={timerVariant}>{seconds < 10 ? `0${seconds}` : seconds}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	timer: {
		paddingHorizontal: COUNT_DOWN_TIMER.PADDING_HORIZONTAL,
		paddingVertical: COUNT_DOWN_TIMER.PADDING_VERTICAL,
	},
});

export default CountdownTimer;
