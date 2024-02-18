import { useContext } from 'react';

import { SocketClientContext } from '../contexts/SocketClient.context';

const useSocketClient = () => useContext(SocketClientContext);

export default useSocketClient;
