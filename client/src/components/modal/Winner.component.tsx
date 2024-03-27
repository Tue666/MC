import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { ConstantConfig } from '../../configs';
import { globalStyles, stackStyles } from '../../styles';
import { ConquerStackList, ConquerStackListParams } from '../../types';
import { closeModal } from '../../utils';
import { Avatar } from '..';

const { MODAL } = ConstantConfig;

export interface WinnerProps extends ConquerStackListParams<'Statistic'> {}

const Winner = (props: WinnerProps) => {
	const { client } = props;
	const navigation = useNavigation<StackNavigationProp<ConquerStackList>>();

	const onPressContinue = () => {
		navigation.navigate('Statistic', props);
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
					style={[{ flex: 1 }]}
				/>
			</TouchableRipple>
			<View style={[styles.container, globalStyles.paper, globalStyles.shadow, stackStyles.center]}>
				<Avatar avatar={client?.avatar} size={MODAL.WINNER.AVATAR.ICON_SIZE} style={[styles.avatar]} />
				<Text variant="labelSmall" numberOfLines={1} style={[{ fontWeight: 'bold' }]}>
					{client?.name}
				</Text>
				<LottieView
					source={require('../../assets/animations/lottie/trophy.json')}
					autoPlay
					loop
					style={[{ width: MODAL.WINNER.ICON_SIZE, height: MODAL.WINNER.ICON_SIZE }]}
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
	avatar: {
		marginBottom: MODAL.WINNER.PADDING / 2,
	},
});

export default Winner;
