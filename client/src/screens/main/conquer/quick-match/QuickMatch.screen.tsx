import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SoundManager } from '../../../../audios';
import {
	Avatar,
	CountdownCircle,
	SingleModeAnswer,
	SingleModeQuestion,
} from '../../../../components';
import { SingleModeAnswerHandleRef } from '../../../../components/conquer/SingleModeAnswer.component';
import { ConstantConfig } from '../../../../configs';
import { useSocketClient } from '../../../../hooks';
import { useAppSelector } from '../../../../redux/hooks';
import { selectAccount } from '../../../../redux/slices/account.slice';
import { stackStyles } from '../../../../styles';
import { ConquerQuickMatchProps, IRoom } from '../../../../types';
import { HelperUtil, openDialog } from '../../../../utils';

const { MAIN_LAYOUT } = ConstantConfig;

const IN_ANSWER_TEXT = 'Đang trả lời...';

export type State = 'IN_COUNTDOWN_TIME' | 'IN_ANSWER_TIME';

const QuickMatch = (props: ConquerQuickMatchProps) => {
	const { navigation, route } = props;
	const { resource, room: joinedRoom, roomMode, question } = route.params;
	const answerTime = (joinedRoom.endTime - joinedRoom.startTime) / 1000;
	const remainingAnswerTime = (joinedRoom.endTime - HelperUtil.getCurrentTime()) / 1000;
	const raisedHand = joinedRoom.clients.find((client) => client._id === joinedRoom.firstRaisedHand);
	const theme = useTheme();
	const answerComRef = useRef<SingleModeAnswerHandleRef | null>(null);
	const raiseHandRef = useRef<boolean | null>(raisedHand ? true : false);
	const scrollViewRef = useRef<ScrollView | null>(null);
	const [state, setState] = useState<State>(raisedHand ? 'IN_ANSWER_TIME' : 'IN_COUNTDOWN_TIME');
	const [playingCountdown, setPlayingCountdown] = useState(true);
	const [firstRaisedHand, setFirstRaisedHand] = useState<IRoom.Room['clients'][number] | null>(
		raisedHand || null
	);
	const { profile } = useAppSelector(selectAccount);
	const { socketClient } = useSocketClient();

	useEffect(() => {
		SoundManager.playSound('quick_match_bg.mp3', { repeat: true });

		return () => {
			answerComRef.current = null;
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
	const onChangePlayingCountdown = (playing: boolean) => {
		setPlayingCountdown(playing);
	};
	const onCountdownComplete = () => {
		answerComRef.current?.processResults();
	};
	return (
		<View style={[stackStyles.center]}>
			<ScrollView ref={scrollViewRef}>
				<SingleModeQuestion content={question.content} />
				<View style={[styles.raise, stackStyles.center]}>
					<TouchableOpacity>
						<CountdownCircle
							playing={playingCountdown}
							duration={answerTime}
							initialRemainingTime={remainingAnswerTime}
							size={MAIN_LAYOUT.SCREENS.CONQUER.RAISE_HAND.ICON_SIZE}
							onComplete={onCountdownComplete}
						>
							{state !== 'IN_ANSWER_TIME' && (
								<Icon
									name="notifications-active"
									size={MAIN_LAYOUT.SCREENS.CONQUER.RAISE_HAND.ICON_SIZE}
									color={theme.colors.tertiary}
									onPress={onPressRaiseHand}
								/>
							)}
							{state === 'IN_ANSWER_TIME' && (
								<Avatar
									noBorder
									avatar={firstRaisedHand?.avatar}
									size={MAIN_LAYOUT.SCREENS.CONQUER.RAISE_HAND.ICON_SIZE}
								/>
							)}
						</CountdownCircle>
					</TouchableOpacity>
					{state === 'IN_ANSWER_TIME' && (
						<>
							<Text variant="labelSmall" numberOfLines={1} style={[{ fontWeight: 'bold' }]}>
								{firstRaisedHand?.name}
							</Text>
							<Text variant="labelSmall">{IN_ANSWER_TEXT}</Text>
						</>
					)}
				</View>
				<Divider />
				<SingleModeAnswer
					ref={answerComRef}
					navigation={navigation}
					route={route}
					question={question}
					clientId={profile._id}
					raisedHandId={firstRaisedHand?._id}
					onChangePlayingCountdown={onChangePlayingCountdown}
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
