import { MD3Theme } from 'react-native-paper';

export const RESOURCE_DIFFICULTIES = (theme: MD3Theme) => ({
	easy: {
		label: 'Dễ',
		bgColor: theme.colors.primary,
		textColor: theme.colors.onPrimary,
		range: [0, 1],
	},
	middle: {
		label: undefined,
		bgColor: undefined,
		textColor: undefined,
		range: [2, 6],
	},
	hard: {
		label: undefined,
		bgColor: undefined,
		textColor: undefined,
		range: [7, 9],
	},
	nightmare: {
		label: 'Cực Khó',
		bgColor: theme.colors.error,
		textColor: theme.colors.onError,
		range: [10, 999999999],
	},
});

export const getDifficultLevel = (
	difficulty: number,
	resourceDifficulty: ReturnType<typeof RESOURCE_DIFFICULTIES>
) => {
	for (const [key, value] of Object.entries(resourceDifficulty)) {
		const [min, max] = value.range;
		if (difficulty >= min && difficulty <= max) return key;
	}

	return Object.keys(resourceDifficulty)[0];
};
