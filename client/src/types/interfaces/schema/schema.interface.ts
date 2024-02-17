import { SoftDeleteSchema, TimestampsSchema } from './common.interface';

// ================================== ACCOUNT =====================================

export type AccountType = {
	[T in Lowercase<'student' | 'administrator'>]: Uppercase<T>;
};

export interface AccountSchema extends TimestampsSchema, SoftDeleteSchema {
	_id: string;
	phone_number: string;
	is_phone_verified: boolean;
	name: string;
	password: string;
	roles: RoleSchema['_id'][];
	account_type: AccountType[keyof AccountType];
}

export interface StudentSchema extends AccountSchema {}

export interface AdministratorSchema extends AccountSchema {}

// ==================================================================================
// ================================== OPERATION =====================================

export type OperationStatus = 'ACTIVE' | 'LOCKED';

export interface OperationSchema extends TimestampsSchema {
	_id: string;
	name: string;
	description: string;
	status: RoleStatus;
}

// ==================================================================================
// =================================== RESOURCE =====================================

export type ResourceStatus = 'ACTIVE' | 'LOCKED';

export interface ResourceSchema extends TimestampsSchema {
	_id: string;
	name: string;
	description: string;
	priority: number;
	difficulty: number;
	operations: OperationSchema[];
	status: RoleStatus;
}

// ==================================================================================
// ===================================== ROLE =======================================

export type RoleStatus = 'ACTIVE' | 'LOCKED';

interface RolePermission {
	resource: Omit<ResourceSchema, 'operations'>;
	operations: OperationSchema[];
}

export interface RoleSchema extends TimestampsSchema {
	_id: string;
	name: string;
	description: string;
	permissions: RolePermission[];
	status: RoleStatus;
}

// ==================================================================================
