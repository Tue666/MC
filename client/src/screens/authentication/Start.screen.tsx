import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from '../../components';
import { ConstantConfig } from '../../configs';
import { useTypographyStyles } from '../../styles';
import { AuthenticationStartProps } from '../../types';

const { SPACE_GAP } = ConstantConfig;

const Start = (props: AuthenticationStartProps) => {
	const { navigation } = props;
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
			<Text style={{ textAlign: 'center', ...styles.gap }}>
				The easiest way to start with your amazing application.
			</Text>
			<Button mode="contained" onPress={onPressSignIn} soundName="button_click.mp3">
				Đăng nhập
			</Button>
			<Button mode="outlined" onPress={onPressSignUp} soundName="button_click.mp3">
				Đăng ký
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
