import { useEffect, useReducer, createContext, PropsWithChildren } from 'react';
import { AccountAPI } from '../apis';
import { SoundManager } from '../audios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearAccount, initAccount, selectAccount } from '../redux/slices/account.slice';
import { useSocketClient } from '../hooks';
import { IAccount, ICommon } from '../types';
import { JWTUtil } from '../utils';

export interface AuthenticationState {
	isInitialized: boolean;
	isAuthenticated: boolean;
}

export interface AuthenticationMethod {
	signIn: (
		signInBody: IAccount.SignInBody,
		callback: ICommon.Callback<undefined, void>
	) => Promise<void>;
	signUp: (
		signUpBody: IAccount.SignUpBody,
		callback: ICommon.Callback<undefined, void>
	) => Promise<void>;
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
	const { profile } = useAppSelector(selectAccount);
	const appDispatch = useAppDispatch();
	const { socketClient } = useSocketClient();

	useEffect(() => {
		const handleRecoveryClient = () => {
			if (!profile?._id) return;

			socketClient?.emit('client-server(recovery-client)', profile._id);
		};

		handleRecoveryClient();
	}, [profile?._id]);
	useEffect(() => {
		const initialize = async () => {
			try {
				const accessToken = await JWTUtil.getToken();
				const isAuthenticated = await JWTUtil.isValidToken(accessToken);
				if (isAuthenticated) {
					// Fetch necessary data here...
					await appDispatch(initAccount());
				}

				SoundManager.initSounds();

				dispatch({
					type: 'INITIALIZE',
					payload: { isAuthenticated },
				});
			} catch (error) {
				await JWTUtil.setToken(null);
				dispatch({
					type: 'INITIALIZE',
					payload: { isAuthenticated: false },
				});
			}
		};

		initialize();
	}, [appDispatch]);

	const signIn = async (
		signInBody: IAccount.SignInBody,
		callback: ICommon.Callback<undefined, void>
	): Promise<void> => {
		const { accessToken, error } = await AccountAPI.signIn(signInBody);
		if (error) {
			callback(undefined, error);
			return;
		}

		await JWTUtil.setToken(accessToken);

		// Fetch necessary data here...
		await appDispatch(initAccount());

		dispatch({ type: 'LOGIN' });
		callback();
	};

	const signUp = async (
		signUpBody: IAccount.SignUpBody,
		callback: ICommon.Callback<undefined, void>
	): Promise<void> => {
		const { error } = await AccountAPI.signUp(signUpBody);
		if (error) {
			callback(undefined, error);
			return;
		}

		callback();
	};

	const signOut = async (): Promise<void> => {
		dispatch({ type: 'LOGOUT' });

		await JWTUtil.setToken(null);

		// Clear necessary data here...
		appDispatch(clearAccount());
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
