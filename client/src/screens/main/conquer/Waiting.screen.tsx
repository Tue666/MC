import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SoundManager } from '../../../audios';
import { Button, SingleWaiting } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useSocketClient } from '../../../hooks';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { useStackStyles } from '../../../styles';
import { ConquerWaitingProps, IRoom } from '../../../types';
import { openDialog } from '../../../utils';

const { MAIN_LAYOUT, SPACE_GAP } = ConstantConfig;

const MAX_CAPACITY = 2;

const Waiting = (props: ConquerWaitingProps) => {
	const { navigation, route } = props;
	const { _id, name, idleMode } = route.params;
	const theme = useTheme();
	const [isParticipating, setIsParticipating] = useState(false);
	const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);
	const [clientCount, setClientCount] = useState(0);
	const { profile } = useAppSelector(selectAccount);
	const stackStyles = useStackStyles();
	const socketClient = useSocketClient();

	useEffect(() => {
		socketClient?.on('conquer:server-client(participating)', (room: IRoom.Room) => {
			const { _id, clients } = room;

			setJoinedRoomId(_id);
			setClientCount(clients.length);
		});
		socketClient?.on('[ERROR]conquer:server-client(participating)', (error) => {
			openDialog({
				title: 'Lỗi',
				content: error,
			});
		});
		socketClient?.on('[ERROR]conquer:server-client(cancel-participating)', (error) => {
			openDialog({
				title: 'Lỗi',
				content: error,
			});
		});

		socketClient?.on('conquer:server-client(prepare-participate)', (joinedRoom: IRoom.Room) => {
			navigation.navigate('Prepare', { room: joinedRoom, _id, name, idleMode });
			setIsParticipating(false);
			setClientCount(0);
		});
	}, []);
	const onPressParticipate = () => {
		const room = {
			resource: _id,
			maxCapacity: MAX_CAPACITY,
		};

		if (isParticipating) {
			socketClient?.emit('conquer:client-server(cancel-participating)', {
				room: {
					...room,
					_id: joinedRoomId,
				},
				client: {
					_id: profile._id,
				},
			});
			setIsParticipating(false);
			return;
		}

		SoundManager.playSound('participate.mp3');
		socketClient?.emit('conquer:client-server(participating)', {
			room,
			client: {
				_id: profile._id,
				name: profile.name,
				prepared: false,
			},
		});
		setIsParticipating(true);
	};
	return (
		<View style={{ ...styles.container, ...stackStyles.center }}>
			<Text variant="titleLarge">{name}</Text>
			{idleMode === 'SINGLE' && <SingleWaiting />}
			<Button
				loading={isParticipating}
				mode="contained"
				buttonColor={isParticipating ? theme.colors.error : theme.colors.primary}
				icon={() => (
					<Icon
						name={isParticipating ? 'cancel' : 'person-search'}
						size={20}
						color={isParticipating ? theme.colors.onError : theme.colors.onPrimary}
					/>
				)}
				soundName="button_click.mp3"
				outerProps={{
					onPress: onPressParticipate,
					style: { ...styles.gap, width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE },
				}}
			>
				{isParticipating ? `Hủy (${clientCount}/${MAX_CAPACITY})` : 'Ghép Ngẫu Nhiên'}
			</Button>
			<Button
				mode="outlined"
				icon={() => <Icon name="search" size={20} color={theme.colors.primary} />}
				soundName="button_click.mp3"
				outerProps={{
					style: { ...styles.gap, width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE },
				}}
			>
				Tìm Phòng
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	gap: {
		marginBottom: SPACE_GAP,
	},
});

export default Waiting;
