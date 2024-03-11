import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SoundManager } from '../../../../audios';
import {
	Avatar,
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
import { ConquerQuickMatchProps, IRoom } from '../../../../types';
import { openDialog } from '../../../../utils';

const { MAIN_LAYOUT } = ConstantConfig;

const COUNT_DOWN_TIME = 10;
const ANSWER_TIME = 10;
const IN_ANSWER_TEXT = 'Đang trả lời...';

export type State = 'IN_COUNTDOWN_TIME' | 'IN_RAISE_HAND_TIME' | 'IN_ANSWER_TIME';

const QuickMatch = (props: ConquerQuickMatchProps) => {
	const { navigation, route } = props;
	const { resource, room: joinedRoom, roomMode, question } = route.params;
	const theme = useTheme();
	const raiseHandRef = useRef<boolean | null>(false);
	const scrollViewRef = useRef<ScrollView | null>(null);
	const [state, setState] = useState<State>('IN_COUNTDOWN_TIME');
	const [firstRaisedHand, setFirstRaisedHand] = useState<IRoom.Room['clients'][number] | null>(null);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();

	useEffect(() => {
		SoundManager.playSound('quick_match_bg.mp3', { repeat: true });

		return () => {
			raiseHandRef.current = null;
			scrollViewRef.current = null;
		};
	}, []);
	useEffect(() => {
		const onRaiseHandEvent = (client: IRoom.Room['clients'][number]) => {
			SoundManager.playSound('bell.mp3');
			setFirstRaisedHand(client);
			setState('IN_ANSWER_TIME');
			scrollViewRef.current?.scrollToEnd();
		};
		socketClient?.on('conquer[quick-match]:server-client(raise-hand)', onRaiseHandEvent);

		const onErrorRaiseHandEvent = (error: string) => {
			openDialog({
				title: '[Giơ tay] Lỗi',
				content: error,
			});
		};
		socketClient?.on('[ERROR]conquer[quick-match]:server-client(raise-hand)', onErrorRaiseHandEvent);

		return () => {
			socketClient?.off('conquer[quick-match]:server-client(raise-hand)', onRaiseHandEvent);
			socketClient?.off('[ERROR]conquer[quick-match]:server-client(raise-hand)', onErrorRaiseHandEvent);
		};
	}, []);
	const onCountdownExpired = () => {
		setState('IN_RAISE_HAND_TIME');
	};
	const onPressRaiseHand = () => {
		if (raiseHandRef.current) return;

		raiseHandRef.current = true;

		socketClient?.emit('conquer[quick-match]:client-server(raise-hand)', {
			mode: roomMode,
			resource: resource._id,
			room: joinedRoom,
			client: profile,
		});
	};

	return (
		<View style={[stackStyles.center]}>
			<ScrollView ref={scrollViewRef}>
				<SingleModeQuestion content={question.content} />
				<View style={[styles.raise, stackStyles.center]}>
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
							<Avatar
								label={firstRaisedHand?.name ?? ''}
								avatar={firstRaisedHand?.avatar}
								size={MAIN_LAYOUT.SCREENS.CONQUER.RAISE_HAND.ICON_SIZE}
							/>
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

const styles = StyleSheet.create({
	raise: {
		marginBottom: MAIN_LAYOUT.SCREENS.CONQUER.QUESTION_BOX.MARGIN_BOTTOM,
	},
});

export default QuickMatch;
