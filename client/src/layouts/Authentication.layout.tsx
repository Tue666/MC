import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Logo } from '../components';
import { AUTHENTICATION_LAYOUT } from '../configs/constant';
import useGlobalStyles from '../styles/global.style';

const AuthenticationLayout = (props: PropsWithChildren) => {
	const { children } = props;
	const globalStyles = useGlobalStyles();

	return (
		<View style={{ ...styles.container, ...globalStyles.paper }}>
			<Logo />
			<View style={{ ...globalStyles.fw }}>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: AUTHENTICATION_LAYOUT.PADDING,
	},
});

export default AuthenticationLayout;
