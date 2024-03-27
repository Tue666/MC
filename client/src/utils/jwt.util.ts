import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIClient, AccountAPI } from '../apis';
import { IAccount } from '../types';

const ACCESS_TOKEN_KEY = 'AC_T';
const AUTHORIZATION_HEADER = 'Authorization';

class JWTUtil {
	static ACCESS_RESOURCES_HEADER = 'CM_AR';

	static async getToken(): Promise<IAccount.Tokens['AC_T'] | null> {
		const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
		return accessToken;
	}

	static async setToken(accessToken: IAccount.Tokens['AC_T'] | null): Promise<void> {
		if (accessToken === null || accessToken === undefined) {
			await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
			JWTUtil.removeHeader(AUTHORIZATION_HEADER);
			return;
		}

		await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
		JWTUtil.setHeader(AUTHORIZATION_HEADER, `Bearer ${accessToken}`);
	}

	static async isValidToken(accessToken: IAccount.Tokens['AC_T'] | null): Promise<boolean> {
		if (accessToken === null || accessToken === undefined) return false;

		await JWTUtil.setToken(accessToken);
		const { verified } = await AccountAPI.verifyToken();
		return verified;
	}

	static setHeader(key: string, value: string): void {
		APIClient.defaults.headers.common[key] = value;
	}

	static removeHeader(key: string): void {
		delete APIClient.defaults.headers.common[key];
	}
}

export default JWTUtil;
