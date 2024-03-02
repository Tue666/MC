import { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AxiosError } from 'axios';
import { QuestionAPI } from '../../../../apis';
import { SoundManager } from '../../../../audios';
import {
	CircleBorder,
	CountdownTimer,
	Loading,
	SingleModeAnswer,
	SingleModeQuestion,
} from '../../../../components';
import { ConstantConfig } from '../../../../configs';
import { useSocketClient } from '../../../../hooks';
import { useAppSelector } from '../../../../redux/hooks';
import { selectAccount } from '../../../../redux/slices/account.slice';
import { stackStyles } from '../../../../styles';
import { ConquerQuickMatchProps, IQuestion, IRoom } from '../../../../types';
import { openDialog } from '../../../../utils';

const { MAIN_LAYOUT } = ConstantConfig;

const COUNT_DOWN_TIME = 10;
const ANSWER_TIME = 10;
const IN_ANSWER_TEXT = 'Đang trả lời...';

export type State = 'IN_COUNTDOWN_TIME' | 'IN_RAISE_HAND_TIME' | 'IN_ANSWER_TIME';

const QuickMatch = (props: ConquerQuickMatchProps) => {
	const { navigation, route } = props;
	const { resource, room: joinedRoom } = route.params;
	const theme = useTheme();
	const raiseHandRef = useRef<boolean | null>(false);
	const scrollViewRef = useRef<ScrollView | null>(null);
	const [state, setState] = useState<State>('IN_COUNTDOWN_TIME');
	const [question, setQuestion] = useState<IQuestion.Question | null>(null);
	const [firstRaisedHand, setFirstRaisedHand] = useState<IRoom.Room['clients'][number] | null>(null);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();

	useEffect(() => {
		SoundManager.playSound('quick_match_bg.mp3', { repeat: true });

		const findByRandom = async () => {
			try {
				const { questions, error } = await QuestionAPI.findByRandom();
				if (error) {
					openDialog({
						title: '[Tìm câu hỏi] Lỗi',
						content: error,
					});
					return;
				}

				if (!questions.length) {
					openDialog({
						title: '[Tìm câu hỏi] Lỗi',
						content: `Không tìm thấy câu hỏi nào!`,
					});
					return;
				}

				setQuestion(questions[0]);
			} catch (error) {
				openDialog({
					title: '[Tìm câu hỏi] Lỗi',
					content: `${(error as AxiosError).response?.data}`,
				});
			}
		};

		findByRandom();

		return () => {
			raiseHandRef.current = null;
			scrollViewRef.current = null;
		};
	}, []);
	useEffect(() => {
		socketClient?.on(
			'conquer[quick-match]:server-client(raise-hand)',
			(client: IRoom.Room['clients'][number]) => {
				SoundManager.playSound('bell.mp3');
				setFirstRaisedHand(client);
				setState('IN_ANSWER_TIME');
				scrollViewRef.current?.scrollToEnd();
			}
		);
		socketClient?.on('[ERROR]conquer[quick-match]:server-client(raise-hand)', (error) => {
			openDialog({
				title: '[Giơ tay] Lỗi',
				content: error,
			});
		});
	}, []);
	const onCountdownExpired = () => {
		setState('IN_RAISE_HAND_TIME');
	};
	const onPressRaiseHand = () => {
		if (raiseHandRef.current) return;

		raiseHandRef.current = true;

		socketClient?.emit('conquer[quick-match]:client-server(raise-hand)', {
			resource: resource._id,
			room: joinedRoom,
			client: profile,
		});
	};

	if (!question) return <Loading />;

	return (
		<View style={[stackStyles.center]}>
			<ScrollView ref={scrollViewRef}>
				<SingleModeQuestion content={question.content} />
				<View style={[stackStyles.center]}>
					{state !== 'IN_ANSWER_TIME' && (
						<CircleBorder>
							{state === 'IN_COUNTDOWN_TIME' && (
								<CountdownTimer timer={COUNT_DOWN_TIME} timerSelected={['M']} onExpired={onCountdownExpired} />
							)}
							{state === 'IN_RAISE_HAND_TIME' && (
								<TouchableOpacity>
									<Icon
										name="notifications-active"
										size={MAIN_LAYOUT.SCREENS.CONQUER.RAISE_HAND.ICON_SIZE}
										color={theme.colors.tertiary}
										onPress={onPressRaiseHand}
									/>
								</TouchableOpacity>
							)}
						</CircleBorder>
					)}
					{state === 'IN_ANSWER_TIME' && (
						<>
							<CircleBorder label={firstRaisedHand?.name ?? ''}>
								<Avatar.Text
									size={MAIN_LAYOUT.SCREENS.CONQUER.RAISE_HAND.ICON_SIZE}
									label={firstRaisedHand?.name ?? ''}
								/>
							</CircleBorder>
							<Text variant="labelSmall">{IN_ANSWER_TEXT}</Text>
						</>
					)}
				</View>
				<Divider />
				<SingleModeAnswer
					navigation={navigation}
					route={route}
					answerTime={ANSWER_TIME}
					question={question}
					firstRaisedHand={firstRaisedHand}
					isInAnswerTime={state === 'IN_ANSWER_TIME'}
					isAllowedAnswer={firstRaisedHand?._id === profile._id}
				/>
			</ScrollView>
		</View>
	);
};

export default QuickMatch;
