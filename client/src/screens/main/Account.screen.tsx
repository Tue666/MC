import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuthentication } from '../../hooks';

const Account = () => {
	const { signOut } = useAuthentication();

	return (
		<View>
			<Button mode="contained" onPress={signOut}>
				Đăng xuất
			</Button>
		</View>
	);
};

export default Account;
