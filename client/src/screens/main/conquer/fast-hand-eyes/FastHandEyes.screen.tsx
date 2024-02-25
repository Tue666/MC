import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Answer, CircleBorder, CountdownTimer } from '../../../../components';
import { ConstantConfig } from '../../../../configs';
import { useSocketClient } from '../../../../hooks';
import { useAppSelector } from '../../../../redux/hooks';
import { selectAccount } from '../../../../redux/slices/account.slice';
import { useGlobalStyles, useStackStyles } from '../../../../styles';
import { ConquerFastHandEyesProps, IQuestion, IRoom } from '../../../../types';
import { openDialog } from '../../../../utils';

const { MAIN_LAYOUT } = ConstantConfig;

const TIMER = 10;
const QUESTION: IQuestion.Question = {
	_id: '123',
	content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
	industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
	and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
	leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
	with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
	publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply
	dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
	dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
	make a type specimen book.`,
	type: 'SINGLE',
	description: 'Chọn 1 câu trả lời đúng trong các đáp án dưới nhé!',
	values: [2],
	answers: [
		{ _id: '1', value: 1, content: 'Lorem Ipsum' },
		{ _id: '2', value: 2, content: 'Lorem Ipsum' },
		{ _id: '3', value: 3, content: 'Lorem Ipsum' },
		{ _id: '4', value: 4, content: 'Lorem Ipsum' },
	],
	created_at: '',
	updated_at: '',
	deleted_at: '',
	deleted_by: {
		_id: '',
		name: '',
	},
};

export type State = 'IN_COUNTDOWN_TIME' | 'IN_RAISE_HAND_TIME' | 'IN_ANSWER_TIME';

const FastHandEyes = (props: ConquerFastHandEyesProps) => {
	const { navigation, route } = props;
	const { content, type, values, answers } = QUESTION;
	const { room: joinedRoom, _id } = route.params;
	const theme = useTheme();
	const raiseHandRef = useRef(false);
	const scrollViewRef = useRef<ScrollView>(null);
	const [state, setState] = useState<State>('IN_COUNTDOWN_TIME');
	const [firstRaisedHand, setFirstRaisedHand] = useState<IRoom.Room['clients'][number] | null>(null);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();
	const globalStyles = useGlobalStyles();
	const stackStyles = useStackStyles();

	useEffect(() => {
		socketClient?.on(
			'conquer[fast-hand-eyes]:server-client(raise-hand)',
			(client: IRoom.Room['clients'][number]) => {
				setFirstRaisedHand(client);
				setState('IN_ANSWER_TIME');
				scrollViewRef.current?.scrollToEnd();
			}
		);
		socketClient?.on('[ERROR]conquer[fast-hand-eyes]:server-client(raise-hand)', (error) => {
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

		socketClient?.emit('conquer[fast-hand-eyes]:client-server(raise-hand)', {
			room,
			client: {
				_id: profile._id,
				name: profile.name,
			},
		});
		raiseHandRef.current = true;
	};
	return (
		<View style={{ ...stackStyles.center }}>
			<ScrollView ref={scrollViewRef}>
				<View
					style={{ ...styles.question, ...globalStyles.paper, ...globalStyles.shadow, ...stackStyles.center }}
				>
					<Text>{content}</Text>
				</View>
				<TouchableOpacity style={{ ...stackStyles.center }}>
					{state !== 'IN_ANSWER_TIME' && (
						<CircleBorder>
							{state === 'IN_COUNTDOWN_TIME' && (
								<CountdownTimer timer={TIMER} timerSelected={['M']} onExpired={onCountdownExpired} />
							)}
							{state === 'IN_RAISE_HAND_TIME' && (
								<Icon
									name="notifications-active"
									size={MAIN_LAYOUT.SCREENS.CONQUER.RAISE_HAND.ICON_SIZE}
									color={theme.colors.tertiary}
									onPress={onPressRaiseHand}
								/>
							)}
						</CircleBorder>
					)}
					{state === 'IN_ANSWER_TIME' && (
						<View style={{ alignItems: 'center' }}>
							<CircleBorder label={firstRaisedHand?.name ?? ''}>
								<Avatar.Text
									size={MAIN_LAYOUT.SCREENS.CONQUER.RAISE_HAND.ICON_SIZE}
									label={firstRaisedHand?.name ?? ''}
								/>
							</CircleBorder>
							<Text variant="labelSmall">Đang Trả Lời...</Text>
						</View>
					)}
				</TouchableOpacity>
				<Answer
					navigation={navigation}
					route={route}
					allowedAnswer={firstRaisedHand?._id === profile._id}
					firstRaisedHand={firstRaisedHand}
					question={{ type, values, answers }}
				/>
			</ScrollView>
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

export default FastHandEyes;
