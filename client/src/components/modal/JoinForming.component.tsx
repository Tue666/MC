import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput as RNPTextInput, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { useSocketClient } from '../../hooks';
import { useAppSelector } from '../../redux/hooks';
import { selectAccount } from '../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../styles';
import { ConquerStackListParams, IRoom } from '../../types';
import { closeModal } from '../../utils';
import { Button, TextInput } from '..';

const { MODAL, SPACE_GAP } = ConstantConfig;

export interface JoinFormingProps
	extends Pick<ConquerStackListParams<'FindRoom'>, 'resource' | 'roomMode'> {
	_id?: IRoom.Room['_id'];
}

const JoinForming = (props: JoinFormingProps) => {
	const { resource, roomMode, _id } = props;
	const theme = useTheme();
	const [roomId, setRoomId] = useState(_id || '');
	const [password, setPassword] = useState('');
	const [hiddenPassword, setHiddenPassword] = useState(true);
	const { profile } = useAppSelector(selectAccount);
	const { socketClient } = useSocketClient();

	const onChangeRoomId = (text: string) => {
		setRoomId(text);
	};
	const onChangePassword = (text: string) => {
		setPassword(text);
	};
	const onPressJoin = () => {
		if (!roomId) return;
		if (_id && !password) return;

		socketClient?.emit('conquer:client-server(forming)', {
			mode: roomMode,
			resource: resource._id,
			room: {
				_id: roomId,
				password: _id ? password : undefined,
			},
			client: profile,
		});
	};
	const onTogglePasswordVisibility = () => {
		setHiddenPassword(!hiddenPassword);
	};
	const onPressCancel = () => {
		closeModal();
	};
	return (
		<View style={[styles.container, globalStyles.paper, globalStyles.shadow, stackStyles.center]}>
			<Text variant="labelMedium" style={[styles.gap]}>
				Nhập ID phòng để vào nhanh:
			</Text>
			<TextInput
				disabled={!!_id}
				label="Nhập ID phòng"
				mode="outlined"
				multiline
				dense
				value={roomId}
				onChangeText={onChangeRoomId}
				left={
					<RNPTextInput.Icon
						icon={() => <Icon name="pin" size={MODAL.JOIN_FORMING.ICON_SIZE} color={theme.colors.onSurface} />}
					/>
				}
				style={[styles.gap]}
			/>
			{_id && (
				<>
					<Text variant="labelMedium" style={[styles.gap]}>
						Nhập mật khẩu để vào phòng:
					</Text>
					<TextInput
						label="Nhập mật khẩu"
						mode="outlined"
						multiline
						dense
						value={password}
						onChangeText={onChangePassword}
						secureTextEntry={hiddenPassword}
						left={
							<RNPTextInput.Icon
								icon={() => <Icon name="lock" size={MODAL.JOIN_FORMING.ICON_SIZE} color={theme.colors.onSurface} />}
							/>
						}
						right={
							<RNPTextInput.Icon
								icon={() => (
									<Icon
										name={hiddenPassword ? 'visibility' : 'visibility-off'}
										size={MODAL.JOIN_FORMING.ICON_SIZE}
										color={theme.colors.onSurface}
									/>
								)}
								onPress={onTogglePasswordVisibility}
							/>
						}
						style={[styles.gap]}
					/>
				</>
			)}
			<View style={[stackStyles.row]}>
				<Button
					mode="outlined"
					onPress={onPressCancel}
					style={[globalStyles.container, { margin: SPACE_GAP }]}
					soundName="button_click.mp3"
				>
					Hủy
				</Button>
				<Button
					mode="contained"
					onPress={onPressJoin}
					style={[globalStyles.container, { margin: SPACE_GAP }]}
					soundName="button_click.mp3"
				>
					Vào
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: MODAL.JOIN_FORMING.WIDTH,
		padding: MODAL.JOIN_FORMING.PADDING,
		borderRadius: MODAL.JOIN_FORMING.BORDER_RADIUS,
	},
	gap: {
		marginBottom: SPACE_GAP,
	},
});

export default JoinForming;
