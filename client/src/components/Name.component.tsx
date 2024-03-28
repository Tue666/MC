import { View } from 'react-native';
import { Text, TextProps } from 'react-native-paper';

interface NameProps extends TextProps<never> {}

const Name = (props: NameProps) => {
	const { children } = props;

	return (
		<View>
			<Text variant="titleSmall" style={[{ fontWeight: 'bold' }]}>
				{children}
			</Text>
		</View>
	);
};

export default Name;
