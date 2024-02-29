import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { StackActions } from '@react-navigation/native';
import { SoundManager } from '../../../audios';
import { Button, CircleBorder } from '../../../components';
import { ConstantConfig } from '../../../configs';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { stackStyles } from '../../../styles';
import { ConquerStatisticProps } from '../../../types';

const { MAIN_LAYOUT } = ConstantConfig;

const Statistic = (props: ConquerStatisticProps) => {
	const { navigation, route } = props;
	const { client, isWinner } = route.params;
	const popAction = StackActions.pop(3);
	const { profile } = useAppSelector(selectAccount);
	const won = isWinner && client._id === profile._id;

	useEffect(() => {
		SoundManager.stopSound('quick_match_bg.mp3');

		if (won) {
			SoundManager.playSound('victory_bg.mp3');
			SoundManager.playSound('victory_voice.mp3');
			return;
		}

		SoundManager.playSound('defeat_voice.mp3');
	}, []);
	return (
		<View style={[styles.container, stackStyles.center]}>
			<Text variant="titleLarge">{won ? 'Tiếp tục phát huy nhé :D' : 'Cố gắng lần sau nhé :3'}</Text>
			<CircleBorder>
				<Avatar.Text size={MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE} label="0" />
			</CircleBorder>
			<Button
				mode="contained"
				onPress={() => navigation.dispatch(popAction)}
				style={[{ width: MAIN_LAYOUT.SCREENS.CONQUER.WAITING.AVATAR.ICON_SIZE }]}
				soundName="button_click.mp3"
				icon="keyboard-return"
			>
				Quay về phòng chờ
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default Statistic;
