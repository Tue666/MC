import { RoleSchema } from '../schema';
import { Account } from '../account';

export interface Role extends RoleSchema {}

export interface FindByIdsBody {
	_ids: Account['roles'];
}

export interface FindByIdsResponse {
	roles: Role[];
}
