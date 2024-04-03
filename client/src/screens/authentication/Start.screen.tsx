import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from '../../components';
import { ConstantConfig } from '../../configs';
import { typographyStyles } from '../../styles';
import { AuthenticationStartProps } from '../../types';

const { APP_NAME, APP_DESCRIPTION, SPACE_GAP } = ConstantConfig;

const Start = (props: AuthenticationStartProps) => {
	const { navigation } = props;

	const onPressSignIn = () => {
		navigation.navigate('SignIn');
	};
	const onPressSignUp = () => {
		navigation.navigate('SignUp');
	};
	return (
		<View style={[styles.container]}>
			<Text variant="headlineMedium" style={[styles.gap, typographyStyles.highlight]}>
				{APP_NAME}
			</Text>
			<Text style={[styles.gap, { textAlign: 'center' }]}>{APP_DESCRIPTION}</Text>
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
