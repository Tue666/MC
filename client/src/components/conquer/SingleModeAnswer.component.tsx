import { useEffect, useState } from 'react';
import { StyleSheet, Vibration, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SoundManager } from '../../audios';
import { ConstantConfig } from '../../configs';
import { useSocketClient } from '../../hooks';
import { globalStyles, stackStyles } from '../../styles';
import { ConquerQuickMatchProps, IQuestion, IRoom } from '../../types';
import { HelperUtil, openDialog, openModal } from '../../utils';
import { Box, Button, CountdownProgress, Instruction, MathContent } from '..';

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

export type State = 'IDLE' | 'CALCULATING_RESULTS';

interface SingleModeAnswerProps {
	navigation: ConquerQuickMatchProps['navigation'];
	route: ConquerQuickMatchProps['route'];
	isInAnswerTime: boolean;
	answerTime: number;
	isAllowedAnswer: boolean;
	firstRaisedHand: IRoom.Room['clients'][number] | null;
	question: IQuestion.Question;
}

const SingleModeAnswer = (props: SingleModeAnswerProps) => {
	const {
		navigation,
		route,
		isInAnswerTime,
		answerTime,
		isAllowedAnswer,
		firstRaisedHand,
		question,
	} = props;
	const { resource, room } = route.params;
	const { _id } = resource;
	const { type, description, values, answers } = question;
	const theme = useTheme();
	const [state, setState] = useState<State>('IDLE');
	const [answered, setAnswered] = useState<number[]>([]);
	const [isConfirmedAnswer, setIsConfirmedAnswer] = useState(false);
	const socketClient = useSocketClient();

	const buildSingleAnswered = (value: IQuestion.Question['values'][number]) => {
		return [value];
	};

	const buildMultipleAnswered = (value: IQuestion.Question['values'][number]) => {
		const answerExist = answered.indexOf(value) !== -1;

		if (answerExist) {
			return answered.filter((answer) => answer !== value);
		} else {
			return [...answered, value];
		}
	};

	const buildAnswered = (
		type: IQuestion.Question['type'],
		value: IQuestion.Question['values'][number]
	) => {
		const builder = {
			SINGLE: buildSingleAnswered,
			MULTIPLE: buildMultipleAnswered,
		};

		return builder[type](value);
	};

	useEffect(() => {
		socketClient?.on('conquer[quick-match]:server-client(selected-answer)', (data) => {
			const { question } = data;
			const { type, value } = question;

			const selectedAnswers = buildAnswered(type, value);
			setAnswered(selectedAnswers);
		});
		socketClient?.on('[ERROR]conquer[quick-match]:server-client(selected-answer)', (error) => {
			openDialog({
				title: 'Lỗi',
				content: error,
			});
		});

		socketClient?.on('conquer[quick-match]:server-client(submit-answers)', async (data) => {
			const { answered, client } = data;
			const { correctAnswers } = answered;

			const isWinner = correctAnswers.length === values.length;
			SoundManager.playSound(isWinner ? 'correct.mp3' : 'incorrect.mp3');
			Vibration.vibrate(VIBRATIONS[1]);
			setState('CALCULATING_RESULTS');
			await HelperUtil.sleep(CALCULATING_DELAY_TIME);

			if (isWinner) {
				SoundManager.playSound('won.mp3');
				openModal({
					closable: false,
					component: 'WINNER',
					params: {
						client,
						isWinner,
					},
				});
				return;
			}

			// Everyone loses
			navigation.navigate('Statistic', { client, isWinner });
		});
		socketClient?.on('[ERROR]conquer[quick-match]:server-client(submit-answers)', (error) => {
			openDialog({
				title: 'Lỗi',
				content: error,
			});
		});
	}, []);
	const onPressAnswer = (value: number) => {
		socketClient?.emit('conquer[quick-match]:client-server(selected-answer)', {
			room: {
				_id: room._id,
			},
			question: {
				type,
				value,
			},
		});
	};
	const onProcessResults = async () => {
		setIsConfirmedAnswer(true);
		if (!isAllowedAnswer) return;

		const correctAnswers = calculateAnswered(answered, values);

		socketClient?.emit('conquer[quick-match]:client-server(submit-answers)', {
			room: {
				resource: _id,
				_id: room._id,
			},
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

					return (
						<Box
							key={_id}
							onPress={() => onPressAnswer(value)}
							style={[styles.answer, globalStyles.fw, { backgroundColor: bgColor }]}
							soundName="button_click.mp3"
						>
							<MathContent content={content} style={[{ backgroundColor: bgColor }]} textColor={textColor} />
						</Box>
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
