import { Response } from '../common';
import { QuickMatchSchema } from '../schema';
import { Match } from '../match';
import { Question } from '../question';

export interface QuickMatch extends QuickMatchSchema {}

export interface FindByIdResponse extends Response {
	quickMatch: Omit<QuickMatch, 'question'> & {
		question: Question;
		match: Match;
	};
}
