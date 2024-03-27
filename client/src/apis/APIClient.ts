import axios from 'axios';
import { APIConfig } from '../configs';
import { JWTUtil } from '../utils';
import { AccountAPI } from '.';

const { APP } = APIConfig;

const APIClient = () => {
	const axiosClient = axios.create({
		baseURL: `${APP.server.host}/${APP.server.path}`,
	});

	axiosClient.interceptors.request.use(
		(config) => config,
		(error) => Promise.reject(error)
	);

	axiosClient.interceptors.response.use(
		(response) => response && response.data,
		async (error) => {
			const originalRequest = error.config;
			// Access Token was expired or Unauthorized
			if (error.response.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true; // Mark to try again only once
				const accessToken = await JWTUtil.getToken();
				// Unauthorized
				if (accessToken === null || accessToken === undefined) {
					return Promise.reject(error);
				}
				// Generate new token if the authentication is successful
				const { accessToken: newAccessToken, error: refreshError } = await AccountAPI.refreshToken();
				if (refreshError) {
					error.response.data = refreshError;
					return Promise.reject(error);
				}

				await JWTUtil.setToken(newAccessToken);
				originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
				const res = await axios(originalRequest);
				return res.data;
			}

			// Forbidden
			if (error.response.status === 403) {
				return Promise.reject(error);
			}
			return Promise.reject(error);
		}
	);
	return axiosClient;
};

export default APIClient();
