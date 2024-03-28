import { Asset } from 'react-native-image-picker';
import { Response } from '../common';
import { AccountSchema, AdministratorSchema, MatchSchema, Point, StudentSchema } from '../schema';
import { Tokens } from './auth.interface';

export interface Account extends AccountSchema {}

export interface Student extends StudentSchema {}

export interface Administrator extends AdministratorSchema {}

export interface ProfileResponse extends Response {
	profile: Omit<Account, 'password' | 'matches'> & {
		matches: MatchSchema[];
	};
	point: Point;
}

export interface UpdateCoverBody {
	cover: Asset & {
		name: Asset['fileName'];
	};
}

export interface UpdateCoverResponse extends Response {
	account: Pick<Account, '_id' | 'cover'>;
}

export interface UpdateAvatarBody {
	avatar: Asset & {
		name: Asset['fileName'];
	};
}

export interface UpdateAvatarResponse extends Response {
	account: Pick<Account, '_id' | 'avatar'>;
}

export interface SignInBody extends Pick<Account, 'phone_number' | 'password'> {}

export interface SignInResponse extends Response {
	accessToken: Tokens['AC_T'];
}

export interface SignUpBody extends Pick<Account, 'phone_number' | 'password' | 'name'> {
	passwordConfirm: string;
}

export interface SignUpResponse extends Response {}

export interface VerifyTokenResponse {
	verified: boolean;
}
