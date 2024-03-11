import { useCallback, useEffect, useRef, useState } from 'react';
import { Vibration, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeInUp, StretchInX } from 'react-native-reanimated';
import { SoundManager } from '../../../audios';
import { Button, SingleWaiting } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useSocketClient } from '../../../hooks';
import { useAppSelector } from '../../../redux/hooks';
import { AccountState, selectAccount } from '../../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../../styles';
import { ConquerPreparingProps, IRoom } from '../../../types';
import { openDialog } from '../../../utils';

const { MAIN_LAYOUT, VIBRATIONS } = ConstantConfig;

const MAX_PREPARING_TIME = 15;

const Preparing = (props: ConquerPreparingProps) => {
	const { navigation, route } = props;
	const { resource, room: joinedRoom, roomMode, idleMode } = route.params;
	const theme = useTheme();
	const [isPrepared, setIsPrepared] = useState(false);
	const [preparedCount, setPreparedCount] = useState(0);
	const [allPrepared, setAllPrepared] = useState(false);
	const prepareRef = useRef<boolean | null>(false);
	const countdownExpiredRef = useRef<boolean | null>(false);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();

	useEffect(() => {
		SoundManager.playSound('prepare.mp3');
		Vibration.vibrate(VIBRATIONS[1]);

		return () => {
			prepareRef.current = null;
			countdownExpiredRef.current = null;
		};
	}, []);
	useEffect(() => {
		const onPreparingEvent = (room: IRoom.Room, client: AccountState['profile']) => {
			const { clients } = room;

			const preparedCount = clients.filter((client) => client.prepared).length;
			setPreparedCount(preparedCount);

			if (client._id === profile._id) {
				prepareRef.current = false;
			}
		};
		socketClient?.on('conquer:server-client(preparing)', onPreparingEvent);

		const onErrorPreparingEvent = (error: string) => {
			openDialog({
				title: '[Sẵn sàng] Lỗi',
				content: error,
			});
		};
		socketClient?.on('[ERROR]conquer:server-client(preparing)', onErrorPreparingEvent);

		const onStartLoadingQuestionEvent = (room: IRoom.Room) => {
			if (countdownExpiredRef.current) return;

			setAllPrepared(true);
			SoundManager.stopSound('waiting_bg.mp3');
			navigation.navigate('LoadingQuestion', { resource, room, roomMode });
		};
		socketClient?.on('conquer:server-client(start-loading-question)', onStartLoadingQuestionEvent);

		return () => {
			socketClient?.off('conquer:server-client(preparing)', onPreparingEvent);
			socketClient?.off('[ERROR]conquer:server-client(preparing)', onErrorPreparingEvent);
			socketClient?.off('conquer:server-client(start-loading-question)', onStartLoadingQuestionEvent);
		};
	}, []);
	const onCountdownComplete = useCallback(() => {
		countdownExpiredRef.current = true;

		SoundManager.stopSound('waiting_bg.mp3');
		navigation.goBack();

		if (!isPrepared) {
			socketClient?.emit('conquer:client-server(timeout-preparing)', {
				mode: roomMode,
				resource: resource._id,
				room: joinedRoom,
			});
		}
	}, []);
	const onPressPrepare = () => {
		if (prepareRef.current === true) return;

		prepareRef.current = true;

		if (!isPrepared) {
			SoundManager.playSound('prepare.mp3');
		}

		socketClient?.emit('conquer:client-server(preparing)', {
			mode: roomMode,
			resource: resource._id,
			room: joinedRoom,
			client: {
				...profile,
				prepared: !isPrepared,
			},
		});

		setIsPrepared(!isPrepared);
	};
	return (
		<View style={[globalStyles.container, stackStyles.center]}>
			<Text variant="titleLarge">{resource.name}</Text>
			{idleMode === 'SINGLE' && !allPrepared && (
				<Animated.View entering={FadeInUp}>
					<SingleWaiting
						avatar={profile.avatar}
						animated={true}
						duration={MAX_PREPARING_TIME}
						onComplete={onCountdownComplete}
					/>
				</Animated.View>
			)}
			<Animated.View entering={StretchInX}>
				<Button
					mode="contained"
					loading={isPrepared}
					buttonColor={isPrepared ? theme.colors.error : theme.colors.primary}
					onPress={onPressPrepare}
					style={[{ width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE }]}
					soundName="button_click.mp3"
					icon={isPrepared ? 'cancel' : 'design-services'}
					iconColor={isPrepared ? theme.colors.onError : theme.colors.onPrimary}
				>
					{`${isPrepared ? 'Hủy' : 'Sẵn sàng'} (${preparedCount}/${joinedRoom.clients.length})`}
				</Button>
			</Animated.View>
		</View>
	);
};

export default Preparing;
