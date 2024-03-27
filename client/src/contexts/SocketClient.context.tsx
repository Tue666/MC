import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { io, Socket } from 'socket.io-client';
import { APIConfig, ConstantConfig, ResourceConfig } from '../configs';
import { useAppSelector } from '../redux/hooks';
import { selectAccount } from '../redux/slices/account.slice';
import { ConquerStackList, IResource, IRoom, ISchema } from '../types';
import { openDialog, openSnackbar } from '../utils';

const { APP } = APIConfig;
const { ROOM } = ConstantConfig;
const { CONQUER_RENDERER } = ResourceConfig;

const MAX_SOCKET_RETRY_NUMBER = 10;

const URL = APP.server.host;
const socketClient: Socket = io(URL, {
	forceNew: true,
	reconnectionAttempts: MAX_SOCKET_RETRY_NUMBER,
});

export interface Connection {
	resource: IResource.Resource['_id'];
	mode: ISchema.RoomMode;
	room: IRoom.Room;
}

export type RecoveryHandlers = {
	[Key in ISchema.RoomState]?: (connection: Connection) => void;
};

export interface SocketClientState {
	socketClient: Socket | null;
}

const initialState: SocketClientState = {
	socketClient,
};

const SocketClientContext = createContext<SocketClientState>(initialState);

const SocketClientProvider = (props: PropsWithChildren) => {
	const { RESOURCES } = CONQUER_RENDERER;

	const { children } = props;
	const navigation = useNavigation<StackNavigationProp<ConquerStackList>>();
	const temporarilyDisconnectRef = useRef<boolean | null>(false);
	const [state, setState] = useState<SocketClientState>(initialState);
	const { profile, resources } = useAppSelector(selectAccount);

	const handleFormingRecovery = (connection: Connection) => {
		const { mode, resource, room } = connection;
		const { minToStart, maxCapacity } = room;

		navigation.dispatch(
			CommonActions.reset({
				index: 3,
				routes: [
					{ name: 'Conquer' },
					{
						name: 'Waiting',
						params: {
							resource: resources[resource],
							idleMode: RESOURCES[resource].idleMode,
						},
					},
					{
						name: 'FindRoom',
						params: {
							resource: resources[resource],
							roomMode: mode,
							idleMode: RESOURCES[resource].idleMode,
							minToStart,
							maxCapacity,
						},
					},
					{
						name: 'Forming',
						params: {
							resource: resources[resource],
							room,
							roomMode: mode,
							idleMode: RESOURCES[resource].idleMode,
							minToStart: maxCapacity,
						},
					},
				],
			})
		);
	};
	const handlePlayingRecovery = (connection: Connection) => {
		const { mode, resource, room } = connection;
		const { question } = room;

		navigation.dispatch(
			StackActions.replace('QuickMatch', {
				resource: resources[resource],
				room,
				roomMode: mode,
				question,
			})
		);
	};
	const recoveryHandler = (state: ISchema.RoomState, connection: Connection) => {
		const handlers: RecoveryHandlers = {
			[ROOM.STATE.forming]: handleFormingRecovery,
			[ROOM.STATE.playing]: handlePlayingRecovery,
		};

		if (!handlers[state]) return;

		return handlers[state]!(connection);
	};
	useEffect(() => {
		const onRecoveryClient = (connection: Connection) => {
			const { room } = connection;
			const { state } = room;

			recoveryHandler(state, connection);
		};
		socketClient.on('server-client(recovery-client)', onRecoveryClient);

		const handleRecoveryClient = () => {
			// When app start, redux state has not been initialized. So skip recovery.
			// The Authentication context does recovery when initialize instead
			if (!profile?._id) return;

			// Recovery in case of the app started and redux state has been initialized
			socketClient.emit('client-server(recovery-client)', profile._id);
		};

		const handleConnect = () => {
			handleRecoveryClient();
		};

		const onConnect = () => {
			if (temporarilyDisconnectRef.current) {
				temporarilyDisconnectRef.current = false;

				openSnackbar({
					content: 'Đã khôi phục kết nối',
				});
			}

			handleConnect();
		};
		socketClient.on('connect', onConnect);

		const onReconnectFailed = () => {
			openDialog({
				content: 'Không thể kết nối',
				closable: false,
			});
		};
		socketClient.io.on('reconnect_failed', onReconnectFailed);

		const onDisconnect = () => {
			temporarilyDisconnectRef.current = true;

			openSnackbar({
				content: 'Bạn đang offline',
			});
		};
		socketClient.on('disconnect', onDisconnect);

		return () => {
			temporarilyDisconnectRef.current = null;

			socketClient.off('connect', onConnect);
			socketClient.io.off('reconnect_failed', onReconnectFailed);
			socketClient.off('disconnect', onDisconnect);

			socketClient.off('server-client(recovery-client)', onRecoveryClient);
		};
	}, [profile?._id]);

	return <SocketClientContext.Provider value={{ ...state }}>{children}</SocketClientContext.Provider>;
};

export { SocketClientProvider, SocketClientContext };
