import { useEffect } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { StackActions } from '@react-navigation/native';
import { SoundManager } from '../../../audios';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { ConquerStatisticProps } from '../../../types';

const Statistic = (props: ConquerStatisticProps) => {
	const { navigation, route } = props;
	const { client, isWinner } = route.params;
	const popAction = StackActions.pop(3);
	const { profile } = useAppSelector(selectAccount);

	useEffect(() => {
		if (isWinner && client._id === profile._id) {
			SoundManager.playSound('victory_bg.mp3');
			SoundManager.playSound('victory.mp3');
			return;
		}

		SoundManager.playSound('defeat.mp3');
	}, []);
	return (
		<View>
			<Button mode="contained" onPress={() => navigation.dispatch(popAction)}>
				Quay Về Phòng Chờ
			</Button>
		</View>
	);
};

export default Statistic;
