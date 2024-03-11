import { IRoom } from '../types';
import APIClient from './APIClient';

class RoomAPI {
	static find(body: IRoom.FindBody): Promise<IRoom.FindResponse> {
		const url = `/rooms`;
		return APIClient.post(url, body);
	}
}

export default RoomAPI;
