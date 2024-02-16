import { Image, StyleSheet } from 'react-native';
import { LOGO } from '../configs/constant';

const Logo = () => {
	return <Image style={styles.container} source={require('../assets/logo.png')} />;
};

const styles = StyleSheet.create({
	container: {
		width: LOGO.SIZE,
		height: LOGO.SIZE,
	},
});

export default Logo;
