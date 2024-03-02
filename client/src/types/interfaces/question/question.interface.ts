import { Response } from '../common';
import { Resource } from '../resource';
import { QuestionSchema } from '../schema';

export interface Question extends QuestionSchema {}

export interface FindByRandomQuery {
	size: number;
	resources: Resource['_id'][];
}

export interface FindByRandomResponse extends Response {
	questions: Question[];
}
