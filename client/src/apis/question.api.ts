import { IQuestion } from '../types';
import APIClient from './APIClient';

class QuestionAPI {
	static findByRandom(): Promise<IQuestion.FindByRandomResponse> {
		const url = `/questions/random?size=1&resource=DAU_NHANH`;
		return APIClient.get(url);
	}
}

export default QuestionAPI;
