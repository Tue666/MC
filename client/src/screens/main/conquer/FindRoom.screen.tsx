import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { Button, FindRoomItem, Loading } from '../../../components';
import { CreateFormingProps, JoinFormingProps } from '../../../components/modal';
import { ConstantConfig } from '../../../configs';
import { useSocketClient } from '../../../hooks';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../../styles';
import { ConquerFindRoomProps, IRoom } from '../../../types';
import { closeModal, openDialog, openModal } from '../../../utils';

const { MAIN_LAYOUT } = ConstantConfig;

export const onCreateForming = (params: CreateFormingProps) => {
	openModal<'CREATE_FORMING'>({
		component: 'CREATE_FORMING',
		params,
	});
};

export const onQuickJoinForming = (params: JoinFormingProps) => {
	openModal<'JOIN_FORMING'>({
		component: 'JOIN_FORMING',
		params,
	});
};

export const validateRoom = (room: IRoom.Room) => {
	let error = null;
	const { maxCapacity, clients } = room;

	if (clients.length >= maxCapacity) {
		error = 'Số lượng thành viên đã đầy';
	}

	return error;
};

interface OutRoomForming {
	room: IRoom.Room;
	statusCode: number;
	error?: string;
}

const FindRoom = (props: ConquerFindRoomProps) => {
	const { navigation, route } = props;
	const { resource, roomMode, idleMode, maxCapacity } = route.params;
	const isFocused = useIsFocused();
	const isRoomChanging = useRef<boolean | null>(false);
	const [rooms, setRooms] = useState<IRoom.Room[] | null>([]);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();

	useEffect(() => {
		const onFormingEvent = (rooms: IRoom.Room[]) => {
			if (!isFocused) return;

			isRoomChanging.current = true;
			setRooms(rooms);
			isRoomChanging.current = false;
		};
		socketClient?.on('conquer:server-client(forming)', onFormingEvent);

		return () => {
			socketClient?.off('conquer:server-client(forming)', onFormingEvent);
		};
	}, [isFocused]);
	useEffect(() => {
		const onOutRoomFormingEvent = (joinedRoom: OutRoomForming) => {
			const { room, statusCode, error } = joinedRoom;

			// The room has password and client must provide it
			if (error && statusCode === 401) {
				onQuickJoinForming({
					resource,
					roomMode,
					_id: room._id,
				});
				return;
			}

			if (error) {
				openDialog({
					title: '[Vào phòng] Thất bại',
					content: error,
					actions: [{ label: 'Đồng ý' }],
				});
				return;
			}

			navigation.navigate('Forming', { resource, room, roomMode, idleMode, maxCapacity });
			closeModal();
		};
		socketClient?.on('conquer:server-client(out-room-forming)', onOutRoomFormingEvent);

		const onErrorFormingEvent = (error: string) => {
			openDialog({
				title: '[Tìm phòng] Lỗi',
				content: error,
			});
		};
		socketClient?.on('[ERROR]conquer:server-client(forming)', onErrorFormingEvent);

		return () => {
			isRoomChanging.current = null;
			socketClient?.off('conquer:server-client(out-room-forming)', onOutRoomFormingEvent);
			socketClient?.off('[ERROR]conquer:server-client(forming)', onErrorFormingEvent);
		};
	}, []);
	const onPressCreateForming = () => {
		onCreateForming({
			resource,
			roomMode,
			idleMode,
			maxCapacity,
		});
	};
	const onJoinForming = (room: IRoom.Room) => {
		const { _id } = room;

		const error = validateRoom(room);
		if (error) {
			openDialog({
				title: '[Vào phòng] Thất bại',
				content: error,
				actions: [{ label: 'Đồng ý' }],
			});
			return;
		}

		// The same as onJoinForming [client/src/components/modal/JoinForming.component.tsx]
		socketClient?.emit('conquer:client-server(forming)', {
			mode: roomMode,
			resource: resource._id,
			room: { _id },
			client: profile,
		});
	};

	if (!rooms) return <Loading />;

	return (
		<View style={[styles.container, globalStyles.container]}>
			{rooms.length <= 0 && (
				<View style={[globalStyles.container, stackStyles.center]}>
					<Text variant="titleMedium">Hiện tại chưa có phòng</Text>
					<Button
						mode="contained"
						onPress={onPressCreateForming}
						style={[{ width: '50%' }]}
						soundName="button_click.mp3"
					>
						Tạo phòng ngay
					</Button>
				</View>
			)}
			{rooms.length > 0 && (
				<ScrollView>
					<View style={[stackStyles.rowWrap]}>
						{rooms.map((room, index) => {
							return <FindRoomItem key={index} room={room} onJoinForming={onJoinForming} />;
						})}
					</View>
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.PADDING,
	},
});

export default FindRoom;
