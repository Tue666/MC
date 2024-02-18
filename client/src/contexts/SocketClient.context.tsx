import { createContext, PropsWithChildren, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { appAPIs } from '../configs/api';

const URL = appAPIs.server.url;
const socketClient: Socket = io(URL);

const SocketClientContext = createContext<Socket | null>(null);

const SocketClientProvider = ({ children }: PropsWithChildren) => {
	useEffect(() => {
		const onConnect = () => {};

		const onDisconnect = () => {};

		socketClient.on('connect', onConnect);
		socketClient.on('disconnect', onDisconnect);

		return () => {
			socketClient.off('connect', onConnect);
			socketClient.off('disconnect', onDisconnect);
		};
	}, []);
	return <SocketClientContext.Provider value={socketClient}>{children}</SocketClientContext.Provider>;
};

export { SocketClientProvider, SocketClientContext };
