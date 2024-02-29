import { IQuestion } from '../types';
import APIClient from './APIClient';

class QuestionAPI {
	static findByRandom(): Promise<IQuestion.Question> {
		const url = `/questions/random`;
		return APIClient.get(url);
	}
}

export default QuestionAPI;
