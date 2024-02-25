import { Dimensions } from 'react-native';

export const SPACE_GAP = 8;

export const BUTTON = {
	ICON_SIZE: 20,
};

export const DIALOG = {
	ICON_SIZE: 35,
	SCROLL_CONTENT: {
		MAX_HEIGHT: '80%',
		PADDING: 10,
	},
};

export const MODAL = {
	WINNER: {
		WIDTH: Dimensions.get('window').width - 100,
		PADDING: 25,
		BORDER_RADIUS: 15,
		AVATAR: {
			ICON_SIZE: 130,
			MARGIN_VERTICAL: 10,
		},
	},
};

export const LOGO = {
	SIZE: 150,
};

export const BOX = {
	BORDER_RADIUS: 10,
};

export const SNACKBAR = {
	ICON_SIZE: 25,
};

export const CIRCLE_BORDER = {
	PADDING: 10,
	MARGIN_VERTICAL: 25,
	BORDER_WIDTH: 5,
};

export const COUNT_DOWN_TIMER = {
	PADDING_VERTICAL: 35,
	PADDING_HORIZONTAL: 10,
};

export const AUTHENTICATION_LAYOUT = {
	PADDING: 50,
	TEXT_INPUT: {
		ICON_SIZE: 20,
	},
};

export const MAIN_LAYOUT = {
	PADDING: 10,
	PADDING_BOTTOM: 80,
	HEADER: {
		HEIGHT: 50,
		PADDING: 10,
		MARGIN_BOTTOM: 10,
		BORDER_RADIUS: 5,
		ICON_SIZE: 25,
	},
	BOTTOM_BAR: {
		BOTTOM: 5,
		PADDING: 10,
		MARGIN_VERTICAL: 10,
		MARGIN_HORIZONTAL: 15,
		BORDER_RADIUS: 15,
		BUTTON: {
			PADDING: 5,
			ICON_SIZE: 30,
		},
	},
	SCREENS: {
		CONQUER: {
			RESOURCE: {
				MARGIN: 5,
				PADDING: 30,
				BORDER_RADIUS: 10,
			},
			QUESTION_BOX: {
				PADDING: 20,
				BORDER_RADIUS: 15,
				MARGIN_BOTTOM: 10,
			},
			ANSWER_BOX: {
				PADDING: 20,
				MARGIN: 4,
				BORDER_RADIUS: 15,
				NUMBER_IN_ROW: 2,
			},
			RAISE_HAND: {
				ICON_SIZE: 100,
			},
			WAITING: {
				AVATAR: {
					ICON_SIZE: 250,
				},
			},
		},
	},
};

export const VIBRATIONS = {
	0: 200,
	1: 1000,
	2: 2000,
	3: 3000,
	4: 4000,
	5: 5000,
	6: 6000,
	7: 7000,
	8: 8000,
	9: 9000,
	10: 10000,
};
