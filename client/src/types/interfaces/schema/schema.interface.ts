import { SoftDeleteSchema, TimestampsSchema } from './common.interface';

export type AccountType = {
	[T in Lowercase<'student' | 'administrator'>]: Uppercase<T>;
};

export interface AccountSchema extends TimestampsSchema, SoftDeleteSchema {
	_id: string;
	phone_number: string;
	is_phone_verified: boolean;
	password: string;
	roles: string[];
	account_type: AccountType[keyof AccountType];
}

export interface StudentSchema extends AccountSchema {}

export interface AdministratorSchema extends AccountSchema {}
