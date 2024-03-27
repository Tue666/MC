import { StackNavigationOptions } from '@react-navigation/stack';
import { PreventHardwareBackGuard } from '../../guards';
import {
	Conquer,
	FindRoom,
	Forming,
	LoadingQuestion,
	Preparing,
	Statistic,
	Waiting,
} from '../../screens/main/conquer';
import { QuickMatch } from '../../screens/main/conquer/quick-match';
import {
	ConquerQuickMatchProps,
	ConquerIdleMode,
	ConquerPreparingProps,
	ConquerProps,
	ConquerStackListKey,
	ConquerStatisticProps,
	ConquerWaitingProps,
	ConquerLoadingQuestionProps,
	ConquerFormingProps,
	ConquerFindRoomProps,
} from '../../types';
import { FindRoomHeader } from '../../components';

export type ConquerRenderer = {
	COMMON: {
		[key in string]: {
			name: ConquerStackListKey; // Name of screen in stack
			options?:
				| StackNavigationOptions
				| ((props: { route: any; navigation: any }) => StackNavigationOptions); // Options for screen in stack
			onRender: any; // How screen render
		};
	};
	RESOURCES: {
		[key in string]: {
			name: ConquerStackListKey; // Name of screen in stack
			options?:
				| StackNavigationOptions
				| ((props: { route: any; navigation: any }) => StackNavigationOptions); // Options for screen in stack
			idleMode: ConquerIdleMode;
			onRender: any; // How screen render
		};
	};
};

export const CONQUER_RENDERER: ConquerRenderer = {
	COMMON: {
		MAIN: {
			name: 'Conquer',
			options: {
				headerShown: false,
			},
			onRender: (props: ConquerProps) => <Conquer {...props} />,
		},
		WAITING: {
			name: 'Waiting',
			options: {
				title: 'Phòng chờ',
			},
			onRender: (props: ConquerWaitingProps) => <Waiting {...props} />,
		},
		FIND_ROOM: {
			name: 'FindRoom',
			options: (props) => ({
				headerTitle: () => <FindRoomHeader {...props} />,
			}),
			onRender: (props: ConquerFindRoomProps) => <FindRoom {...props} />,
		},
		FORMING: {
			name: 'Forming',
			options: {
				headerShown: false,
			},
			onRender: (props: ConquerFormingProps) => (
				<PreventHardwareBackGuard>
					<Forming {...props} />
				</PreventHardwareBackGuard>
			),
		},
		PREPARE: {
			name: 'Preparing',
			options: {
				headerShown: false,
			},
			onRender: (props: ConquerPreparingProps) => (
				<PreventHardwareBackGuard>
					<Preparing {...props} />
				</PreventHardwareBackGuard>
			),
		},
		LOADING_QUESTION: {
			name: 'LoadingQuestion',
			options: {
				headerShown: false,
			},
			onRender: (props: ConquerLoadingQuestionProps) => (
				<PreventHardwareBackGuard>
					<LoadingQuestion {...props} />
				</PreventHardwareBackGuard>
			),
		},
		STATISTIC: {
			name: 'Statistic',
			options: {
				headerShown: false,
			},
			onRender: (props: ConquerStatisticProps) => (
				<PreventHardwareBackGuard>
					<Statistic {...props} />
				</PreventHardwareBackGuard>
			),
		},
	},
	RESOURCES: {
		DAU_NHANH: {
			name: 'QuickMatch',
			options: {
				headerShown: false,
			},
			idleMode: 'SINGLE',
			onRender: (props: ConquerQuickMatchProps) => (
				<PreventHardwareBackGuard>
					<QuickMatch {...props} />
				</PreventHardwareBackGuard>
			),
		},
	},
};
