import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { ConstantConfig } from '../../configs';
import { globalStyles, stackStyles } from '../../styles';
import { ConquerStackList, IRoom } from '../../types';
import { closeModal } from '../../utils';
import { Avatar } from '..';

const { MODAL } = ConstantConfig;

export interface WinnerProps {
	client: IRoom.Room['clients'][number];
	isCorrect: boolean;
}

const Winner = (props: WinnerProps) => {
	const { client, isCorrect } = props;
	const navigation = useNavigation<StackNavigationProp<ConquerStackList>>();

	const onPressContinue = () => {
		navigation.navigate('Statistic', { client, isCorrect });
		closeModal();
	};
	return (
		<>
			<TouchableRipple
				onPress={onPressContinue}
				style={[
					globalStyles.full,
					{
						zIndex: 9999999,
						position: 'absolute',
					},
				]}
			>
				<LottieView
					source={require('../../assets/animations/lottie/confetti.json')}
					autoPlay
					loop
					style={{ flex: 1 }}
				/>
			</TouchableRipple>
			<View style={[styles.container, globalStyles.paper, globalStyles.shadow, stackStyles.center]}>
				<Avatar label={client.name} avatar={client.avatar} size={MODAL.WINNER.AVATAR.ICON_SIZE} />
				<LottieView
					source={require('../../assets/animations/lottie/trophy.json')}
					autoPlay
					loop
					style={{ width: MODAL.WINNER.ICON_SIZE, height: MODAL.WINNER.ICON_SIZE }}
				/>
				<Text variant="headlineSmall" style={[{ textTransform: 'uppercase' }]}>
					Chiến Thắng
				</Text>
				<Text variant="labelSmall" style={[{ marginTop: MODAL.WINNER.PADDING, fontStyle: 'italic' }]}>
					Nhấn bất kỳ để tiếp tục
				</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		width: MODAL.WINNER.WIDTH,
		paddingVertical: MODAL.WINNER.PADDING / 2,
		paddingHorizontal: MODAL.WINNER.PADDING,
		borderRadius: MODAL.WINNER.BORDER_RADIUS,
	},
});

export default Winner;
