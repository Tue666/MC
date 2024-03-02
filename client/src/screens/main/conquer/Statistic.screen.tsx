import { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { StackActions } from '@react-navigation/native';
import Animated, { BounceInDown, FadeInUp } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { SoundManager } from '../../../audios';
import { Button } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { globalStyles, stackStyles } from '../../../styles';
import { ConquerStatisticProps } from '../../../types';

const { MAIN_LAYOUT } = ConstantConfig;

const Statistic = (props: ConquerStatisticProps) => {
	const { navigation, route } = props;
	const { client, isCorrect } = route.params;
	const popAction = StackActions.pop(3);
	const { profile } = useAppSelector(selectAccount);
	const isWinner = isCorrect && client._id === profile._id;

	useEffect(() => {
		SoundManager.stopSound('quick_match_bg.mp3');

		if (isWinner) {
			SoundManager.playSound('victory_bg.mp3');
			SoundManager.playSound('victory_voice.mp3');
			return;
		}

		SoundManager.playSound('defeat_voice.mp3');
	}, []);
	return (
		<View style={[globalStyles.container, stackStyles.center]}>
			{isWinner && (
				<LottieView
					source={require('../../../assets/animations/lottie/win.json')}
					autoPlay
					loop={false}
					style={{
						width: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.ICON_SIZE,
						height: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.ICON_SIZE,
					}}
				/>
			)}
			{!isWinner && (
				<LottieView
					source={require('../../../assets/animations/lottie/lose.json')}
					autoPlay
					loop={false}
					style={{
						width: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.ICON_SIZE,
						height: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.ICON_SIZE,
					}}
				/>
			)}
			<Animated.View
				entering={FadeInUp.duration(500).delay(1000)}
				style={[stackStyles.center, { marginBottom: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.MARGIN_BOTTOM }]}
			>
				<Text variant="headlineSmall" style={[{ textTransform: 'uppercase' }]}>
					{isWinner ? 'Tuyệt vời' : 'Cố lên'}
				</Text>
				<Text variant="titleSmall">
					{isWinner ? 'Tiếp tục phát huy nhé!' : 'Thất bại là mẹ thành công!'}
				</Text>
			</Animated.View>
			<Animated.View
				entering={BounceInDown.delay(1500)}
				style={[stackStyles.center, { marginBottom: MAIN_LAYOUT.SCREENS.CONQUER.STATISTIC.MARGIN_BOTTOM }]}
			>
				<Button
					mode="contained"
					onPress={() => navigation.dispatch(popAction)}
					style={[{ width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE }]}
					soundName="button_click.mp3"
					icon="keyboard-return"
				>
					Quay về phòng chờ
				</Button>
			</Animated.View>
		</View>
	);
};

export default Statistic;
