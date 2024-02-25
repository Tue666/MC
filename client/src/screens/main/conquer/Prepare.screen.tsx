import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Vibration, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
			navigation.navigate('FastHandEyes', { room, _id });
		});
	}, []);
	const onPressPrepare = () => {
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
			<Text variant="titleLarge">
				{clientPreparedCount}/{joinedRoom.clients.length}
			</Text>
			<Button
				loading={isPrepared}
				mode="contained"
				buttonColor={isPrepared ? theme.colors.error : theme.colors.primary}
				icon={() => (
					<Icon
						name={isPrepared ? 'cancel' : 'person-search'}
						size={20}
						color={isPrepared ? theme.colors.onError : theme.colors.onPrimary}
					/>
				)}
				soundName="button_click.mp3"
				outerProps={{
					onPress: onPressPrepare,
					style: { ...styles.button, width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE },
				}}
			>
				{isPrepared ? `Hủy` : 'Sẵn Sàng'}
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	button: {
		marginTop: 10,
	},
});

export default Prepare;
