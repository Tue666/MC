import { useEffect, useState } from 'react';
import { StyleSheet, Vibration, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SoundManager } from '../../audios';
import { ConstantConfig } from '../../configs';
import { useSocketClient } from '../../hooks';
import { globalStyles, stackStyles } from '../../styles';
import { ConquerQuickMatchProps, IQuestion, IRoom } from '../../types';
import { HelperUtil, openDialog, openModal } from '../../utils';
import { Button, CountdownProgress, Instruction, MathContent, TouchableBox } from '..';

const { MAIN_LAYOUT, VIBRATIONS } = ConstantConfig;

const CALCULATING_DELAY_TIME = 2500;

const calculateAnswered = (
	answered: IQuestion.Question['values'],
	values: IQuestion.Question['values']
) => {
	const correctAnswers = [];

	for (let i = 0; i < answered.length; i++) {
		const answer = answered[i];
		const isCorrect = values.indexOf(answer) !== -1;
		if (isCorrect) correctAnswers.push(answer);
		else correctAnswers.pop();
	}

	return correctAnswers;
};

const buildSingleAnswered = (
	value: IQuestion.Question['values'][number],
	answered: IQuestion.Question['values']
) => {
	return [value];
};

const buildMultipleAnswered = (
	value: IQuestion.Question['values'][number],
	answered: IQuestion.Question['values']
) => {
	const answerExist = answered.indexOf(value) !== -1;

	if (answerExist) {
		return answered.filter((answer) => answer !== value);
	}

	return [...answered, value];
};

const buildAnswered = (
	type: IQuestion.Question['type'],
	value: IQuestion.Question['values'][number],
	answered: IQuestion.Question['values']
) => {
	const builder = {
		SINGLE: buildSingleAnswered,
		MULTIPLE: buildMultipleAnswered,
	};

	return builder[type](value, answered);
};

export type State = 'IDLE' | 'CALCULATING_RESULTS';

interface SingleModeAnswerProps {
	navigation: ConquerQuickMatchProps['navigation'];
	route: ConquerQuickMatchProps['route'];
	answerTime: number;
	question: IQuestion.Question;
	firstRaisedHand: IRoom.Room['clients'][number] | null;
	isInAnswerTime: boolean;
	isAllowedAnswer: boolean;
}

const SingleModeAnswer = (props: SingleModeAnswerProps) => {
	const {
		navigation,
		route,
		answerTime,
		question,
		firstRaisedHand,
		isInAnswerTime,
		isAllowedAnswer,
	} = props;
	const { resource, room, roomMode } = route.params;
	const { type, description, values, answers } = question;
	const theme = useTheme();
	const [state, setState] = useState<State>('IDLE');
	const [answered, setAnswered] = useState<number[]>([]);
	const [isConfirmedAnswer, setIsConfirmedAnswer] = useState(false);
	const socketClient = useSocketClient();

	const buildColorAnswer = (value: IQuestion.Question['values'][number]) => {
		let bgColor = globalStyles.paper.backgroundColor;
		let textColor = theme.colors.onSurface;

		const choseAnswer = answered.indexOf(value) !== -1;
		if (choseAnswer && state === 'IDLE') {
			bgColor = theme.colors.primary;
			textColor = theme.colors.onPrimary;
		}
		if (state === 'CALCULATING_RESULTS') {
			const isCorrect = values.indexOf(value) !== -1;
			if (isCorrect) {
				bgColor = theme.colors.secondary;
				textColor = theme.colors.onSecondary;
			} else if (choseAnswer) {
				bgColor = theme.colors.error;
				textColor = theme.colors.onError;
			}
		}

		return { bgColor, textColor };
	};

	useEffect(() => {
		socketClient?.on('conquer[quick-match]:server-client(selected-answer)', (data) => {
			const { question } = data;
			const { type, value } = question;

			const selectedAnswers = buildAnswered(type, value, answered);
			setAnswered(selectedAnswers);
		});
		socketClient?.on('[ERROR]conquer[quick-match]:server-client(selected-answer)', (error) => {
			openDialog({
				title: '[Chọn đáp án] Lỗi',
				content: error,
			});
		});

		socketClient?.on('conquer[quick-match]:server-client(submit-answers)', async (data) => {
			const { answered, client } = data;
			const { correctAnswers } = answered;

			if (!isConfirmedAnswer) {
				setIsConfirmedAnswer(true);
			}

			const isCorrect = correctAnswers.length === values.length;
			Vibration.vibrate(VIBRATIONS[1]);
			SoundManager.playSound(isCorrect ? 'correct.mp3' : 'incorrect.mp3');

			setState('CALCULATING_RESULTS');
			await HelperUtil.sleep(CALCULATING_DELAY_TIME);

			if (isCorrect) {
				SoundManager.playSound('won.mp3');
				openModal<'WINNER'>({
					closable: false,
					component: 'WINNER',
					params: {
						client,
						isCorrect,
					},
				});
				return;
			}

			navigation.navigate('Statistic', { client, isCorrect });
		});
		socketClient?.on('[ERROR]conquer[quick-match]:server-client(submit-answers)', (error) => {
			openDialog({
				title: '[Kiểm tra đáp án] Lỗi',
				content: error,
			});
		});
	}, []);
	const onPressAnswer = (value: number) => {
		socketClient?.emit('conquer[quick-match]:client-server(selected-answer)', {
			room,
			question: {
				type,
				value,
			},
		});
	};
	const onProcessResults = async () => {
		if (!isAllowedAnswer) return;

		setIsConfirmedAnswer(true);

		const correctAnswers = calculateAnswered(answered, values);

		socketClient?.emit('conquer[quick-match]:client-server(submit-answers)', {
			mode: roomMode,
			resource: resource._id,
			room,
			answered: {
				correctAnswers,
			},
			client: firstRaisedHand,
		});
	};
	return (
		<View>
			{isInAnswerTime && !isConfirmedAnswer && (
				<CountdownProgress timer={answerTime} onExpired={onProcessResults} />
			)}
			<View pointerEvents={isAllowedAnswer ? 'auto' : 'none'} style={[stackStyles.rowWrap]}>
				{description && <Instruction />}
				{answers.map((answer) => {
					const { _id, value, content } = answer;
					const { bgColor, textColor } = buildColorAnswer(value);

					return (
						<TouchableBox
							key={_id}
							onPress={() => onPressAnswer(value)}
							style={[styles.answer, globalStyles.fw, { backgroundColor: bgColor }]}
							soundName="button_click.mp3"
						>
							<MathContent content={content} style={[{ backgroundColor: bgColor }]} textColor={textColor} />
						</TouchableBox>
					);
				})}
			</View>
			{isAllowedAnswer && (
				<Button
					mode="contained"
					disabled={answered.length <= 0 || state === 'CALCULATING_RESULTS'}
					buttonColor={theme.colors.primary}
					onPress={onProcessResults}
					soundName="button_click.mp3"
					icon="done-all"
				>
					Kiểm tra
				</Button>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	answer: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.ANSWER_BOX.PADDING,
		margin: MAIN_LAYOUT.SCREENS.CONQUER.ANSWER_BOX.MARGIN,
	},
});

export default SingleModeAnswer;
