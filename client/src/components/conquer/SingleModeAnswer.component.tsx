import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Vibration, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SoundManager } from '../../audios';
import { ConstantConfig } from '../../configs';
import { useSocketClient } from '../../hooks';
import { globalStyles, stackStyles } from '../../styles';
import { ConquerQuickMatchProps, IMatch, IQuestion, IRoom } from '../../types';
import { HelperUtil, openDialog, openModal } from '../../utils';
import { Button, Instruction, MathContent, TouchableBox } from '..';

const { MAIN_LAYOUT, VIBRATIONS } = ConstantConfig;

const CALCULATING_DELAY_TIME = 2000;

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

interface SelectedAnswer {
	question: {
		type: IQuestion.Question['type'];
		value: IQuestion.Question['values'][number];
	};
}

export type State = 'IDLE' | 'VIEW_RESULTS';

export interface SingleModeAnswerHandleRef {
	processResults: () => void;
}

interface SingleModeAnswerProps {
	navigation: ConquerQuickMatchProps['navigation'];
	route: ConquerQuickMatchProps['route'];
	question: IQuestion.Question;
	clientId: IRoom.Room['clients'][number]['_id'];
	raisedHandId?: IRoom.Room['firstRaisedHand'];
	onChangePlayingCountdown: (playing: boolean) => void;
}

const SingleModeAnswer = forwardRef<SingleModeAnswerHandleRef, SingleModeAnswerProps>(
	(props, ref) => {
		const { navigation, route, question, clientId, raisedHandId, onChangePlayingCountdown } = props;
		const isAllowedAnswer = raisedHandId && clientId === raisedHandId;
		const { resource, room, roomMode } = route.params;
		const { type, description, values, answers } = question;
		const theme = useTheme();
		const confirmedAnswer = useRef<boolean | null>(false);
		const [state, setState] = useState<State>('IDLE');
		const [answered, setAnswered] = useState<number[]>([]);
		const { socketClient } = useSocketClient();

		const buildColorAnswer = (value: IQuestion.Question['values'][number]) => {
			let bgColor = globalStyles.paper.backgroundColor;
			let textColor = theme.colors.onSurface;

			const choseAnswer = answered.indexOf(value) !== -1;
			if (choseAnswer && state === 'IDLE') {
				bgColor = theme.colors.primary;
				textColor = theme.colors.onPrimary;
			}
			if (state === 'VIEW_RESULTS') {
				const isClientAnswerCorrect = values.indexOf(value) !== -1;
				if (isClientAnswerCorrect) {
					bgColor = theme.colors.secondary;
					textColor = theme.colors.onSecondary;
				} else if (choseAnswer) {
					bgColor = theme.colors.error;
					textColor = theme.colors.onError;
				}
			}

			return { bgColor, textColor };
		};

		useImperativeHandle(ref, () => ({
			processResults() {
				onProcessResults();
			},
		}));
		useEffect(() => {
			const onStopCountdownAnswerEvent = () => {
				onChangePlayingCountdown(false);
			};
			socketClient?.on(
				'conquer[quick-match]:server-client(stop-countdown-answer)',
				onStopCountdownAnswerEvent
			);

			const onSubmitAnswersEvent = async (match: IMatch.Match) => {
				const { clients } = match;

				const client = clients.find((client) => client._id === clientId);
				if (!client) return;

				const isClientAnswerCorrect = client?.state === 'WIN';

				setState('VIEW_RESULTS');
				Vibration.vibrate(VIBRATIONS[1]);
				SoundManager.playSound(isClientAnswerCorrect ? 'correct.mp3' : 'incorrect.mp3');
				await HelperUtil.sleep(CALCULATING_DELAY_TIME);

				if (isClientAnswerCorrect) {
					SoundManager.playSound('won.mp3');
					openModal<'WINNER'>({
						closable: false,
						component: 'WINNER',
						params: {
							client,
							isClientAnswerCorrect,
							match,
							room,
						},
					});
					return;
				}

				navigation.navigate('Statistic', { client, isClientAnswerCorrect, match, room });
			};
			socketClient?.on('conquer[quick-match]:server-client(submit-answers)', onSubmitAnswersEvent);

			const onErrorSubmitAnswersEvent = (error: string) => {
				openDialog({
					title: '[Kiểm tra đáp án] Lỗi',
					content: error,
				});
			};
			socketClient?.on(
				'[ERROR]conquer[quick-match]:server-client(submit-answers)',
				onErrorSubmitAnswersEvent
			);

			return () => {
				socketClient?.off(
					'conquer[quick-match]:server-client(stop-countdown-answer)',
					onStopCountdownAnswerEvent
				);
				socketClient?.off('conquer[quick-match]:server-client(submit-answers)', onSubmitAnswersEvent);
				socketClient?.off(
					'[ERROR]conquer[quick-match]:server-client(submit-answers)',
					onErrorSubmitAnswersEvent
				);
			};
		}, []);
		useEffect(() => {
			const onSelectedAnswerEvent = (data: SelectedAnswer) => {
				const { question } = data;
				const { type, value } = question;

				const selectedAnswers = buildAnswered(type, value, answered);
				setAnswered(selectedAnswers);
			};
			socketClient?.on('conquer[quick-match]:server-client(selected-answer)', onSelectedAnswerEvent);

			const onErrorSelectedAnswerEvent = (error: string) => {
				openDialog({
					title: '[Chọn đáp án] Lỗi',
					content: error,
				});
			};
			socketClient?.on(
				'[ERROR]conquer[quick-match]:server-client(selected-answer)',
				onErrorSelectedAnswerEvent
			);

			return () => {
				confirmedAnswer.current = null;

				socketClient?.off('conquer[quick-match]:server-client(selected-answer)', onSelectedAnswerEvent);
				socketClient?.off(
					'[ERROR]conquer[quick-match]:server-client(selected-answer)',
					onErrorSelectedAnswerEvent
				);
			};
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
			if (confirmedAnswer.current) return;

			confirmedAnswer.current = true;
			socketClient?.emit('conquer[quick-match]:client-server(submit-answers)', {
				mode: roomMode,
				resource: resource._id,
				room,
				answered,
				raisedHandId,
			});
		};
		return (
			<View>
				<View pointerEvents={isAllowedAnswer ? 'auto' : 'none'} style={[stackStyles.rowWrap]}>
					{description && <Instruction description={description} />}
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
						disabled={answered.length <= 0 || confirmedAnswer.current === true}
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
	}
);

const styles = StyleSheet.create({
	answer: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.ANSWER_BOX.PADDING,
		margin: MAIN_LAYOUT.SCREENS.CONQUER.ANSWER_BOX.MARGIN,
	},
});

export default SingleModeAnswer;
