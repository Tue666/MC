import { TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Modal as RNPModal, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useModal } from '../../hooks';
import { useAppSelector } from '../../redux/hooks';
import { selectModal } from '../../redux/slices/modal.slice';
import { useGlobalStyles, useStackStyles } from '../../styles';
import { IRoom } from '../../types';
import { CircleBorder } from '..';

export interface ModalProps {
	navigation: any;
	globalStyles: any;
	stackStyles: any;
	closeModal: () => void;
}

export interface WinnerModalProps extends ModalProps {
	client: IRoom.Room['clients'][number];
	isWinner: boolean;
}

const components = {
	DEFAULT: () => {
		return null;
	},
	WINNER: (props: WinnerModalProps) => {
		const { navigation, globalStyles, stackStyles, closeModal, client, isWinner } = props;

		const onPressContinue = () => {
			navigation.navigate('Statistic', { client, isWinner });
			closeModal();
		};
		return (
			<View
				style={{
					...globalStyles.paper,
					...stackStyles.center,
					width: 280,
					padding: 10,
					borderRadius: 15,
				}}
			>
				<CircleBorder label={client?.name ?? ''}>
					<Avatar.Image size={130} source={require('../../assets/images/avatar.png')} />
				</CircleBorder>
				<Text variant="headlineMedium">Chiến Thắng</Text>
				<TouchableOpacity onPress={onPressContinue} style={{ marginVertical: 10 }}>
					<Button mode="contained">Tiếp Tục</Button>
				</TouchableOpacity>
			</View>
		);
	},
};

const Modal = () => {
	const navigation = useNavigation();
	const { isOpen, closable, component, params } = useAppSelector(selectModal);
	const { closeModal } = useModal();
	const globalStyles = useGlobalStyles();
	const stackStyles = useStackStyles();

	return (
		<RNPModal
			visible={isOpen}
			dismissable={closable}
			dismissableBackButton={closable}
			onDismiss={closeModal}
			contentContainerStyle={{ ...stackStyles.center }}
		>
			{components[component]({ navigation, globalStyles, stackStyles, closeModal, ...params })}
		</RNPModal>
	);
};

export default Modal;
