import { View } from 'react-native';
import { Text, TextProps } from 'react-native-paper';
import { typographyStyles } from '../styles';

interface NameProps extends TextProps<never> {}

const Name = (props: NameProps) => {
	const { variant = 'labelSmall', numberOfLines = 1, children, style, ...rest } = props;

	return (
		<View>
			<Text
				variant={variant}
				numberOfLines={numberOfLines}
				style={[typographyStyles.bold, style]}
				{...rest}
			>
				{children}
			</Text>
		</View>
	);
};

export default Name;
