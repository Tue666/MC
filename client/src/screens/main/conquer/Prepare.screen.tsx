import { useEffect, useState } from 'react';
import { StyleSheet, Vibration, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SoundManager } from '../../../audios';
import { Button, SingleWaiting } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useSocketClient } from '../../../hooks';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { useStackStyles } from '../../../styles';
import { ConquerPrepareProps, IRoom } from '../../../types';
import { openDialog } from '../../../utils';

const { MAIN_LAYOUT, VIBRATIONS } = ConstantConfig;

const Prepare = (props: ConquerPrepareProps) => {
	const { navigation, route } = props;
	const { room: joinedRoom, _id, name, idleMode } = route.params;
	const theme = useTheme();
	const [isPrepared, setIsPrepared] = useState(false);
	const [clientPreparedCount, setClientPreparedCount] = useState(0);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();
	const stackStyles = useStackStyles();

	useEffect(() => {
		SoundManager.playSound('prepare.mp3');
		Vibration.vibrate(VIBRATIONS[1]);
	}, []);
	useEffect(() => {
		socketClient?.on('conquer:server-client(prepare-participate)', (room: IRoom.Room) => {
			const { clients } = room;

			const preparedCount = clients.filter((client) => client.prepared).length;
			setClientPreparedCount(preparedCount);
		});
		socketClient?.on('[ERROR]conquer:server-client(prepare-participate)', (error) => {
			openDialog({
				title: 'Lỗi',
				content: error,
			});
		});

		socketClient?.on('conquer:server-client(start-participate)', (room: IRoom.Room) => {
			SoundManager.stopSound('waiting_bg.mp3');
			navigation.navigate('QuickMatch', { room, _id });
		});
	}, []);
	const onPressPrepare = () => {
		if (!isPrepared) {
			SoundManager.playSound('prepare.mp3');
		}

		const room = {
			resource: _id,
			_id: joinedRoom._id,
		};
		const client = {
			_id: profile._id,
			prepared: !isPrepared,
		};

		socketClient?.emit('conquer:client-server(prepare-participate)', { room, client });

		setIsPrepared(!isPrepared);
	};
	return (
		<View style={{ ...styles.container, ...stackStyles.center }}>
			<Text variant="titleLarge">{name}</Text>
			{idleMode === 'SINGLE' && <SingleWaiting />}
			<Button
				mode="contained"
				loading={isPrepared}
				buttonColor={isPrepared ? theme.colors.error : theme.colors.primary}
				onPress={onPressPrepare}
				style={{ width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE }}
				soundName="button_click.mp3"
				icon={isPrepared ? 'cancel' : 'person-search'}
				iconColor={isPrepared ? theme.colors.onError : theme.colors.onPrimary}
			>
				{`${isPrepared ? 'Hủy' : 'Sẵn sàng'} (${clientPreparedCount}/${joinedRoom.clients.length})`}
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default Prepare;
