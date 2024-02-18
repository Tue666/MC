import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput as RNPTextInput } from 'react-native-paper';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IAccount, AuthenticationSignInProps } from '../../types';
import { TextInput } from '../../components/overrides';
import useGlobalStyles from '../../styles/global.style';
import useStackStyles from '../../styles/stack.style';
import useTypographyStyles from '../../styles/typography.style';
import { AUTHENTICATION_LAYOUT, SPACE_GAP } from '../../configs/constant';
import { signInValidation } from '../../configs/form-validations';
import useAuthentication from '../../hooks/useAuthentication.hook';
import { openDialog } from '../../utils/dialog.util';

const SignIn = ({ navigation }: AuthenticationSignInProps) => {
	const globalStyles = useGlobalStyles();
	const stackStyles = useStackStyles();
	const typographyStyles = useTypographyStyles();
	const { signIn } = useAuthentication();
	const [hiddenPassword, setHiddenPassword] = useState(true);
	const formik = useFormik<IAccount.SignInBody>({
		initialValues: {
			phone_number: '',
			password: '',
		},
		validationSchema: signInValidation,
		onSubmit: async (values, { resetForm }) => {
			try {
				await signIn(values, (error) => {
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
					content: `[Đăng nhập] Đã có lỗi xảy ra: ${(error as AxiosError).response?.data}`,
					actions: [{ label: 'Đồng ý' }],
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
		<View style={{ ...styles.container }}>
			<Text variant="titleLarge" style={{ ...typographyStyles.highlight, ...styles.gap }}>
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
						icon={() => (
							<Icon
								name={hiddenPassword ? 'visibility' : 'visibility-off'}
								size={AUTHENTICATION_LAYOUT.TEXT_INPUT.ICON_SIZE}
							/>
						)}
						onPress={onTogglePasswordVisibility}
					/>
				}
				outerStyle={{ ...styles.gap }}
			/>
			<View style={{ alignItems: 'flex-end', ...globalStyles.fw, ...styles.gap }}>
				<TouchableOpacity>
					<Text variant="labelSmall" style={{ color: 'gray' }}>
						Quên mật khẩu?
					</Text>
				</TouchableOpacity>
			</View>
			<Button
				mode="contained"
				loading={isSubmitting}
				disabled={isSubmitting}
				onPress={onPressSignIn}
				style={{ ...globalStyles.fw, ...styles.gap }}
			>
				Đăng Nhập
			</Button>
			<View style={{ ...stackStyles.row }}>
				<Text variant="labelSmall">Chưa có tài khoản? </Text>
				<TouchableOpacity onPress={onPressSignUp}>
					<Text variant="labelMedium" style={{ ...typographyStyles.highlight }}>
						Đăng Ký
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
