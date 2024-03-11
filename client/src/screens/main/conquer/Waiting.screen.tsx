import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
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

const { MAIN_LAYOUT, ROOM } = ConstantConfig;

const DEFAULT_MAX_CAPACITY = 3;
const MAX_WAITING_TIME = 300;

const Waiting = (props: ConquerWaitingProps) => {
	const { navigation, route } = props;
	const { resource, idleMode } = route.params;
	const isFocused = useIsFocused();
	const theme = useTheme();
	const [isMatching, setIsMatching] = useState(false);
	const [joinedRoom, setJoinedRoom] = useState<IRoom.Room | null>(null);
	const matchingRef = useRef<boolean | null>(false);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();

	useEffect(() => {
		if (isFocused) {
			SoundManager.playSound('join.mp3');
		}

		return () => {
			matchingRef.current = null;
		};
	}, [isFocused]);
	useEffect(() => {
		const onMatchingEvent = (room: IRoom.Room, client: AccountState['profile']) => {
			setJoinedRoom(room);

			if (client._id === profile._id) {
				matchingRef.current = false;
			}
		};
		socketClient?.on('conquer:server-client(matching)', onMatchingEvent);

		const onErrorMatchingEvent = (error: string) => {
			SoundManager.stopSound('waiting_bg.mp3');
			setIsMatching(false);
			openDialog({
				title: '[Ghép ngẫu nhiên] Lỗi',
				content: error,
			});
		};
		socketClient?.on('[ERROR]conquer:server-client(matching)', onErrorMatchingEvent);

		const onErrorCancelMatchingEvent = (error: string) => {
			setIsMatching(true);
			openDialog({
				title: '[Hủy] Lỗi',
				content: error,
			});
		};
		socketClient?.on('[ERROR]conquer:server-client(cancel-matching)', onErrorCancelMatchingEvent);

		const onStartPreparingEvent = (joinedRoom: IRoom.Room) => {
			setIsMatching(false);
			navigation.navigate('Preparing', {
				resource,
				room: joinedRoom,
				roomMode: ROOM.MODE.auto,
				idleMode,
			});
		};
		socketClient?.on('conquer:server-client(start-preparing)', onStartPreparingEvent);

		return () => {
			socketClient?.off('conquer:server-client(matching)', onMatchingEvent);
			socketClient?.off('[ERROR]conquer:server-client(matching)', onErrorMatchingEvent);
			socketClient?.off('[ERROR]conquer:server-client(cancel-matching)', onErrorCancelMatchingEvent);
			socketClient?.off('conquer:server-client(start-preparing)', onStartPreparingEvent);
		};
	}, []);
	const onCountdownComplete = () => {
		onPressAutoMatching();
	};
	const onPressAutoMatching = () => {
		if (matchingRef.current === true) return;

		matchingRef.current = true;

		if (isMatching) {
			SoundManager.stopSound('waiting_bg.mp3');

			socketClient?.emit('conquer:client-server(cancel-matching)', {
				mode: ROOM.MODE.auto,
				resource: resource._id,
				room: joinedRoom,
				client: profile,
			});
			setIsMatching(false);
			return;
		}

		SoundManager.playSound('waiting_bg.mp3', { repeat: true });
		SoundManager.playSound('matching.mp3');
		socketClient?.emit('conquer:client-server(matching)', {
			mode: ROOM.MODE.auto,
			resource: resource._id,
			room: { maxCapacity: DEFAULT_MAX_CAPACITY },
			client: profile,
		});
		setIsMatching(true);
	};
	const onPressFindRoom = () => {
		navigation.navigate('FindRoom', {
			resource,
			roomMode: ROOM.MODE.normal,
			idleMode,
			maxCapacity: DEFAULT_MAX_CAPACITY,
		});

		socketClient?.emit('conquer:client-server(find-forming)', {
			mode: ROOM.MODE.normal,
			resource: resource._id,
		});
	};
	return (
		<View style={[globalStyles.container, stackStyles.center]}>
			<Text variant="titleLarge">{resource.name}</Text>
			{idleMode === 'SINGLE' && (
				<Animated.View entering={FadeInUp}>
					<SingleWaiting
						avatar={profile.avatar}
						animated={isMatching}
						duration={MAX_WAITING_TIME}
						onComplete={onCountdownComplete}
					/>
				</Animated.View>
			)}
			<Animated.View entering={StretchInX}>
				<Button
					mode="contained"
					loading={isMatching}
					buttonColor={isMatching ? theme.colors.error : theme.colors.primary}
					onPress={onPressAutoMatching}
					style={[{ width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE }]}
					soundName="button_click.mp3"
					icon={isMatching ? 'cancel' : 'person-search'}
					iconColor={isMatching ? theme.colors.onError : theme.colors.onPrimary}
				>
					{isMatching
						? `Hủy (${joinedRoom?.clients?.length ?? 0}/${joinedRoom?.maxCapacity})`
						: 'Ghép ngẫu nhiên'}
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

export default Waiting;
