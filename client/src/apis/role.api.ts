import { IRole } from '../types';
import APIClient from './APIClient';

class RoleAPI {
	static findByIds(findByIdsBody: IRole.FindByIdsBody): Promise<IRole.FindByIdsResponse> {
		const url = `/roles/_ids`;
		return APIClient.post(url, findByIdsBody);
	}
}

export default RoleAPI;
