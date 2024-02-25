import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, Vibration, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SoundManager } from '../../audios';
import { ConstantConfig } from '../../configs';
import { useSocketClient } from '../../hooks';
import { useGlobalStyles, useStackStyles } from '../../styles';
import { ConquerFastHandEyesProps, IAccount, IQuestion, IRoom } from '../../types';
import { HelperUtil, openDialog, openModal } from '../../utils';
import { CountdownProgress } from '..';

const { MAIN_LAYOUT, SPACE_GAP, VIBRATIONS } = ConstantConfig;

const TIMER = 600;
const CALCULATING_DELAY_TIME = 3000;
const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2;

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

export type State = 'ANSWERING' | 'CALCULATING_RESULTS';

interface AnswerProps {
	navigation: ConquerFastHandEyesProps['navigation'];
	route: ConquerFastHandEyesProps['route'];
	allowedAnswer: boolean;
	firstRaisedHand: IRoom.Room['clients'][number] | null;
	question: Pick<IQuestion.Question, 'type' | 'values' | 'answers'>;
}

const Answer = (props: AnswerProps) => {
	const { navigation, route, allowedAnswer, firstRaisedHand, question } = props;
	const { room, _id } = route.params;
	const { type, values, answers } = question;
	const theme = useTheme();
	const [state, setState] = useState<State>('ANSWERING');
	const [answered, setAnswered] = useState<number[]>([]);
	const socketClient = useSocketClient();
	const globalStyles = useGlobalStyles();
	const stackStyles = useStackStyles();

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
		socketClient?.on('conquer[fast-hand-eyes]:server-client(selected-answer)', (data) => {
			const { question } = data;
			const { type, value } = question;

			const selectedAnswers = buildAnswered(type, value);
			setAnswered(selectedAnswers);
		});
		socketClient?.on('[ERROR]conquer[fast-hand-eyes]:server-client(selected-answer)', (error) => {
			openDialog({
				title: 'Lỗi',
				content: error,
			});
		});

		socketClient?.on('conquer[fast-hand-eyes]:server-client(submit-answers)', async (data) => {
			const { answered, client } = data;
			const { correctAnswers } = answered;

			const isWinner = correctAnswers.length === values.length;
			SoundManager.playSound(isWinner ? 'correct.mp3' : 'incorrect.mp3');
			Vibration.vibrate(VIBRATIONS[1]);
			setState('CALCULATING_RESULTS');
			await HelperUtil.sleep(CALCULATING_DELAY_TIME);

			if (isWinner) {
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
		socketClient?.on('[ERROR]conquer[fast-hand-eyes]:server-client(submit-answers)', (error) => {
			openDialog({
				title: 'Lỗi',
				content: error,
			});
		});
	}, []);
	const onPressAnswer = (value: number) => {
		socketClient?.emit('conquer[fast-hand-eyes]:client-server(selected-answer)', {
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
		const correctAnswers = calculateAnswered(answered, values);

		socketClient?.emit('conquer[fast-hand-eyes]:client-server(submit-answers)', {
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
			{allowedAnswer && <CountdownProgress timer={TIMER} onExpired={onProcessResults} />}
			<View
				pointerEvents={allowedAnswer ? 'auto' : 'none'}
				style={{
					...stackStyles.rowWrap,
					opacity: allowedAnswer ? 1 : 0.5,
				}}
			>
				{answers.map((answer) => {
					const { _id, value, content } = answer;
					const answerWidth =
						(CONTAINER_WIDTH -
							MAIN_LAYOUT.SCREENS.CONQUER.ANSWER_BOX.MARGIN *
								2 *
								MAIN_LAYOUT.SCREENS.CONQUER.ANSWER_BOX.NUMBER_IN_ROW) *
						(1 / MAIN_LAYOUT.SCREENS.CONQUER.ANSWER_BOX.NUMBER_IN_ROW);

					let bgColor = globalStyles.paper.backgroundColor;
					let textColor = theme.colors.onSurface;
					const choseAnswer = answered.indexOf(value) !== -1;
					if (choseAnswer && state === 'ANSWERING') {
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
						<TouchableOpacity
							key={_id}
							onPress={() => onPressAnswer(value)}
							style={{
								...styles.answer,
								...stackStyles.center,
								backgroundColor: bgColor,
								width: answerWidth,
							}}
						>
							<Text style={{ color: textColor }}>{content}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
			{allowedAnswer && (
				<TouchableOpacity onPress={onProcessResults} style={{ ...styles.gap }}>
					<Button
						disabled={answered.length <= 0 || state === 'CALCULATING_RESULTS'}
						mode="contained"
						buttonColor={theme.colors.primary}
						icon={() => <Icon name="done-all" size={20} color={theme.colors.onPrimary} />}
					>
						{`Kiểm Tra`}
					</Button>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	answer: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.ANSWER_BOX.PADDING,
		borderRadius: MAIN_LAYOUT.SCREENS.CONQUER.ANSWER_BOX.BORDER_RADIUS,
		margin: MAIN_LAYOUT.SCREENS.CONQUER.ANSWER_BOX.MARGIN,
	},
	gap: {
		marginVertical: SPACE_GAP,
	},
});

export default Answer;
