import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type ModalComponent = 'DEFAULT' | 'WINNER';

export interface ModalState {
	isOpen: boolean;
	closable?: boolean;
	component: ModalComponent;
	params?: any;
}

export const initialState: ModalState = {
	isOpen: false,
	closable: true,
	component: 'DEFAULT',
};

export const slice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		renderModal: (state: ModalState, action: PayloadAction<ModalState>) => {
			const { isOpen, closable, component, params } = action.payload;
			state.isOpen = isOpen;
			state.closable = closable;
			state.component = component;
			state.params = params;
		},
		disappearModal: (state: ModalState) => {
			const { isOpen, closable, component, params } = initialState;
			state.isOpen = isOpen;
			state.closable = closable;
			state.component = component;
			state.params = params;
		},
	},
});

const { reducer, actions } = slice;
export const { renderModal, disappearModal } = actions;
export const selectModal = (state: RootState) => state.modal;
export default reducer;
