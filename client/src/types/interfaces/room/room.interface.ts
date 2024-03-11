import { Resource } from '../resource';
import { RoomMode, RoomSchema } from '../schema';

export interface Room extends RoomSchema {}

export interface FindBody {
	mode: RoomMode;
	resource: Resource['_id'];
}

export interface FindResponse {
	rooms: Room[];
}
