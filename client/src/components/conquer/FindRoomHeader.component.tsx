import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SoundManager } from '../../audios';
import { ConstantConfig } from '../../configs';
import { useSocketClient } from '../../hooks';
import { onCreateForming, onQuickJoinForming } from '../../screens/main/conquer/FindRoom.screen';
import { globalStyles, stackStyles } from '../../styles';
import { ConquerFindRoomProps } from '../../types';
import { openDialog } from '../../utils';

const { ROOM, MAIN_LAYOUT } = ConstantConfig;

const FindRoomHeader = (props: ConquerFindRoomProps) => {
	const { route } = props;
	const { resource, roomMode, idleMode, minToStart, maxCapacity } = route.params;
	const theme = useTheme();
	const { socketClient } = useSocketClient();

	useEffect(() => {
		const onErrorRefreshFormingEvent = (error: string) => {
			openDialog({
				title: '[Làm mới phòng] Lỗi',
				content: error,
			});
		};
		socketClient?.on('[ERROR]conquer:server-client(refresh-forming)', onErrorRefreshFormingEvent);

		return () => {
			socketClient?.off('[ERROR]conquer:server-client(refresh-forming)', onErrorRefreshFormingEvent);
		};
	}, []);
	const onPressQuickJoinForming = () => {
		SoundManager.playSound('button_click.mp3');
		onQuickJoinForming({
			resource,
			roomMode,
		});
	};
	const onPressCreateForming = () => {
		SoundManager.playSound('button_click.mp3');
		onCreateForming({
			resource,
			roomMode,
			idleMode,
			minToStart,
			maxCapacity,
		});
	};
	const onPressRefresh = () => {
		SoundManager.playSound('button_click.mp3');
		socketClient?.emit('conquer:client-server(refresh-forming)', {
			mode: ROOM.MODE.normal,
			resource: resource._id,
		});
	};
	return (
		<View style={[styles.container, globalStyles.fw, stackStyles.row]}>
			<Text variant="titleMedium">Tìm phòng</Text>
			<View style={[stackStyles.row]}>
				<IconButton
					icon={() => (
						<Icon
							name="pageview"
							size={MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.HEADER.ICON_SIZE}
							color={theme.colors.onSurface}
						/>
					)}
					onPress={onPressQuickJoinForming}
					style={[styles.icon]}
				/>
				<IconButton
					icon={() => (
						<Icon
							name="add"
							size={MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.HEADER.ICON_SIZE}
							color={theme.colors.onSurface}
						/>
					)}
					onPress={onPressCreateForming}
					style={[styles.icon]}
				/>
				<IconButton
					icon={() => (
						<Icon
							name="refresh"
							size={MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.HEADER.ICON_SIZE}
							color={theme.colors.onSurface}
						/>
					)}
					onPress={onPressRefresh}
					style={[styles.icon]}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'space-between',
	},
	icon: {
		marginLeft: MAIN_LAYOUT.SCREENS.CONQUER.FIND_ROOM.MARGIN / 5,
	},
});

export default FindRoomHeader;
