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
	cover: string;
	avatar: string;
	password: string;
	gold_point: {
		value: number;
	};
	experience_point: {
		value: number;
		maxValue: number;
		level: number;
	};
	matches: MatchSchema['_id'][];
	roles: RoleSchema['_id'][];
	account_type: AccountType[keyof AccountType];
}

export interface StudentSchema extends AccountSchema {}

export interface AdministratorSchema extends AccountSchema {}

// =========================================================================================
// ===================================== MATCH SCHEMA ======================================

export interface Point {
	gold_point: {
		label?: string;
		icon?: string;
	};
	experience_point: {
		label?: string;
		icon?: string;
	};
}

export interface MatchClientSchema extends ClientSchema {
	point_differences: {
		gold_point: AccountSchema['gold_point'] &
			Point['gold_point'] & {
				changed: AccountSchema['gold_point']['value'];
			};
		experience_point: AccountSchema['experience_point'] &
			Point['experience_point'] & {
				changed: AccountSchema['experience_point']['value'];
			};
	};
}

export interface MatchSchema extends TimestampsSchema {
	_id: string;
	mode: RoomMode;
	resource: ResourceSchema['_id'];
	reference_id: unknown;
	state: RoomState;
	start_time: number;
	end_time: number;
	playing_time: number;
	clients: MatchClientSchema[];
}

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
	answer_time: number;
	answers: Answer[];
	gold_point: AccountSchema['gold_point']['value'];
	experience_point: AccountSchema['experience_point']['value'];
}

// =========================================================================================
// ===================================== ROOM SCHEMA =======================================

export type RoomMode = 'NORMAL' | 'AUTO';

export type RoomModeMapping = {
	[K in RoomMode as `${Lowercase<K>}`]: K;
};

export type RoomState =
	| 'FORMING'
	| 'MATCHING'
	| 'PREPARING'
	| 'LOADING_QUESTION'
	| 'PLAYING'
	| 'END';

export type ClientState = 'CONNECT' | 'DISCONNECT' | 'WIN' | 'LOSE';

export interface ClientSchema extends Pick<AccountSchema, '_id' | 'name' | 'avatar'> {
	socketId: string;
	state: ClientState;
	prepared: boolean;
}

export interface RoomSchema {
	_id: string;
	name: string;
	description: string;
	minToStart: ResourceSchema['min_to_start'];
	maxCapacity: ResourceSchema['max_capacity'];
	owner: ClientSchema['_id'] | null;
	password: string;
	matchId: MatchSchema['_id'];
	startTime: MatchSchema['start_time'];
	endTime: MatchSchema['end_time'];
	state: RoomState;
	question: QuestionSchema;
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
	min_to_start: number;
	max_capacity: number;
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
