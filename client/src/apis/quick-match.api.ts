import { IQuickMatch } from '../types';
import APIClient from './APIClient';

class QuickMatchAPI {
	static findById(_id: IQuickMatch.QuickMatch['_id']): Promise<IQuickMatch.FindByIdResponse> {
		const url = `/quick-matches/${_id}`;
		return APIClient.get(url);
	}
}

export default QuickMatchAPI;
