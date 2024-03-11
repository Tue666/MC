import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, TextInput as RNPTextInput, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { ConstantConfig } from '../../configs';
import { createFormingValidation } from '../../configs/form-validation';
import { useSocketClient } from '../../hooks';
import { useAppSelector } from '../../redux/hooks';
import { Resources, selectAccount } from '../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../styles';
import {
	ConquerIdleMode,
	ConquerStackList,
	ConquerStackListParams,
	IRoom,
	ISchema,
} from '../../types';
import { closeModal, openDialog } from '../../utils';
import { Button, TextInput } from '..';

const { MODAL, SPACE_GAP } = ConstantConfig;

export interface CreateFormingProps extends ConquerStackListParams<'FindRoom'> {}

const CreateForming = (props: CreateFormingProps) => {
	const { resource, roomMode, idleMode, maxCapacity } = props;
	const navigation = useNavigation<StackNavigationProp<ConquerStackList>>();
	const theme = useTheme();
	const [hasPassword, setHasPassword] = useState(false);
	const [hiddenPassword, setHiddenPassword] = useState(true);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();
	const formik = useFormik({
		initialValues: {
			name: '',
			description: '',
			maxCapacity,
			password: undefined,
		},
		validationSchema: createFormingValidation(maxCapacity),
		onSubmit: async (values, { resetForm }) => {
			try {
				if (!hasPassword) values.password = undefined;

				socketClient?.emit('conquer:client-server(forming)', {
					mode: roomMode,
					resource: resource._id,
					room: values,
					client: profile,
				});
			} catch (error) {
				resetForm();
				openDialog({
					title: '[Tạo phòng] Lỗi',
					content: `${(error as AxiosError).response?.data}`,
				});
			}
		},
	});
	const { values, touched, errors, isSubmitting, handleSubmit, handleChange } = formik;

	useEffect(() => {
		const onOutRoomFormingEvent = (room: IRoom.Room) => {
			closeModal();
			navigation.navigate('Forming', { resource, room, roomMode, idleMode, maxCapacity });
		};
		socketClient?.on('conquer:server-client(out-room-forming)', onOutRoomFormingEvent);

		const onErrorFormingEvent = (error: string) => {
			openDialog({
				title: '[Tìm phòng] Lỗi',
				content: error,
			});
		};
		socketClient?.on('[ERROR]conquer:server-client(forming)', onErrorFormingEvent);

		return () => {
			socketClient?.off('conquer:server-client(out-room-forming)', onOutRoomFormingEvent);
			socketClient?.off('[ERROR]conquer:server-client(forming)', onErrorFormingEvent);
		};
	}, []);
	const onPressCreate = () => {
		handleSubmit();
	};
	const onPressCancel = () => {
		closeModal();
	};
	const onSetPassword = () => {
		setHasPassword(!hasPassword);
	};
	const onTogglePasswordVisibility = () => {
		setHiddenPassword(!hiddenPassword);
	};
	return (
		<View style={[styles.container, globalStyles.paper, globalStyles.shadow, stackStyles.center]}>
			<Text variant="titleLarge">Tạo phòng</Text>
			<TextInput
				label="Tên phòng"
				mode="outlined"
				dense
				value={values.name}
				onChangeText={handleChange('name')}
				error={Boolean(touched.name && errors.name)}
				helperText={touched.name && errors.name}
				left={
					<RNPTextInput.Icon
						icon={() => (
							<Icon name="dns" size={MODAL.CREATE_FORMING.ICON_SIZE} color={theme.colors.onSurface} />
						)}
					/>
				}
				style={[styles.gap]}
			/>
			<TextInput
				label="Mô tả phòng"
				mode="outlined"
				multiline
				dense
				value={values.description}
				onChangeText={handleChange('description')}
				error={Boolean(touched.description && errors.description)}
				helperText={touched.description && errors.description}
				left={
					<RNPTextInput.Icon
						icon={() => (
							<Icon name="description" size={MODAL.CREATE_FORMING.ICON_SIZE} color={theme.colors.onSurface} />
						)}
					/>
				}
				style={[styles.gap]}
			/>
			<TextInput
				label="Số lượng thành viên"
				mode="outlined"
				multiline
				dense
				value={values.maxCapacity.toString()}
				onChangeText={handleChange('maxCapacity')}
				error={Boolean(touched.maxCapacity && errors.maxCapacity)}
				helperText={touched.maxCapacity && errors.maxCapacity}
				left={
					<RNPTextInput.Icon
						icon={() => (
							<Icon
								name="format-list-numbered-rtl"
								size={MODAL.CREATE_FORMING.ICON_SIZE}
								color={theme.colors.onSurface}
							/>
						)}
					/>
				}
				style={[styles.gap]}
			/>
			<View style={[stackStyles.row]}>
				<IconButton
					icon={() => (
						<Icon
							name={hasPassword ? 'check-box' : 'check-box-outline-blank'}
							size={MODAL.CREATE_FORMING.ICON_SIZE}
							color={theme.colors.onSurface}
						/>
					)}
					onPress={onSetPassword}
				/>
				<Text variant="titleSmall">Đặt mật khẩu phòng</Text>
			</View>
			{hasPassword && (
				<TextInput
					label="Mật khẩu phòng"
					mode="outlined"
					dense
					value={values.password}
					onChangeText={handleChange('password')}
					error={Boolean(touched.password && errors.password)}
					helperText={touched.password && errors.password}
					secureTextEntry={hiddenPassword}
					left={
						<RNPTextInput.Icon
							icon={() => (
								<Icon name="lock" size={MODAL.CREATE_FORMING.ICON_SIZE} color={theme.colors.onSurface} />
							)}
						/>
					}
					right={
						<RNPTextInput.Icon
							icon={() => (
								<Icon
									name={hiddenPassword ? 'visibility' : 'visibility-off'}
									size={MODAL.CREATE_FORMING.ICON_SIZE}
									color={theme.colors.onSurface}
									onPress={onTogglePasswordVisibility}
								/>
							)}
						/>
					}
					style={[styles.gap]}
				/>
			)}
			<View style={[stackStyles.row]}>
				<Button
					mode="outlined"
					onPress={onPressCancel}
					style={[{ flex: 1, margin: SPACE_GAP }]}
					soundName="button_click.mp3"
				>
					Hủy
				</Button>
				<Button
					mode="contained"
					loading={isSubmitting}
					disabled={isSubmitting}
					onPress={onPressCreate}
					style={[{ flex: 1, margin: SPACE_GAP }]}
					soundName="button_click.mp3"
				>
					Tạo
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: MODAL.CREATE_FORMING.WIDTH,
		padding: MODAL.CREATE_FORMING.PADDING,
		borderRadius: MODAL.CREATE_FORMING.BORDER_RADIUS,
	},
	gap: {
		marginBottom: SPACE_GAP,
	},
});

export default CreateForming;
