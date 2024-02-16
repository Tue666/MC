import APIClient from './APIClient';
import { IAccount } from '../types';

const accountAPI = {
	signIn: (signInBody: IAccount.SignInBody): Promise<IAccount.SignInResponse> => {
		const url = `/accounts/sign-in`;
		return APIClient.post(url, signInBody);
	},

	signUp: (signUpBody: IAccount.SignUpBody): Promise<IAccount.SignUpResponse> => {
		const url = `/accounts/sign-up`;
		return APIClient.post(url, signUpBody);
	},

	refreshToken: (): Promise<IAccount.SignInResponse> => {
		const url = `/accounts/refresh-token`;
		return APIClient.get(url);
	},

	verifyToken: (): Promise<boolean> => {
		const url = `/accounts/verify-token`;
		return APIClient.get(url);
	},
};

export default accountAPI;
