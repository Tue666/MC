import { StyleSheet, View } from 'react-native';
import { ConstantConfig } from '../../configs';
import { globalStyles } from '../../styles';
import { IQuestion } from '../../types';
import { MathContent } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

interface SingleModeQuestionProps {
	content: IQuestion.Question['content'];
}

const SingleModeQuestion = (props: SingleModeQuestionProps) => {
	const { content } = props;

	return (
		<View style={[styles.question, globalStyles.paper, globalStyles.shadow]}>
			<MathContent content={content} style={[globalStyles.paper]} />
		</View>
	);
};

const styles = StyleSheet.create({
	question: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.QUESTION_BOX.PADDING,
		borderRadius: MAIN_LAYOUT.SCREENS.CONQUER.QUESTION_BOX.BORDER_RADIUS,
		marginBottom: MAIN_LAYOUT.SCREENS.CONQUER.QUESTION_BOX.MARGIN_BOTTOM,
	},
});

export default SingleModeQuestion;
