import { IAccount } from '../types';
import APIClient from './APIClient';

class AccountAPI {
	static signIn(signInBody: IAccount.SignInBody): Promise<IAccount.SignInResponse> {
		const url = `/accounts/sign-in`;
		return APIClient.post(url, signInBody);
	}

	static signUp(signUpBody: IAccount.SignUpBody): Promise<IAccount.SignUpResponse> {
		const url = `/accounts/sign-up`;
		return APIClient.post(url, signUpBody);
	}

	static refreshToken(): Promise<IAccount.SignInResponse> {
		const url = `/accounts/refresh-token`;
		return APIClient.get(url);
	}

	static verifyToken(): Promise<boolean> {
		const url = `/accounts/verify-token`;
		return APIClient.get(url);
	}

	static getProfile(): Promise<IAccount.ProfileResponse> {
		const url = `/accounts/profile`;
		return APIClient.get(url);
	}
}

export default AccountAPI;
