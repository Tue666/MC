import { StackNavigationOptions } from '@react-navigation/stack';
import { PreventHardwareBackGuard } from '../../guards';
import { Conquer, LoadingQuestion, Prepare, Statistic, Waiting } from '../../screens/main/conquer';
import { QuickMatch } from '../../screens/main/conquer/quick-match';
import {
	ConquerQuickMatchProps,
	ConquerIdleMode,
	ConquerPrepareProps,
	ConquerProps,
	ConquerStackListKey,
	ConquerStatisticProps,
	ConquerWaitingProps,
	ConquerLoadingQuestionProps,
} from '../../types';

export type ConquerRenderer = {
	COMMON: {
		[key in string]: {
			name: ConquerStackListKey; // Name of screen in stack
			options?: StackNavigationOptions; // Options for screen in stack
			onRender: any; // How screen render
		};
	};
	RESOURCES: {
		[key in string]: {
			name: ConquerStackListKey; // Name of screen in stack
			options?: StackNavigationOptions; // Options for screen in stack
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
		PREPARE: {
			name: 'Prepare',
			options: {
				headerShown: false,
			},
			onRender: (props: ConquerPrepareProps) => (
				<PreventHardwareBackGuard>
					<Prepare {...props} />
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
