import axios from 'axios';
import { JWTUtil } from '../utils';
import { accountAPI } from '.';

const APIClient = () => {
	const axiosClient = axios.create({
		baseURL: 'http://192.168.1.7:5000/api',
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
					return Promise.reject({ message: 'Xác thực thông tin thất bại!' });
				}
				// Generate new token if the authentication is successful
				const { accessToken: newAccessToken, error: refreshError } = await accountAPI.refreshToken();
				if (refreshError) {
					return Promise.reject({ message: refreshError });
				}

				await JWTUtil.setToken(newAccessToken);
				originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
				return axios(originalRequest);
			}

			// Forbidden
			if (error.response.status === 403) {
				return Promise.reject({ message: 'Xác thực thông tin thất bại!' });
			}
			return Promise.reject(error);
		}
	);
	return axiosClient;
};

export default APIClient();
