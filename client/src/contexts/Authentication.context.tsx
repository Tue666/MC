import { useEffect, useReducer, createContext, PropsWithChildren } from 'react';
import { accountAPI } from '../apis';
import { IAccount, ICommon } from '../types';
import { JWTUtil } from '../utils';
import { openDialog } from '../utils/dialog.util';

export interface AuthenticationState {
	isInitialized: boolean;
	isAuthenticated: boolean;
}

export interface AuthenticationMethod {
	signIn: (signInBody: IAccount.SignInBody, callback: ICommon.Callback<void>) => Promise<void>;
	signUp: (signUpBody: IAccount.SignUpBody, callback: ICommon.Callback<void>) => Promise<void>;
	signOut: () => Promise<void>;
}

const initialState: AuthenticationState & AuthenticationMethod = {
	isInitialized: false,
	isAuthenticated: false,
	signIn: () => Promise.resolve(),
	signUp: () => Promise.resolve(),
	signOut: () => Promise.resolve(),
};

const handlers = {
	INITIALIZE: (state: AuthenticationState, action: AuthenticationAction) => {
		const { isAuthenticated } = action?.payload || {};
		return {
			...state,
			isAuthenticated: !isAuthenticated ? state.isAuthenticated : isAuthenticated,
			isInitialized: true,
		};
	},
	LOGIN: (state: AuthenticationState) => {
		return {
			...state,
			isAuthenticated: true,
		};
	},
	LOGOUT: (state: AuthenticationState) => {
		return {
			...state,
			isAuthenticated: false,
		};
	},
};

interface AuthenticationAction {
	type: keyof typeof handlers;
	payload?: Partial<AuthenticationState>;
}

const reducer = (state: AuthenticationState, action: AuthenticationAction) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthenticationContext = createContext(initialState);

const AuthenticationProvider = (props: PropsWithChildren) => {
	const { children } = props;
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const initialize = async () => {
			try {
				const accessToken = await JWTUtil.getToken();
				const isAuthenticated = await JWTUtil.isValidToken(accessToken);
				if (isAuthenticated) {
					// Fetch necessary data here...
				}

				dispatch({
					type: 'INITIALIZE',
					payload: { isAuthenticated },
				});
			} catch (error: any) {
				openDialog({
					closable: false,
					content: `Đã có lỗi xảy ra: ${error?.message}`,
				});
				dispatch({
					type: 'INITIALIZE',
					payload: { isAuthenticated: false },
				});
			}
		};

		initialize();
	}, []);

	const signIn = async (
		signInBody: IAccount.SignInBody,
		callback: ICommon.Callback<void>
	): Promise<void> => {
		const { accessToken, error } = await accountAPI.signIn(signInBody);
		if (error) {
			callback(error);
			return;
		}

		await JWTUtil.setToken(accessToken);
		// Fetch necessary data here...
		dispatch({ type: 'LOGIN' });
		callback();
	};

	const signUp = async (
		signUpBody: IAccount.SignUpBody,
		callback: ICommon.Callback<void>
	): Promise<void> => {
		const { error } = await accountAPI.signUp(signUpBody);
		if (error) {
			callback(error);
			return;
		}

		callback();
	};

	const signOut = async (): Promise<void> => {
		await JWTUtil.setToken(null);
		// Clear necessary data here...
		dispatch({ type: 'LOGOUT' });
	};
	return (
		<AuthenticationContext.Provider
			value={{
				...state,
				signIn,
				signUp,
				signOut,
			}}
		>
			{children}
		</AuthenticationContext.Provider>
	);
};

export { AuthenticationProvider, AuthenticationContext };
