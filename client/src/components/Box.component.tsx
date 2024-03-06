import { View, ViewProps } from 'react-native';
import { ConstantConfig } from '../configs';
import { globalStyles } from '../styles';

const { BOX } = ConstantConfig;

interface BoxProps extends ViewProps {}

const Box = (props: BoxProps) => {
	const { children, style, ...rest } = props;

	return (
		<View
			style={[globalStyles.paper, globalStyles.shadow, { borderRadius: BOX.BORDER_RADIUS }, style]}
			{...rest}
		>
			{children}
		</View>
	);
};

export default Box;
