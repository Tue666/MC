import { StackNavigationOptions } from '@react-navigation/stack';
import { PreventHardwareBackGuard } from '../../guards';
import { Conquer, Prepare, Statistic, Waiting } from '../../screens/main/conquer';
import { FastHandEyes } from '../../screens/main/conquer/fast-hand-eyes';
import {
	ConquerFastHandEyesProps,
	ConquerIdleMode,
	ConquerPrepareProps,
	ConquerProps,
	ConquerStackListKey,
	ConquerStatisticProps,
	ConquerWaitingProps,
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
		NHANH_TAY_LE_MAT: {
			name: 'FastHandEyes',
			options: {
				headerShown: false,
			},
			idleMode: 'SINGLE',
			onRender: (props: ConquerFastHandEyesProps) => (
				<PreventHardwareBackGuard>
					<FastHandEyes {...props} />
				</PreventHardwareBackGuard>
			),
		},
	},
};
