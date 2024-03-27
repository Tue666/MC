import { Fragment, useEffect } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { MD3TypescaleKey, Text } from 'react-native-paper';
import { ConstantConfig } from '../configs';
import { useTimer } from '../hooks';
import { stackStyles } from '../styles';
import { TimeSelect } from '../utils';

const { COUNT_DOWN_TIMER } = ConstantConfig;

export interface CountdownTimerProps extends ViewProps {
	timer: number;
	select: TimeSelect[];
	timerVariant?: MD3TypescaleKey;
	onExpired?: () => void;
}

const CountdownTimer = (props: CountdownTimerProps) => {
	const { timer, select, timerVariant = 'headlineSmall', onExpired, ...rest } = props;
	const { isExpired, days, hours, minutes, seconds } = useTimer(timer, select);

	useEffect(() => {
		if (isExpired) onExpired && onExpired();
	}, [onExpired, isExpired]);

	if (isExpired) return null;

	return (
		<View style={[stackStyles.row]} {...rest}>
			{days && (
				<Fragment>
					<View style={[styles.timer]}>
						<Text variant={timerVariant}>{days.text}</Text>
					</View>
					<Text variant={timerVariant}>:</Text>
				</Fragment>
			)}
			{hours && (
				<Fragment>
					<View style={[styles.timer]}>
						<Text variant={timerVariant}>{hours.text}</Text>
					</View>
					<Text variant={timerVariant}>:</Text>
				</Fragment>
			)}
			{minutes && (
				<Fragment>
					<View style={[styles.timer]}>
						<Text variant={timerVariant}>{minutes.text}</Text>
					</View>
					<Text variant={timerVariant}>:</Text>
				</Fragment>
			)}
			<View style={[styles.timer]}>
				<Text variant={timerVariant}>{seconds.text}</Text>
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
