import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput as RNPTextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { Button, TextInput } from '../../components';
import { ConstantConfig, FormValidationConfig } from '../../configs';
import { useAuthentication } from '../../hooks';
import { globalStyles, stackStyles, typographyStyles } from '../../styles';
import { IAccount, AuthenticationSignInProps } from '../../types';
import { openDialog } from '../../utils';

const { AUTHENTICATION_LAYOUT, SPACE_GAP } = ConstantConfig;
const { signInValidation } = FormValidationConfig;

const SignIn = (props: AuthenticationSignInProps) => {
	const { navigation } = props;
	const [hiddenPassword, setHiddenPassword] = useState(true);
	const { signIn } = useAuthentication();
	const formik = useFormik<IAccount.SignInBody>({
		initialValues: {
			phone_number: '',
			password: '',
		},
		validationSchema: signInValidation,
		onSubmit: async (values, { resetForm }) => {
			try {
				await signIn(values, (_, error) => {
					if (error) {
						resetForm();
						openDialog({
							content: error,
							actions: [{ label: 'Đồng ý' }],
						});
						return;
					}
				});
			} catch (error) {
				resetForm();
				openDialog({
					title: '[Đăng nhập] Lỗi',
					content: `${(error as AxiosError).response?.data}`,
				});
			}
		},
	});
	const { values, touched, errors, isSubmitting, handleSubmit, handleChange } = formik;

	const onPressSignIn = () => {
		handleSubmit();
	};
	const onPressSignUp = () => {
		navigation.navigate('SignUp');
	};
	const onTogglePasswordVisibility = () => {
		setHiddenPassword(!hiddenPassword);
	};
	return (
		<View style={[styles.container]}>
			<Text variant="titleLarge" style={[styles.gap, typographyStyles.highlight]}>
				Xin Chào!
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
			<View style={[styles.gap, globalStyles.fw, { alignItems: 'flex-end' }]}>
				<TouchableOpacity>
					<Text variant="labelSmall" style={[{ color: 'gray' }]}>
						Quên mật khẩu?
					</Text>
				</TouchableOpacity>
			</View>
			<Button
				mode="contained"
				loading={isSubmitting}
				disabled={isSubmitting}
				onPress={onPressSignIn}
				soundName="button_click.mp3"
			>
				Đăng nhập
			</Button>
			<View style={[stackStyles.row]}>
				<Text variant="labelSmall">Chưa có tài khoản? </Text>
				<TouchableOpacity onPress={onPressSignUp}>
					<Text variant="labelMedium" style={[typographyStyles.highlight]}>
						Đăng ký
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

export default SignIn;
