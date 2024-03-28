import { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SoundManager } from '../../../audios';
import { Box, FormingBottom, FormingItem } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useSocketClient } from '../../../hooks';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../../styles';
import { ConquerFormingProps, IRoom } from '../../../types';
import { openDialog, openSnackbar } from '../../../utils';

const { BOX, MAIN_LAYOUT, ROOM } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH =
	WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2 - MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING * 2;
const ITEM_WIDTH =
	(CONTAINER_WIDTH - 5 * 2 * MAIN_LAYOUT.SCREENS.CONQUER.FORMING.NUMBER_ITEM_IN_ROW) *
	(1 / MAIN_LAYOUT.SCREENS.CONQUER.FORMING.NUMBER_ITEM_IN_ROW);

const Forming = (props: ConquerFormingProps) => {
	const { navigation, route } = props;
	const { resource, room, roomMode, idleMode, minToStart } = route.params;
	const startFormingRef = useRef<boolean | null>(false);
	const [joinedRoom, setJoinedRoom] = useState(room);
	const { owner, maxCapacity, clients } = joinedRoom;
	const connectClients = clients.filter((client) => client.state === ROOM.CLIENT_STATE.connect);
	const { profile } = useAppSelector(selectAccount);
	const isOwner = profile._id === owner;
	const theme = useTheme();
	const { socketClient } = useSocketClient();

	useEffect(() => {
		const onInRoomFormingEvent = (room: IRoom.Room) => {
			const { name, owner, clients } = room;

			// The room has changed owner
			if (owner !== joinedRoom.owner) {
				const newOwner = clients.find((client) => client._id === owner);
				openDialog({
					title: `[${name}] Thay đổi chủ phòng`,
					content: `<strong>${newOwner?.name}</strong> đã trở thành chủ phòng mới`,
					actions: [{ label: 'Đồng ý' }],
				});
			}

			setJoinedRoom(room);
		};
		socketClient?.on('conquer:server-client(in-room-forming)', onInRoomFormingEvent);

		return () => {
			socketClient?.off('conquer:server-client(in-room-forming)', onInRoomFormingEvent);
		};
	}, [joinedRoom]);
	useEffect(() => {
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

		const onErrorTransferOwnerFormingEvent = (error: string) => {
			openDialog({
				title: '[Thay đổi chủ phòng] Lỗi',
				content: error,
			});
		};
		socketClient?.on(
			'[ERROR]conquer:server-client(transfer-owner-forming)',
			onErrorTransferOwnerFormingEvent
		);

		const onRemovedFromFormingEvent = () => {
			onLeaveForming();
			openDialog({
				title: 'Oh',
				content: 'Bạn đã bị đá khỏi phòng',
				actions: [{ label: 'Đồng ý' }],
			});
		};
		socketClient?.on('conquer:server-client(removed-from-forming)', onRemovedFromFormingEvent);

		const onErrorRemoveClientFormingEvent = (error: string) => {
			openDialog({
				title: '[Đá khỏi phòng] Lỗi',
				content: error,
			});
		};
		socketClient?.on(
			'[ERROR]conquer:server-client(remove-client-forming)',
			onErrorRemoveClientFormingEvent
		);

		return () => {
			socketClient?.off('conquer:server-client(start-forming)', onStartFormingEvent);
			socketClient?.off('[ERROR]conquer:server-client(start-forming)', onErrorStartFormingEvent);
			socketClient?.off(
				'[ERROR]conquer:server-client(transfer-owner-forming)',
				onErrorTransferOwnerFormingEvent
			);
			socketClient?.off('conquer:server-client(removed-from-forming)', onRemovedFromFormingEvent);
			socketClient?.off(
				'[ERROR]conquer:server-client(remove-client-forming)',
				onErrorRemoveClientFormingEvent
			);
		};
	}, []);
	const onPressCopyRoomId = () => {
		SoundManager.playSound('button_click.mp3');
		openSnackbar({
			content: 'Copy ID phòng thành công',
		});
	};
	const onLeaveForming = () => {
		socketClient?.emit('conquer:client-server(leave-forming)', {
			mode: roomMode,
			resource: resource._id,
			room: joinedRoom,
			client: profile,
		});

		navigation.goBack();
	};
	const onTransferForming = (newOwner: IRoom.Room['clients'][number]) => {
		socketClient?.emit('conquer:client-server(transfer-owner-forming)', {
			mode: roomMode,
			resource: resource._id,
			room: joinedRoom,
			newOwner,
		});
	};
	const onRemoveFromForming = (client: IRoom.Room['clients'][number]) => {
		socketClient?.emit('conquer:client-server(remove-client-forming)', {
			client,
		});
	};
	const onStart = () => {
		if (startFormingRef.current) return;

		startFormingRef.current = true;

		SoundManager.playSound('waiting_bg.mp3', { repeat: true });
		socketClient?.emit('conquer:client-server(start-forming)', {
			mode: roomMode,
			resource: resource._id,
			room: joinedRoom,
		});
	};
	return (
		<View style={[globalStyles.container]}>
			<Box style={[styles.header]}>
				<View style={[stackStyles.row]}>
					<Text
						variant="labelMedium"
						style={[
							globalStyles.bg,
							styles.headerText,
							{
								borderRadius: BOX.BORDER_RADIUS,
								flex: 1,
								marginRight: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.MARGIN / 2,
							},
						]}
					>
						{joinedRoom._id}
					</Text>
					<TouchableOpacity onPress={onPressCopyRoomId}>
						<Icon name="content-copy" size={20} color={theme.colors.onSurface} />
					</TouchableOpacity>
				</View>
				<Divider style={[{ marginVertical: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.MARGIN / 2 }]} />
				<View style={[stackStyles.row]}>
					{joinedRoom.password && <Icon name="lock" color={theme.colors.onSurface} />}
					<Text variant="labelMedium" style={[styles.headerText]}>
						Phòng:
					</Text>
					<Text variant="labelMedium" numberOfLines={1} style={[styles.headerText, { fontWeight: 'bold' }]}>
						{joinedRoom.name}
					</Text>
				</View>
			</Box>
			<ScrollView>
				<View style={[stackStyles.rowWrap]}>
					{clients?.length &&
						clients.map((client, index) => {
							return (
								<FormingItem
									key={index}
									width={ITEM_WIDTH}
									clientId={profile._id}
									roomOwner={owner}
									client={client}
									onTransferForming={onTransferForming}
									onRemoveFromForming={onRemoveFromForming}
								/>
							);
						})}
				</View>
			</ScrollView>
			<FormingBottom
				isOwner={isOwner}
				profile={profile}
				minToStart={minToStart}
				clientCount={connectClients.length}
				maxCapacity={maxCapacity}
				onLeaveForming={onLeaveForming}
				onStart={onStart}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.PADDING,
	},
	headerText: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.FORMING.PADDING / 2,
	},
});

export default Forming;
