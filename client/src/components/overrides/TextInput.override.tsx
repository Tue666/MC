import { View } from 'react-native';
import {
	HelperText,
	TextInput as RNPTextInput,
	TextInputProps as RNPTextInputProps,
} from 'react-native-paper';
import { useGlobalStyles } from '../../styles';

interface TextInputProps extends RNPTextInputProps {
	innerStyle?: RNPTextInputProps['style'];
	helperText?: string | boolean;
}

const TextInput = (props: TextInputProps) => {
	const { innerStyle, helperText, style, ...rest } = props;
	const globalStyles = useGlobalStyles();

	return (
		<View style={Object.assign({ ...globalStyles.fw }, style)}>
			<RNPTextInput style={innerStyle} {...rest} />
			{helperText && <HelperText type="error">{helperText}</HelperText>}
		</View>
	);
};

export default TextInput;
