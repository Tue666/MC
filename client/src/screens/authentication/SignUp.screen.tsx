import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput as RNPTextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { TextInput } from '../../components';
import { ConstantConfig, FormValidationConfig } from '../../configs';
import { useAuthentication } from '../../hooks';
import { useGlobalStyles, useStackStyles, useTypographyStyles } from '../../styles';
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
	const globalStyles = useGlobalStyles();
	const stackStyles = useStackStyles();
	const typographyStyles = useTypographyStyles();
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
					content: `[Đăng ký] Đã có lỗi xảy ra: ${(error as AxiosError).response?.data}`,
					actions: [{ label: 'Đồng ý' }],
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
		<View style={{ ...styles.container }}>
			<Text variant="titleLarge" style={{ ...typographyStyles.highlight, ...styles.gap }}>
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
				outerStyle={{ ...styles.gap }}
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
						icon={() => <Icon name="visibility" size={AUTHENTICATION_LAYOUT.TEXT_INPUT.ICON_SIZE} />}
						onPress={onTogglePasswordVisibility}
					/>
				}
				outerStyle={{ ...styles.gap }}
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
						icon={() => <Icon name="visibility" size={AUTHENTICATION_LAYOUT.TEXT_INPUT.ICON_SIZE} />}
						onPress={onTogglePasswordConfirmVisibility}
					/>
				}
				outerStyle={{ ...styles.gap }}
			/>
			<View style={{ ...styles.gap }} />
			<Button
				mode="contained"
				loading={isSubmitting}
				disabled={isSubmitting}
				onPress={onPressSignUp}
				style={{ ...globalStyles.fw, ...styles.gap }}
			>
				Đăng Ký
			</Button>
			<View style={{ ...stackStyles.row }}>
				<Text variant="labelSmall">Đã có tài khoản? </Text>
				<TouchableOpacity onPress={onPressSignIn}>
					<Text variant="labelMedium" style={{ ...typographyStyles.highlight }}>
						Đăng Nhập
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
