import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { FormingBottom, FormingItem } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useSocketClient } from '../../../hooks';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../../styles';
import { ConquerFormingProps, IRoom } from '../../../types';
import { openDialog } from '../../../utils';

const { ROOM } = ConstantConfig;

const Forming = (props: ConquerFormingProps) => {
	const { navigation, route } = props;
	const { resource, room, roomMode, idleMode, maxCapacity: minCapacityToStart } = route.params;
	const startFormingRef = useRef<boolean | null>(false);
	const [joinedRoom, setJoinedRoom] = useState(room);
	const { owner, maxCapacity, clients } = joinedRoom;
	const connectClients = clients.filter((client) => client.state === ROOM.CLIENT_STATE.connect);
	const { profile } = useAppSelector(selectAccount);
	const isOwner = profile._id === owner;
	const socketClient = useSocketClient();

	useEffect(() => {
		const onInRoomFormingEvent = (room: IRoom.Room) => {
			setJoinedRoom(room);
		};
		socketClient?.on('conquer:server-client(in-room-forming)', onInRoomFormingEvent);

		const onStartFormingEvent = (room: IRoom.Room) => {
			navigation.navigate('Preparing', {
				resource,
				room,
				roomMode,
				idleMode,
			});

			startFormingRef.current = false;
		};
		socketClient?.on('conquer:server-client(start-forming)', onStartFormingEvent);

		const onErrorStartFormingEvent = (error: string) => {
			openDialog({
				title: '[Bắt đầu] Lỗi',
				content: error,
			});
		};
		socketClient?.on('[ERROR]conquer:server-client(start-forming)', onErrorStartFormingEvent);

		return () => {
			socketClient?.off('conquer:server-client(in-room-forming)', onInRoomFormingEvent);
			socketClient?.off('conquer:server-client(start-forming)', onStartFormingEvent);
			socketClient?.off('[ERROR]conquer:server-client(start-forming)', onErrorStartFormingEvent);
		};
	}, []);
	const onLeaveForming = () => {
		socketClient?.emit('conquer:client-server(leave-forming)', {
			mode: roomMode,
			resource: resource._id,
			room: joinedRoom,
			client: profile,
		});

		navigation.goBack();
	};
	const onStart = () => {
		if (startFormingRef.current) return;

		startFormingRef.current = true;

		socketClient?.emit('conquer:client-server(start-forming)', {
			mode: roomMode,
			resource: resource._id,
			room: joinedRoom,
		});
	};
	return (
		<View style={[globalStyles.container]}>
			<ScrollView>
				<View style={[stackStyles.rowWrap]}>
					{clients?.length &&
						clients.map((client, index) => {
							return <FormingItem key={index} owner={owner} client={client} />;
						})}
				</View>
			</ScrollView>
			<FormingBottom
				isOwner={isOwner}
				profile={profile}
				clientCount={connectClients.length}
				maxCapacity={maxCapacity}
				minCapacityToStart={minCapacityToStart}
				onLeaveForming={onLeaveForming}
				onStart={onStart}
			/>
		</View>
	);
};

export default Forming;
