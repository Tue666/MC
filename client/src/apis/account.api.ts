import { IAccount } from '../types';
import { ObjectUtil } from '../utils';
import APIClient from './APIClient';

class AccountAPI {
	static updateCover(
		updateCoverBody: IAccount.UpdateCoverBody
	): Promise<IAccount.UpdateCoverResponse> {
		const formData = ObjectUtil.toFormData(updateCoverBody);

		const url = `/accounts/cover`;
		return APIClient.post(url, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			transformRequest: (data) => {
				return data;
			},
		});
	}

	static updateAvatar(
		updateAvatarBody: IAccount.UpdateAvatarBody
	): Promise<IAccount.UpdateAvatarResponse> {
		const formData = ObjectUtil.toFormData(updateAvatarBody);

		const url = `/accounts/avatar`;
		return APIClient.post(url, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			transformRequest: (data) => {
				return data;
			},
		});
	}

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

	static verifyToken(): Promise<IAccount.VerifyTokenResponse> {
		const url = `/accounts/verify-token`;
		return APIClient.get(url);
	}

	static getProfile(_id?: IAccount.Account['_id']): Promise<IAccount.ProfileResponse> {
		const url = `/accounts/profile${_id ? `/${_id}` : ''}`;
		return APIClient.get(url);
	}
}

export default AccountAPI;
