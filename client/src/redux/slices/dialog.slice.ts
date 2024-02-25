import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface DialogAction {
	label: string;
	color?: string;
}

export interface DialogState {
	isOpen: boolean;
	closable?: boolean;
	icon?: string;
	title?: string;
	content?: string;
	contentScrollable?: boolean;
	actions?: DialogAction[];
}

export const initialState: DialogState = {
	isOpen: false,
	closable: true,
	content: '',
	actions: [],
};

export const slice = createSlice({
	name: 'dialog',
	initialState,
	reducers: {
		renderDialog: (state: DialogState, action: PayloadAction<DialogState>) => {
			const { isOpen, closable, icon, title, content, contentScrollable, actions } = action.payload;
			state.isOpen = isOpen;
			state.closable = closable;
			state.icon = icon;
			state.title = title;
			state.content = content;
			state.contentScrollable = contentScrollable;
			state.actions = actions;
		},
		disappearDialog: (state: DialogState) => {
			const { isOpen, closable, icon, title, content, contentScrollable, actions } = initialState;
			state.isOpen = isOpen;
			state.closable = closable;
			state.icon = icon;
			state.title = title;
			state.content = content;
			state.contentScrollable = contentScrollable;
			state.actions = actions;
		},
	},
});

const { reducer, actions } = slice;
export const { renderDialog, disappearDialog } = actions;
export const selectDialog = (state: RootState) => state.dialog;
export default reducer;
