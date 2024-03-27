export type TimeSelect = 'D' | 'H' | 'M';

export interface Time {
	days?: {
		value: number;
		text: string;
	};
	hours?: {
		value: number;
		text: string;
	};
	minutes?: {
		value: number;
		text: string;
	};
	seconds: {
		value: number;
		text: string;
	};
}

class NumberUtil {
	static toTextTime(value: number) {
		const textValue = value >= 10 ? value.toString() : `0${value}`;

		return {
			value,
			text: textValue,
		};
	}

	static toTime(ms: number, select: TimeSelect[] = ['D', 'H', 'M']) {
		const s = Math.floor(ms / 1000);
		const days = Math.floor(s / (24 * 3600));
		const hours = Math.floor((s % (24 * 3600)) / 3600);
		const minutes = Math.floor((s % 3600) / 60);
		const seconds = s % 60;

		const time: Time = {
			seconds: NumberUtil.toTextTime(seconds),
		};
		if (select.indexOf('D') !== -1) time['days'] = NumberUtil.toTextTime(days);
		if (select.indexOf('H') !== -1) time['hours'] = NumberUtil.toTextTime(hours);
		if (select.indexOf('M') !== -1) time['minutes'] = NumberUtil.toTextTime(minutes);

		return time;
	}
}

export default NumberUtil;
