import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIClient, accountAPI } from '../apis';
import { Tokens } from '../types/interfaces/account';

const ACCESS_TOKEN_KEY = 'AC_T';
const AUTHORIZATION_HEADER = 'Authorization';

class JWTUtil {
	static ACCESS_RESOURCES_HEADER = 'CM_AR';

	static async getToken(): Promise<Tokens['AC_T'] | null> {
		const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
		return accessToken;
	}

	static async setToken(accessToken: Tokens['AC_T'] | null): Promise<void> {
		if (accessToken === null || accessToken === undefined) {
			await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
			JWTUtil.removeHeader(AUTHORIZATION_HEADER);
			return;
		}

		await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
		JWTUtil.setHeader(AUTHORIZATION_HEADER, `Bearer ${accessToken}`);
	}

	static async isValidToken(accessToken: Tokens['AC_T'] | null): Promise<boolean> {
		if (accessToken === null || accessToken === undefined) return false;

		JWTUtil.setToken(accessToken);
		return accountAPI.verifyToken();
	}

	static setHeader(key: string, value: string): void {
		APIClient.defaults.headers.common[key] = value;
	}

	static removeHeader(key: string): void {
		delete APIClient.defaults.headers.common[key];
	}
}

export default JWTUtil;
