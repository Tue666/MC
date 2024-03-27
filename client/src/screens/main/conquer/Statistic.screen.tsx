import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { BounceInDown, FadeInUp, StretchInX } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { SoundManager } from '../../../audios';
import { Box, Button, Point } from '../../../components';
import { ConstantConfig, ResourceConfig } from '../../../configs';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectAccount, updateProfileSuccess } from '../../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../../styles';
import { ConquerStatisticProps, ISchema } from '../../../types';
import { NumberUtil } from '../../../utils';

const { MAIN_LAYOUT, ROOM } = ConstantConfig;
const { CONQUER_RENDERER } = ResourceConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH = WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2 - 30 * 2;
const ITEM_WIDTH =
	(CONTAINER_WIDTH - 5 * 2 * MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.NUMBER_ITEM_IN_ROW) *
	(1 / MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.NUMBER_ITEM_IN_ROW);

const Statistic = (props: ConquerStatisticProps) => {
	const { RESOURCES } = CONQUER_RENDERER;

	const { navigation, route } = props;
	const { client, isClientAnswerCorrect, match, room } = route.params;
	const { mode, resource, playing_time } = match;
	const { minToStart, maxCapacity } = room;
	const { hours, minutes, seconds } = NumberUtil.toTime(playing_time, ['H', 'M']);
	const time = `${hours && `${hours.text}:`}${minutes && `${minutes.text}:`}${seconds.text}`;
	const { point_differences } = client;
	const theme = useTheme();
	const { resources } = useAppSelector(selectAccount);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(updateProfileSuccess(point_differences));
		SoundManager.stopSound('quick_match_bg.mp3');

		if (isClientAnswerCorrect) {
			SoundManager.playSound('victory_bg.mp3');
			SoundManager.playSound('victory_voice.mp3');
			return;
		}

		SoundManager.playSound('defeat_voice.mp3');
	}, [dispatch, client]);
	const onNormalRoomBack = () => {
		navigation.dispatch(
			CommonActions.reset({
				index: 1,
				routes: [
					{ name: 'Conquer' },
					{
						name: 'Waiting',
						params: {
							resource: resources[resource],
							idleMode: RESOURCES[resource].idleMode,
						},
					},
					{
						name: 'FindRoom',
						params: {
							resource: resources[resource],
							roomMode: mode,
							idleMode: RESOURCES[resource].idleMode,
							minToStart,
							maxCapacity,
						},
					},
					{
						name: 'Forming',
						params: {
							resource: resources[resource],
							room,
							roomMode: mode,
							idleMode: RESOURCES[resource].idleMode,
							minToStart: maxCapacity,
						},
					},
				],
			})
		);
	};
	const onAutoRoomBack = () => {
		navigation.dispatch(
			CommonActions.reset({
				index: 1,
				routes: [
					{ name: 'Conquer' },
					{
						name: 'Waiting',
						params: {
							resource: resources[resource],
							idleMode: RESOURCES[resource].idleMode,
						},
					},
				],
			})
		);
	};
	const onDefaultRoomBack = () => {
		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{ name: 'Conquer' }],
			})
		);
	};
	const onNavigateBack = () => {
		const navigate = {
			[ROOM.MODE.normal]: onNormalRoomBack,
			[ROOM.MODE.auto]: onAutoRoomBack,
		};

		if (!navigate[mode]) onDefaultRoomBack();

		navigate[mode]();
	};
	return (
		<View style={[globalStyles.container, stackStyles.center]}>
			{isClientAnswerCorrect && (
				<LottieView
					source={require('../../../assets/animations/lottie/win.json')}
					autoPlay
					loop={false}
					style={[
						{
							width: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.ICON_SIZE,
							height: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.ICON_SIZE,
						},
					]}
				/>
			)}
			{!isClientAnswerCorrect && (
				<LottieView
					source={require('../../../assets/animations/lottie/lose.json')}
					autoPlay
					loop={false}
					style={[
						{
							width: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.ICON_SIZE,
							height: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.ICON_SIZE,
						},
					]}
				/>
			)}
			<Animated.View
				entering={StretchInX.duration(500).delay(1500)}
				style={[styles.statistics, stackStyles.rowWrap]}
			>
				<Box style={[styles.point, { width: ITEM_WIDTH }]}>
					<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
						Thời gian chơi:
					</Text>
					<View style={[stackStyles.row, { justifyContent: 'center' }]}>
						<Icon name="schedule" size={MAIN_LAYOUT.HEADER.ICON_SIZE} color={theme.colors.onSurface} />
						<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
							{' '}
							{time}
						</Text>
					</View>
				</Box>
				{Object.entries(point_differences).map(([point, value], index) => {
					const { changed, label } = value;

					return (
						<Box key={index} style={[styles.point, { width: ITEM_WIDTH }]}>
							<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
								{label}:
							</Text>
							<View style={[stackStyles.row, { justifyContent: 'center' }]}>
								<Point type={point as keyof ISchema.Point} size={MAIN_LAYOUT.HEADER.ICON_SIZE} />
								{changed > 0 && (
									<Text variant="labelSmall" style={[{ fontWeight: 'bold', color: theme.colors.secondary }]}>
										{' '}
										+{changed}
									</Text>
								)}
								{changed < 0 && (
									<Text variant="labelSmall" style={[{ fontWeight: 'bold', color: theme.colors.error }]}>
										{' '}
										{changed}
									</Text>
								)}
								{changed === 0 && (
									<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
										{' '}
										{changed}
									</Text>
								)}
							</View>
						</Box>
					);
				})}
			</Animated.View>
			<Animated.View
				entering={FadeInUp.duration(500).delay(1000)}
				style={[stackStyles.center, { marginBottom: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.MARGIN_BOTTOM }]}
			>
				<Text variant="headlineSmall" style={[{ textTransform: 'uppercase' }]}>
					{isClientAnswerCorrect ? 'Tuyệt vời' : 'Cố lên'}
				</Text>
				<Text variant="titleSmall">
					{isClientAnswerCorrect ? 'Tiếp tục phát huy nhé!' : 'Thất bại là mẹ thành công!'}
				</Text>
			</Animated.View>
			<Animated.View entering={BounceInDown.delay(2000)} style={[stackStyles.center]}>
				<Button
					mode="contained"
					onPress={onNavigateBack}
					style={[{ width: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.ICON_SIZE }]}
					soundName="button_click.mp3"
					icon="keyboard-return"
				>
					Quay về phòng chờ
				</Button>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	statistics: {
		paddingHorizontal: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.PADDING * 3,
		marginBottom: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.MARGIN,
	},
	point: {
		padding: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.PADDING,
		margin: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.PADDING / 2,
	},
});

export default Statistic;
