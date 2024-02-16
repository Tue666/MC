import { View } from 'react-native';
import { Button } from 'react-native-paper';
import useAuthentication from '../../hooks/useAuthentication.hook';

const Account = () => {
	const { signOut } = useAuthentication();

	return (
		<View>
			<Button mode="contained" onPress={signOut}>
				Đăng Xuất
			</Button>
		</View>
	);
};

export default Account;
