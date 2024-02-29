import { View } from 'react-native';
import {
	HelperText,
	TextInput as RNPTextInput,
	TextInputProps as RNPTextInputProps,
} from 'react-native-paper';
import { globalStyles } from '../../styles';

interface TextInputProps extends RNPTextInputProps {
	innerStyle?: RNPTextInputProps['style'];
	helperText?: string | boolean;
}

const TextInput = (props: TextInputProps) => {
	const { innerStyle, helperText, style, ...rest } = props;

	return (
		<View style={[globalStyles.fw, style]}>
			<RNPTextInput style={innerStyle} {...rest} />
			{helperText && <HelperText type="error">{helperText}</HelperText>}
		</View>
	);
};

export default TextInput;
