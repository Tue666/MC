import { configureStore } from '@reduxjs/toolkit';
import {
	accountReducer,
	dialogReducer,
	snackbarReducer,
	modalReducer,
	conversationReducer,
} from './slices';

export const store = configureStore({
	reducer: {
		account: accountReducer,
		conversation: conversationReducer,
		dialog: dialogReducer,
		snackbar: snackbarReducer,
		modal: modalReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
