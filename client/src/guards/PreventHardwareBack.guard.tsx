import { PropsWithChildren, useEffect } from 'react';
import { BackHandler } from 'react-native';

const PreventHardwareBackGuard = (props: PropsWithChildren) => {
	const { children } = props;

	useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

		return () => backHandler.remove();
	}, []);
	return children;
};

export default PreventHardwareBackGuard;
