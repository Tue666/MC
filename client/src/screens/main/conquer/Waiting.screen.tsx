import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import Animated, { FadeInUp, StretchInX } from 'react-native-reanimated';
import { SoundManager } from '../../../audios';
import { Button, SingleWaiting } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useSocketClient } from '../../../hooks';
import { useAppSelector } from '../../../redux/hooks';
import { AccountState, selectAccount } from '../../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../../styles';
import { ConquerWaitingProps, IRoom } from '../../../types';
import { openDialog } from '../../../utils';

const { MAIN_LAYOUT, SPACE_GAP } = ConstantConfig;

const MAX_CAPACITY = 1;

const Waiting = (props: ConquerWaitingProps) => {
	const { navigation, route } = props;
	const { resource, idleMode } = route.params;
	const isFocused = useIsFocused();
	const theme = useTheme();
	const [isParticipating, setIsParticipating] = useState(false);
	const [joinedRoom, setJoinedRoom] = useState<IRoom.Room | null>(null);
	const participateRef = useRef<boolean | null>(false);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();

	useEffect(() => {
		if (isFocused) {
			SoundManager.playSound('join.mp3');
		}

		return () => {
			participateRef.current = null;
		};
	}, [isFocused]);
	useEffect(() => {
		socketClient?.on(
			'conquer:server-client(participating)',
			(room: IRoom.Room, client: AccountState['profile']) => {
				setJoinedRoom(room);

				if (client._id === profile._id) {
					participateRef.current = false;
				}
			}
		);
		socketClient?.on('[ERROR]conquer:server-client(participating)', (error) => {
			setIsParticipating(false);
			openDialog({
				title: '[Ghép ngẫu nhiên] Lỗi',
				content: error,
			});
		});
		socketClient?.on('[ERROR]conquer:server-client(cancel-participating)', (error) => {
			setIsParticipating(true);
			openDialog({
				title: '[Hủy] Lỗi',
				content: error,
			});
		});

		socketClient?.on('conquer:server-client(prepare-participate)', (joinedRoom: IRoom.Room) => {
			navigation.navigate('Prepare', { resource, room: joinedRoom, idleMode });
			setIsParticipating(false);
		});
	}, []);
	const onPressParticipate = () => {
		if (participateRef.current === true) return;

		participateRef.current = true;

		if (isParticipating) {
			SoundManager.stopSound('waiting_bg.mp3');

			socketClient?.emit('conquer:client-server(cancel-participating)', {
				resource: resource._id,
				room: joinedRoom,
				client: profile,
			});
			setIsParticipating(false);
			return;
		}

		SoundManager.playSound('waiting_bg.mp3', { repeat: true });
		SoundManager.playSound('participate.mp3');
		socketClient?.emit('conquer:client-server(participating)', {
			resource: resource._id,
			room: { maxCapacity: MAX_CAPACITY },
			client: profile,
		});
		setIsParticipating(true);
	};
	const onPressFindRoom = () => {};
	return (
		<View style={[globalStyles.container, stackStyles.center]}>
			<Text variant="titleLarge">{resource.name}</Text>
			{idleMode === 'SINGLE' && (
				<Animated.View entering={FadeInUp}>
					<SingleWaiting animated={isParticipating} />
				</Animated.View>
			)}
			<Animated.View entering={StretchInX}>
				<Button
					mode="contained"
					loading={isParticipating}
					buttonColor={isParticipating ? theme.colors.error : theme.colors.primary}
					onPress={onPressParticipate}
					style={[{ width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE }]}
					soundName="button_click.mp3"
					icon={isParticipating ? 'cancel' : 'person-search'}
					iconColor={isParticipating ? theme.colors.onError : theme.colors.onPrimary}
				>
					{isParticipating ? `Hủy (${joinedRoom?.clients?.length ?? 0}/${MAX_CAPACITY})` : 'Ghép ngẫu nhiên'}
				</Button>
			</Animated.View>
			<Animated.View entering={StretchInX}>
				<Button
					mode="outlined"
					onPress={onPressFindRoom}
					style={[{ width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE }]}
					soundName="button_click.mp3"
					icon="search"
					iconColor={theme.colors.primary}
				>
					Tìm phòng
				</Button>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	gap: {
		marginBottom: SPACE_GAP,
	},
});

export default Waiting;
