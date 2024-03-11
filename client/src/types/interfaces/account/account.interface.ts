import { Response } from '../common';
import { AccountSchema, AdministratorSchema, StudentSchema } from '../schema';
import { Tokens } from './auth.interface';

export interface Account extends AccountSchema {}

export interface Student extends StudentSchema {}

export interface Administrator extends AdministratorSchema {}

export interface ProfileResponse {
	profile: Omit<Account, 'password'>;
}

export interface SignInBody extends Pick<Account, 'phone_number' | 'password'> {}

export interface SignInResponse extends Response {
	accessToken: Tokens['AC_T'];
}

export interface SignUpBody extends Pick<Account, 'phone_number' | 'password' | 'name'> {
	passwordConfirm: string;
}

export interface SignUpResponse extends Response {}
