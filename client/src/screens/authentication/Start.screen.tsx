import { StyleSheet, View } from 'react-native';
import { Button, Paragraph, Text } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { useGlobalStyles, useTypographyStyles } from '../../styles';
import { AuthenticationStartProps } from '../../types';

const { SPACE_GAP } = ConstantConfig;

const Start = (props: AuthenticationStartProps) => {
	const { navigation } = props;
	const globalStyles = useGlobalStyles();
	const typographyStyles = useTypographyStyles();

	const onPressSignIn = () => {
		navigation.navigate('SignIn');
	};
	const onPressSignUp = () => {
		navigation.navigate('SignUp');
	};
	return (
		<View style={{ ...styles.container }}>
			<Text variant="headlineMedium" style={{ ...typographyStyles.highlight, ...styles.gap }}>
				Conquer Math
			</Text>
			<Paragraph style={{ textAlign: 'center', ...styles.gap }}>
				The easiest way to start with your amazing application.
			</Paragraph>
			<Button mode="contained" onPress={onPressSignIn} style={{ ...globalStyles.fw, ...styles.gap }}>
				Đăng Nhập
			</Button>
			<Button mode="outlined" onPress={onPressSignUp} style={{ ...globalStyles.fw, ...styles.gap }}>
				Đăng Ký
			</Button>
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

export default Start;
