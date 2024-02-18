import { StackNavigationOptions } from '@react-navigation/stack';
import { ConquerStackListKeys } from '../../../types';
import Conquer from './Conquer.screen';
import Waiting from './Waiting.screen';
import FastHandEyes from './fast-hand-eyes/FastHandEyes.screen';

export type ConquerRenderer = {
	[key in string]: {
		name: ConquerStackListKeys; // Name of screen in stack
		options?: StackNavigationOptions;
		startDestination?: ConquerStackListKeys; // Go to screen when press
		onRender: any; // How screen render
	};
};

export const CONQUER_RENDERER: ConquerRenderer = {
	// Common screens
	main: {
		name: 'Conquer',
		options: {
			headerShown: false,
		},
		onRender: (props: any) => <Conquer {...props} />,
	},
	waiting: {
		name: 'Waiting',
		options: {
			title: 'Phòng chờ',
		},
		onRender: (props: any) => <Waiting {...props} />,
	},
	NHANH_TAY_LE_MAT: {
		name: 'FastHandEyes',
		options: {
			headerShown: false,
		},
		onRender: (props: any) => <FastHandEyes {...props} />,
	},
};
