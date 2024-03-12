import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../configs';
import { stackStyles } from '../styles';
import { openSnackbar } from '../utils';
import { TouchableBox } from '.';

const { BUTTON, SPACE_GAP } = ConstantConfig;

const NUMBER_REGEX = /^\d*$/;

const validateInput = (newInput: number, limit: number): boolean => {
	if (newInput < 1) return false;

	// Validate quantity before change
	let error = null;
	if (newInput > limit) {
		error = `Số lượng tối đa là ${limit}`;
	}

	if (error) {
		openSnackbar({
			content: error,
		});
		return false;
	}

	return true;
};

interface QuantityInputProps {
	limit: number;
	input: number;
	setInput: (newInput: number) => void;
}

const QuantityInput = (props: QuantityInputProps) => {
	const { limit, input, setInput } = props;
	const theme = useTheme();

	const prepareInput = (newInput: number): number | undefined => {
		const isOk = validateInput(newInput, limit);
		if (!isOk) return;

		return newInput;
	};
	const onChangeInput = (text?: string) => {
		// At least 1
		if (!text || text === '0') text = '1';

		// Must number
		if (!NUMBER_REGEX.test(text)) return;

		const value = parseInt(text);

		const preparedInput = prepareInput(value);
		if (!preparedInput) return;

		setInput(preparedInput);
	};
	const onClickButton = (sign: 1 | -1) => {
		const newInput = input + 1 * sign;

		const preparedInput = prepareInput(newInput);
		if (!preparedInput) return;

		setInput(preparedInput);
	};
	return (
		<View style={[stackStyles.row]}>
			<TouchableBox>
				<Icon
					name="remove"
					size={BUTTON.ICON_SIZE * 1.5}
					color={theme.colors.onSurface}
					onPress={() => onClickButton(-1)}
				/>
			</TouchableBox>
			<TextInput
				value={input.toString()}
				keyboardType="numeric"
				onChangeText={onChangeInput}
				style={[styles.input, { color: theme.colors.onSurface }]}
			/>
			<TouchableBox>
				<Icon
					name="add"
					size={BUTTON.ICON_SIZE * 1.5}
					color={theme.colors.onSurface}
					onPress={() => onClickButton(1)}
				/>
			</TouchableBox>
		</View>
	);
};

const styles = StyleSheet.create({
	input: {
		textAlign: 'center',
		marginHorizontal: SPACE_GAP / 2,
	},
});

export default QuantityInput;
