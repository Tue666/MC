import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './slices/account.slice';
import dialogReducer from './slices/dialog.slice';

export const store = configureStore({
	reducer: {
		account: accountReducer,
		dialog: dialogReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
