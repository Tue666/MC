import { useEffect, useState } from 'react';
import { NumberUtil, TimeSelect } from '../utils';

const useTimer = (timer: number, select?: TimeSelect[]) => {
	const [countdown, setCountdown] = useState(timer);
	const isExpired = countdown <= 0;
	const time = NumberUtil.toTime(countdown, select);

	useEffect(() => {
		if (isExpired) return;

		const interval = setInterval(() => {
			setCountdown((prevCountdown) => prevCountdown - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [countdown]);

	return { countdown, isExpired, ...time };
};

export default useTimer;
