import { AccountSchema } from './schema.interface';

export interface TimestampsSchema {
	created_at: string;
	updated_at: string;
}

export interface SoftDeleteSchema {
	deleted_at: string;
	deleted_by: {
		_id: AccountSchema['_id'];
		name: string;
	};
}
