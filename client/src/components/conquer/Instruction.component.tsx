import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { stackStyles } from '../../styles';

const { MAIN_LAYOUT } = ConstantConfig;

const Instruction = () => {
	const theme = useTheme();

	return (
		<View style={[styles.container, stackStyles.center, { borderColor: theme.colors.onSurface }]}>
			<Icon name="emoji-objects" size={50} color={theme.colors.tertiary} />
			<Text variant="labelMedium" style={[styles.text]}>
				Chọn 1 câu trả lời đúng trong các đáp án dưới nhé!
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderStyle: 'dashed',
		margin: MAIN_LAYOUT.SCREENS.CONQUER.INSTRUCTION.MARGIN,
		borderRadius: MAIN_LAYOUT.SCREENS.CONQUER.INSTRUCTION.BORDER_RADIUS,
	},
	text: {
		textAlign: 'center',
		paddingVertical: MAIN_LAYOUT.SCREENS.CONQUER.INSTRUCTION.PADDING_VERTICAL,
		paddingHorizontal: MAIN_LAYOUT.SCREENS.CONQUER.INSTRUCTION.PADDING_HORIZONTAL,
		fontWeight: 'bold',
	},
});

export default Instruction;
