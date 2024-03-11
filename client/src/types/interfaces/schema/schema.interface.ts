import { SoftDeleteSchema, TimestampsSchema } from './common.interface';

// ================================== ACCOUNT SCHEMA =======================================

export type AccountType = {
	[T in Lowercase<'student' | 'administrator'>]: Uppercase<T>;
};

export interface AccountSchema extends TimestampsSchema, SoftDeleteSchema {
	_id: string;
	phone_number: string;
	is_phone_verified: boolean;
	name: string;
	avatar: string;
	password: string;
	roles: RoleSchema['_id'][];
	account_type: AccountType[keyof AccountType];
}

export interface StudentSchema extends AccountSchema {}

export interface AdministratorSchema extends AccountSchema {}

// =========================================================================================
// ===================================== QUESTION SCHEMA ===================================

export type QuestionType = 'SINGLE' | 'MULTIPLE';

export interface Answer {
	_id: string;
	value: number;
	content: string;
}

export interface QuestionSchema extends TimestampsSchema, SoftDeleteSchema {
	_id: string;
	content: string;
	type: QuestionType;
	resources: ResourceSchema['_id'][];
	description: string;
	values: Answer['value'][];
	answers: Answer[];
}

// =========================================================================================
// ===================================== ROOM SCHEMA =======================================

export type RoomMode = 'NORMAL' | 'AUTO';

export type RoomModeMapping = {
	[K in RoomMode as `${Lowercase<K>}`]: K;
};

export type RoomState = 'FORMING' | 'MATCHING' | 'PREPARING' | 'LOADING_QUESTION' | 'PLAYING';

export type ClientState = 'CONNECT' | 'DISCONNECT';

export interface ClientSchema {
	socketId: string;
	_id: string;
	name: string;
	avatar: string;
	state: ClientState;
	prepared: boolean;
}

export interface RoomSchema {
	_id: string;
	name: string;
	description: string;
	state: RoomState;
	password: string;
	owner: string | null;
	maxCapacity: number;
	firstRaisedHand: ClientSchema['_id'];
	createdAt: string;
	clients: ClientSchema[];
}

// =========================================================================================
// ================================== OPERATION SCHEMA =====================================

export type OperationStatus = 'ACTIVE' | 'LOCKED';

export interface OperationSchema extends TimestampsSchema {
	_id: string;
	name: string;
	description: string;
	status: RoleStatus;
}

// =========================================================================================
// =================================== RESOURCE SCHEMA =====================================

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

// =========================================================================================
// ===================================== ROLE SCHEMA =======================================

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
