import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	AccountProps,
	CreateFormingProps,
	ItemProps,
	JoinFormingProps,
	QuickMatchHistoryProps,
	WinnerProps,
} from '../../components/modal';
import { RootState } from '../store';

export type ModalComponent =
	| 'DEFAULT'
	| 'ACCOUNT'
	| 'CREATE_FORMING'
	| 'ITEM'
	| 'JOIN_FORMING'
	| 'QUICK_MATCH_HISTORY'
	| 'WINNER';

export interface ModalProps {
	DEFAULT: {};
	ACCOUNT: AccountProps;
	CREATE_FORMING: CreateFormingProps;
	ITEM: ItemProps;
	JOIN_FORMING: JoinFormingProps;
	QUICK_MATCH_HISTORY: QuickMatchHistoryProps;
	WINNER: WinnerProps;
}

export interface ModalState<T extends ModalComponent> {
	isOpen: boolean;
	closable?: boolean;
	component: T;
	params?: ModalProps[T];
}

export const initialState: ModalState<'DEFAULT'> = {
	isOpen: false,
	closable: true,
	component: 'DEFAULT',
};

export const slice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		renderModal: (
			state: ModalState<ModalComponent>,
			action: PayloadAction<ModalState<ModalComponent>>
		) => {
			const { isOpen, closable, component, params } = action.payload;
			state.isOpen = isOpen;
			state.closable = closable;
			state.component = component;
			state.params = params;
		},
		disappearModal: (state: ModalState<'DEFAULT'>) => {
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
