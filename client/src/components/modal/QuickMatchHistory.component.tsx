import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AxiosError } from 'axios';
import { QuickMatchAPI } from '../../apis';
import { SoundManager } from '../../audios';
import { APIConfig, ConstantConfig } from '../../configs';
import { AccountState } from '../../redux/slices/account.slice';
import { IQuickMatch, ISchema } from '../../types';
import { globalStyles, stackStyles, typographyStyles } from '../../styles';
import { NumberUtil, closeModal, openDialog } from '../../utils';
import { Avatar, Loading, MathContent, Name, Point } from '..';

const { APP } = APIConfig;
const { ROOM, MODAL } = ConstantConfig;

const CONTAINER_WIDTH = MODAL.QUICK_MATCH_HISTORY.WIDTH - MODAL.QUICK_MATCH_HISTORY.PADDING * 4;
const ITEM_WIDTH =
	(CONTAINER_WIDTH -
		MODAL.QUICK_MATCH_HISTORY.MARGIN * 2 * MODAL.QUICK_MATCH_HISTORY.NUMBER_AVATAR_IN_ROW) *
	(1 / MODAL.QUICK_MATCH_HISTORY.NUMBER_AVATAR_IN_ROW);

export interface QuickMatchHistoryProps extends Pick<AccountState, 'profile' | 'resources'> {
	_id: IQuickMatch.QuickMatch['_id'];
}

const QuickMatchHistory = (props: QuickMatchHistoryProps) => {
	const { _id, profile, resources } = props;
	const [quickMatch, setQuickMatch] = useState<IQuickMatch.FindByIdResponse['quickMatch'] | null>(
		null
	);
	const [isHiddenClients, setIsHiddenClients] = useState(true);
	const [isHiddenQuestion, setIsHiddenQuestion] = useState(true);
	const theme = useTheme();

	useEffect(() => {
		const getQuickMatch = async () => {
			try {
				const { quickMatch, error } = await QuickMatchAPI.findById(_id);
				if (error) {
					closeModal();
					openDialog({
						title: '[Xem lịch sử đấu] Lỗi',
						content: error,
						actions: [{ label: 'Đồng ý' }],
					});
					return;
				}

				if (!quickMatch) {
					closeModal();
					openDialog({
						title: 'Không tìm thấy trận đấu',
						content: error,
						actions: [{ label: 'Đồng ý' }],
					});
					return;
				}

				setQuickMatch(quickMatch);
			} catch (error) {
				openDialog({
					title: '[Xem lịch sử đấu] Lỗi',
					content: `${(error as AxiosError).response?.data}`,
				});
			}
		};

		getQuickMatch();
	}, [_id]);
	const onPressCloseModal = () => {
		SoundManager.playSound('button_click.mp3');
		closeModal();
	};
	const onToggleHiddenClients = () => {
		SoundManager.playSound('button_click.mp3');
		setIsHiddenClients(!isHiddenClients);
	};
	const onToggleHiddenQuestion = () => {
		SoundManager.playSound('button_click.mp3');
		setIsHiddenQuestion(!isHiddenQuestion);
	};
	return (
		<View style={[styles.container, globalStyles.paper, globalStyles.shadow]}>
			<Icon
				name="close"
				size={MODAL.ICON_SIZE}
				color={theme.colors.onSurface}
				onPress={onPressCloseModal}
				style={[styles.close]}
			/>
			{quickMatch &&
				(() => {
					const { question, match, first_raised_hand } = quickMatch;
					const { content, values, answers } = question;
					const { resource, playing_time, clients, created_at } = match;
					const { hours, minutes, seconds } = NumberUtil.toTime(playing_time, ['H', 'M']);
					const time = `${hours && `${hours.text}:`}${minutes && `${minutes.text}:`}${seconds.text}`;
					const client = clients.find((client) => client._id === profile._id);
					const isWinner = client && client.state === ROOM.CLIENT_STATE.win;
					const raisedHandClient = clients.find((client) => client._id === first_raised_hand);
					const otherClients = clients.filter((client) => client._id !== first_raised_hand);

					return (
						<ScrollView>
							<View style={[stackStyles.center]}>
								<Image
									source={{
										uri: `${APP.image_storage.host}/${APP.image_storage.path}/app/${
											isWinner ? 'victory' : 'defeat'
										}.png`,
									}}
									style={[
										{
											width: MODAL.QUICK_MATCH_HISTORY.AVATAR_SIZE * 4,
											height: MODAL.QUICK_MATCH_HISTORY.AVATAR_SIZE * 4,
											objectFit: 'contain',
										},
									]}
								/>
							</View>
							<View style={[{ padding: MODAL.QUICK_MATCH_HISTORY.PADDING }]}>
								<Text variant="labelSmall" style={[typographyStyles.bold]}>
									Đấu: {resources[resource].name}
								</Text>
								<Text variant="labelSmall" style={[typographyStyles.bold]}>
									Thời gian đấu: {time}
								</Text>
								<View style={[{ alignSelf: 'flex-end' }]}>
									<Text variant="labelSmall" style={[typographyStyles.italic]}>
										{created_at}
									</Text>
								</View>
								{client && (
									<>
										<Divider style={[{ marginVertical: MODAL.QUICK_MATCH_HISTORY.MARGIN }]} />
										<View>
											{Object.entries(client.point_differences).map(([point, value], index) => {
												return (
													<View key={index} style={[stackStyles.row]}>
														<Text
															variant="labelSmall"
															style={[typographyStyles.bold, { width: MODAL.QUICK_MATCH_HISTORY.AVATAR_SIZE * 2 }]}
														>
															{value.label}
														</Text>
														<Text variant="labelSmall" style={[typographyStyles.bold]}>
															:
														</Text>
														{(value as any)?.maxValue && (
															<Text
																variant="labelSmall"
																style={[typographyStyles.bold, { marginHorizontal: MODAL.QUICK_MATCH_HISTORY.MARGIN / 2 }]}
															>
																Cấp {(value as any)?.level} ({value.value}/{(value as any)?.maxValue})
															</Text>
														)}
														{!(value as any)?.maxValue && (
															<Text
																variant="labelSmall"
																style={[typographyStyles.bold, { marginHorizontal: MODAL.QUICK_MATCH_HISTORY.MARGIN / 2 }]}
															>
																{value.value}
															</Text>
														)}
														<Text variant="labelSmall" style={[typographyStyles.bold]}>
															(
														</Text>
														<Point type={point as keyof ISchema.Point} value={value.changed} size={MODAL.ICON_SIZE} />
														<Text variant="labelSmall" style={[typographyStyles.bold]}>
															)
														</Text>
													</View>
												);
											})}
										</View>
									</>
								)}
								<Divider style={[{ marginVertical: MODAL.QUICK_MATCH_HISTORY.MARGIN }]} />
								<View>
									<TouchableOpacity onPress={onToggleHiddenClients}>
										<View style={[stackStyles.row]}>
											<Text variant="labelLarge" style={[typographyStyles.bold]}>
												{isHiddenClients ? 'Tham gia' : 'Thu gọn'}
											</Text>
											<Icon
												name={isHiddenClients ? 'expand-more' : 'expand-less'}
												size={MODAL.ICON_SIZE}
												color={theme.colors.onSurface}
											/>
										</View>
										{isHiddenClients && (
											<Text variant="labelSmall" style={[typographyStyles.italic]}>
												Nhấn để xem lại thành viên tham gia trận đấu
											</Text>
										)}
									</TouchableOpacity>
									{!isHiddenClients && (
										<View>
											{raisedHandClient && (
												<View style={[stackStyles.center, { marginBottom: MODAL.QUICK_MATCH_HISTORY.MARGIN * 2 }]}>
													<Text variant="labelLarge" style={[typographyStyles.bold]}>
														Rung chuông sớm nhất
													</Text>
													<View style={[stackStyles.center]}>
														<Avatar avatar={raisedHandClient.avatar} size={MODAL.QUICK_MATCH_HISTORY.AVATAR_SIZE * 2} />
														<Name numberOfLines={2} variant="titleSmall" style={[{ textAlign: 'center' }]}>
															{raisedHandClient.name}
														</Name>
													</View>
												</View>
											)}
											{otherClients.length > 0 && (
												<View style={[stackStyles.rowWrap]}>
													{otherClients.map((client) => {
														return (
															<View
																key={client._id}
																style={[stackStyles.center, { width: ITEM_WIDTH, margin: MODAL.QUICK_MATCH_HISTORY.MARGIN }]}
															>
																<Avatar avatar={client.avatar} size={MODAL.QUICK_MATCH_HISTORY.AVATAR_SIZE} />
																<Name numberOfLines={2} style={[{ textAlign: 'center' }]}>
																	{client.name}
																</Name>
															</View>
														);
													})}
												</View>
											)}
										</View>
									)}
								</View>
								<Divider style={[{ marginVertical: MODAL.QUICK_MATCH_HISTORY.MARGIN }]} />
								<View>
									<TouchableOpacity onPress={onToggleHiddenQuestion}>
										<View style={[stackStyles.row]}>
											<Text variant="labelLarge" style={[typographyStyles.bold]}>
												{isHiddenQuestion ? 'Câu hỏi' : 'Thu gọn'}
											</Text>
											<Icon
												name={isHiddenQuestion ? 'expand-more' : 'expand-less'}
												size={MODAL.ICON_SIZE}
												color={theme.colors.onSurface}
											/>
										</View>
										{isHiddenQuestion && (
											<Text variant="labelSmall" style={[typographyStyles.italic]}>
												Nhấn để xem lại câu hỏi
											</Text>
										)}
									</TouchableOpacity>
									{!isHiddenQuestion && (
										<View>
											<View style={[{ marginBottom: MODAL.QUICK_MATCH_HISTORY.MARGIN * 3 }]}>
												<View style={[styles.question, globalStyles.paper]}>
													<MathContent
														content={content}
														style={[{ backgroundColor: globalStyles.paper.backgroundColor }]}
														textColor={theme.colors.onSurface}
													/>
												</View>
											</View>
											{answers.length > 0 && (
												<View>
													{answers.map((answer) => {
														const isCorrectAnswer = values.indexOf(answer.value) !== -1;
														const bgColor = isCorrectAnswer ? theme.colors.secondary : globalStyles.paper.backgroundColor;
														const textColor = isCorrectAnswer ? theme.colors.onSecondary : theme.colors.onSurface;

														return (
															<View key={answer._id} style={[styles.question, { backgroundColor: bgColor }]}>
																<MathContent
																	content={answer.content}
																	style={[{ backgroundColor: bgColor }]}
																	textColor={textColor}
																/>
															</View>
														);
													})}
												</View>
											)}
										</View>
									)}
								</View>
							</View>
						</ScrollView>
					);
				})()}
			{!quickMatch && (
				<View style={[{ height: MODAL.QUICK_MATCH_HISTORY.HEIGHT }]}>
					<Loading />
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		width: MODAL.QUICK_MATCH_HISTORY.WIDTH,
		padding: MODAL.QUICK_MATCH_HISTORY.PADDING,
		marginVertical: MODAL.QUICK_MATCH_HISTORY.MARGIN,
		borderRadius: MODAL.QUICK_MATCH_HISTORY.BORDER_RADIUS,
	},
	close: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 9999,
	},
	question: {
		borderWidth: 1,
		borderStyle: 'dashed',
		borderRadius: MODAL.QUICK_MATCH_HISTORY.BORDER_RADIUS,
		padding: MODAL.QUICK_MATCH_HISTORY.PADDING / 2,
		marginVertical: MODAL.QUICK_MATCH_HISTORY.MARGIN / 2,
	},
});

export default QuickMatchHistory;
