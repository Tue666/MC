import { useEffect } from 'react';
import { ProgressBar } from 'react-native-paper';
import { useTimer } from '../hooks';

export interface CountdownProgressProps {
	timer: number; // In second
	onExpired?: () => void;
}

const CountdownProgress = (props: CountdownProgressProps) => {
	const { timer, onExpired } = props;
	const { countdown, isExpired } = useTimer(timer);

	useEffect(() => {
		if (isExpired) onExpired && onExpired();
	}, [onExpired, isExpired]);

	if (isExpired) return null;

	return <ProgressBar progress={countdown / 10} />;
};

export default CountdownProgress;
