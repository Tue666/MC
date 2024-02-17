import APIClient from './APIClient';
import { IRole } from '../types';

const roleAPI = {
	findByIds: (findByIdsBody: IRole.FindByIdsBody): Promise<IRole.FindByIdsResponse> => {
		const url = `/roles/_ids`;
		return APIClient.post(url, findByIdsBody);
	},
};

export default roleAPI;
