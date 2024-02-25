import { View } from 'react-native';
import {
	HelperText,
	TextInput as RNPTextInput,
	TextInputProps as RNPTextInputProps,
} from 'react-native-paper';
import { useGlobalStyles } from '../../styles';

interface TextInputProps extends RNPTextInputProps {
	outerStyle?: Object;
	helperText?: string | boolean;
}

const TextInput = (props: TextInputProps) => {
	const { outerStyle = {}, helperText, ...rest } = props;
	const globalStyles = useGlobalStyles();

	return (
		<View style={{ ...globalStyles.fw, ...outerStyle }}>
			<RNPTextInput {...rest} />
			{helperText && <HelperText type="error">{helperText}</HelperText>}
		</View>
	);
};

export default TextInput;
