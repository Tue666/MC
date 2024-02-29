import { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { SoundManager } from '../../../../audios';
import {
	CircleBorder,
	CountdownTimer,
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
const ANSWER_TIME = 600;
const IN_ANSWER_TEXT = 'Đang trả lời...';

export type State = 'IN_COUNTDOWN_TIME' | 'IN_RAISE_HAND_TIME' | 'IN_ANSWER_TIME';

const QuickMatch = (props: ConquerQuickMatchProps) => {
	const { navigation, route } = props;
	const { resource, room: joinedRoom } = route.params;
	const { _id } = resource;
	const theme = useTheme();
	const raiseHandRef = useRef(false);
	const scrollViewRef = useRef<ScrollView>(null);
	const [question, setQuestion] = useState<IQuestion.Question | null>(null);
	const [state, setState] = useState<State>('IN_COUNTDOWN_TIME');
	const [firstRaisedHand, setFirstRaisedHand] = useState<IRoom.Room['clients'][number] | null>(null);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();

	useEffect(() => {
		SoundManager.playSound('quick_match_bg.mp3', { repeat: true });

		const findQuestion = async () => {
			try {
				const url = `https://sheets.googleapis.com/v4/spreadsheets/1D5lO8XHlKTEDJLeUmeH13ynV_g7A1weYcGF84InzoTs/values/Sheet1?key=AIzaSyBZu2RzFLhG5EyR7yQGwdkRNavlVxO__2U`;
				const res = await (axios.get(url) as Promise<any>);
				const { values } = res.data;

				const randomIndex = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
				const [_id, content, type, value, ...answers] = values[randomIndex];
				const question: IQuestion.Question = {
					_id,
					content,
					type,
					resources: [],
					description: '',
					values: [parseInt(value)],
					answers: answers.map((answer: string, index: number) => ({
						_id: (index + 1).toString(),
						value: index + 1,
						content: answer,
					})),
					created_at: '',
					updated_at: '',
					deleted_at: '',
					deleted_by: {
						_id: '',
						name: '',
					},
				};
				setQuestion(question);
			} catch (error) {
				console.log(error);
			}
		};

		findQuestion();
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
				title: 'Lỗi',
				content: error,
			});
		});
	}, []);
	const onCountdownExpired = () => {
		setState('IN_RAISE_HAND_TIME');
	};
	const onPressRaiseHand = () => {
		if (raiseHandRef.current) return;

		const room = {
			resource: _id,
			_id: joinedRoom._id,
		};

		socketClient?.emit('conquer[quick-match]:client-server(raise-hand)', {
			room,
			client: {
				_id: profile._id,
				name: profile.name,
			},
		});
		raiseHandRef.current = true;
	};

	if (question === null || question === undefined)
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);

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
					isInAnswerTime={state === 'IN_ANSWER_TIME'}
					answerTime={ANSWER_TIME}
					isAllowedAnswer={firstRaisedHand?._id === profile._id}
					firstRaisedHand={firstRaisedHand}
					question={question}
				/>
			</ScrollView>
		</View>
	);
};

export default QuickMatch;
