import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIClient, accountAPI } from '../apis';
import { Tokens } from '../types/interfaces/account';

const ACCESS_TOKEN_KEY = 'AC_T';

class JWTUtil {
	static async getToken(): Promise<Tokens['AC_T'] | null> {
		const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
		return accessToken;
	}

	static async setToken(accessToken: Tokens['AC_T'] | null): Promise<void> {
		if (accessToken === null || accessToken === undefined) {
			await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
			delete APIClient.defaults.headers.common['Authorization'];
			return;
		}

		await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
		APIClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
	}

	static async isValidToken(accessToken: Tokens['AC_T'] | null): Promise<boolean> {
		if (accessToken === null || accessToken === undefined) return false;

		JWTUtil.setToken(accessToken);
		return accountAPI.verifyToken();
	}
}

export default JWTUtil;
