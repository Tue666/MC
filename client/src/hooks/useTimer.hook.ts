import { useEffect, useState } from 'react';

const useTimer = (timer: number) => {
	const [countdown, setCountdown] = useState(timer);
	const isExpired = countdown <= 0;
	const days = Math.floor(countdown / (24 * 3600));
	const hours = Math.floor((countdown % (24 * 3600)) / 3600);
	const minutes = Math.floor((countdown % 3600) / 60);
	const seconds = countdown % 60;

	useEffect(() => {
		if (isExpired) return;

		const interval = setInterval(() => {
			setCountdown((prevCountdown) => prevCountdown - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [countdown]);

	return { countdown, isExpired, days, hours, minutes, seconds };
};

export default useTimer;
