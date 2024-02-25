import { Image, StyleSheet } from 'react-native';
import { ConstantConfig } from '../configs';

const { LOGO } = ConstantConfig;

const Logo = () => {
	return <Image style={styles.container} source={require('../assets/images/logo.png')} />;
};

const styles = StyleSheet.create({
	container: {
		width: LOGO.SIZE,
		height: LOGO.SIZE,
	},
});

export default Logo;
