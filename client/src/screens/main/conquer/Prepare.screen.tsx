import { useEffect, useRef, useState } from 'react';
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
import { ConquerPrepareProps, IRoom } from '../../../types';
import { openDialog } from '../../../utils';

const { MAIN_LAYOUT, VIBRATIONS } = ConstantConfig;

const Prepare = (props: ConquerPrepareProps) => {
	const { navigation, route } = props;
	const { resource, room: joinedRoom, idleMode } = route.params;
	const theme = useTheme();
	const [isPrepared, setIsPrepared] = useState(false);
	const [preparedCount, setPreparedCount] = useState(0);
	const prepareRef = useRef<boolean | null>(false);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();

	useEffect(() => {
		SoundManager.playSound('prepare.mp3');
		Vibration.vibrate(VIBRATIONS[1]);

		return () => {
			prepareRef.current = null;
		};
	}, []);
	useEffect(() => {
		socketClient?.on(
			'conquer:server-client(prepare-participate)',
			(room: IRoom.Room, client: AccountState['profile']) => {
				const { clients } = room;

				const preparedCount = clients.filter((client) => client.prepared).length;
				setPreparedCount(preparedCount);

				if (client._id === profile._id) {
					prepareRef.current = false;
				}
			}
		);
		socketClient?.on('[ERROR]conquer:server-client(prepare-participate)', (error) => {
			openDialog({
				title: '[Sẵn sàng] Lỗi',
				content: error,
			});
		});

		socketClient?.on('conquer:server-client(start-participate)', (room: IRoom.Room) => {
			SoundManager.stopSound('waiting_bg.mp3');
			navigation.navigate('QuickMatch', { resource, room });
		});
	}, []);
	const onPressPrepare = () => {
		if (prepareRef.current === true) return;

		prepareRef.current = true;

		if (!isPrepared) {
			SoundManager.playSound('prepare.mp3');
		}

		socketClient?.emit('conquer:client-server(prepare-participate)', {
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
			{idleMode === 'SINGLE' && (
				<Animated.View entering={FadeInUp}>
					<SingleWaiting animated={isPrepared} />
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
					icon={isPrepared ? 'cancel' : 'person-search'}
					iconColor={isPrepared ? theme.colors.onError : theme.colors.onPrimary}
				>
					{`${isPrepared ? 'Hủy' : 'Sẵn sàng'} (${preparedCount}/${joinedRoom.clients.length})`}
				</Button>
			</Animated.View>
		</View>
	);
};

export default Prepare;
