import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Logo } from '../components';
import { ConstantConfig } from '../configs';
import { globalStyles, stackStyles } from '../styles';

const { AUTHENTICATION_LAYOUT } = ConstantConfig;

const AuthenticationLayout = (props: PropsWithChildren) => {
	const { children } = props;

	return (
		<View style={[styles.container, globalStyles.container, globalStyles.paper, stackStyles.center]}>
			<Logo />
			<View style={[globalStyles.fw]}>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: AUTHENTICATION_LAYOUT.PADDING,
	},
});

export default AuthenticationLayout;
