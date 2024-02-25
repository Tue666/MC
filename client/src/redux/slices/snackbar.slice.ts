import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface SnackbarAction {
	label: string;
}

export interface SnackbarState {
	isOpen: boolean;
	content: string;
	duration?: number;
	icon?: string;
	color?: string;
	action?: SnackbarAction;
}

export const initialState: SnackbarState = {
	isOpen: false,
	content: '',
	duration: 3000,
	icon: 'close',
};

export const slice = createSlice({
	name: 'snackbar',
	initialState,
	reducers: {
		renderSnackbar: (state: SnackbarState, action: PayloadAction<SnackbarState>) => {
			const { isOpen, content, duration, icon, color, action: snackbarAction } = action.payload;
			state.isOpen = isOpen;
			state.content = content;
			state.duration = duration;
			state.icon = icon;
			state.color = color;
			state.action = snackbarAction;
		},
		disappearSnackbar: (state: SnackbarState) => {
			const { isOpen, content, duration, icon, color, action } = initialState;
			state.isOpen = isOpen;
			state.content = content;
			state.duration = duration;
			state.icon = icon;
			state.color = color;
			state.action = action;
		},
	},
});

const { reducer, actions } = slice;
export const { renderSnackbar, disappearSnackbar } = actions;
export const selectSnackbar = (state: RootState) => state.snackbar;
export default reducer;
