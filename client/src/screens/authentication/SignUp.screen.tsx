import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput as RNPTextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { Button, TextInput } from '../../components';
import { ConstantConfig, FormValidationConfig } from '../../configs';
import { useAuthentication } from '../../hooks';
import { stackStyles, typographyStyles } from '../../styles';
import { IAccount, AuthenticationSignUpProps } from '../../types';
import { openDialog, openSnackbar } from '../../utils';

const { AUTHENTICATION_LAYOUT, SPACE_GAP } = ConstantConfig;
const { signUpValidation } = FormValidationConfig;

const SignUp = (props: AuthenticationSignUpProps) => {
	const { navigation } = props;
	const theme = useTheme();
	const [hiddenPassword, setHiddenPassword] = useState(true);
	const [hiddenPasswordConfirm, setHiddenPasswordConfirm] = useState(true);
	const { signUp } = useAuthentication();
	const formik = useFormik<IAccount.SignUpBody>({
		initialValues: {
			phone_number: '',
			password: '',
			passwordConfirm: '',
		},
		validationSchema: signUpValidation,
		onSubmit: async (values, { resetForm }) => {
			try {
				await signUp(values, (_, error) => {
					if (error) {
						resetForm();
						openDialog({
							content: error,
							actions: [{ label: 'Đồng ý' }],
						});
						return;
					}

					openSnackbar({
						content: 'Đăng ký tài khoản thành công',
						color: theme.colors.secondary,
					});
					navigation.navigate('SignIn');
				});
			} catch (error) {
				resetForm();
				openDialog({
					title: '[Đăng ký] Lỗi',
					content: `${(error as AxiosError).response?.data}`,
				});
			}
		},
	});
	const { values, touched, errors, isSubmitting, handleSubmit, handleChange } = formik;

	const onPressSignUp = () => {
		handleSubmit();
	};
	const onPressSignIn = () => {
		navigation.navigate('SignIn');
	};
	const onTogglePasswordVisibility = () => {
		setHiddenPassword(!hiddenPassword);
	};
	const onTogglePasswordConfirmVisibility = () => {
		setHiddenPasswordConfirm(!hiddenPasswordConfirm);
	};
	return (
		<View style={[styles.container]}>
			<Text variant="titleLarge" style={[styles.gap, typographyStyles.highlight]}>
				Tạo Tài Khoản
			</Text>
			<TextInput
				label="Số điện thoại"
				mode="outlined"
				dense
				value={values.phone_number}
				onChangeText={handleChange('phone_number')}
				error={Boolean(touched.phone_number && errors.phone_number)}
				helperText={touched.phone_number && errors.phone_number}
				left={
					<RNPTextInput.Icon
						icon={() => <Icon name="person" size={AUTHENTICATION_LAYOUT.TEXT_INPUT.ICON_SIZE} />}
					/>
				}
				style={[styles.gap]}
			/>
			<TextInput
				label="Mật khẩu"
				mode="outlined"
				dense
				value={values.password}
				onChangeText={handleChange('password')}
				error={Boolean(touched.password && errors.password)}
				helperText={touched.password && errors.password}
				secureTextEntry={hiddenPassword}
				left={
					<RNPTextInput.Icon
						icon={() => <Icon name="lock" size={AUTHENTICATION_LAYOUT.TEXT_INPUT.ICON_SIZE} />}
					/>
				}
				right={
					<RNPTextInput.Icon
						icon={() => (
							<Icon
								name={hiddenPassword ? 'visibility' : 'visibility-off'}
								size={AUTHENTICATION_LAYOUT.TEXT_INPUT.ICON_SIZE}
							/>
						)}
						onPress={onTogglePasswordVisibility}
					/>
				}
				style={[styles.gap]}
			/>
			<TextInput
				label="Nhập lại mật khẩu"
				mode="outlined"
				dense
				value={values.passwordConfirm}
				onChangeText={handleChange('passwordConfirm')}
				error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
				helperText={touched.passwordConfirm && errors.passwordConfirm}
				secureTextEntry={hiddenPasswordConfirm}
				left={
					<RNPTextInput.Icon
						icon={() => <Icon name="lock-reset" size={AUTHENTICATION_LAYOUT.TEXT_INPUT.ICON_SIZE} />}
					/>
				}
				right={
					<RNPTextInput.Icon
						icon={() => (
							<Icon
								name={hiddenPasswordConfirm ? 'visibility' : 'visibility-off'}
								size={AUTHENTICATION_LAYOUT.TEXT_INPUT.ICON_SIZE}
							/>
						)}
						onPress={onTogglePasswordConfirmVisibility}
					/>
				}
				style={[styles.gap]}
			/>
			<View style={[styles.gap]} />
			<Button
				mode="contained"
				loading={isSubmitting}
				disabled={isSubmitting}
				onPress={onPressSignUp}
				soundName="button_click.mp3"
			>
				Đăng ký
			</Button>
			<View style={[stackStyles.row]}>
				<Text variant="labelSmall">Đã có tài khoản? </Text>
				<TouchableOpacity onPress={onPressSignIn}>
					<Text variant="labelMedium" style={[typographyStyles.highlight]}>
						Đăng nhập
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
	},
	gap: {
		marginBottom: SPACE_GAP,
	},
});

export default SignUp;
