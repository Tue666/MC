import { View } from 'react-native';
import { Avatar, Modal as RNPModal, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ConstantConfig } from '../../configs';
import { useModal } from '../../hooks';
import { useAppSelector } from '../../redux/hooks';
import { selectModal } from '../../redux/slices/modal.slice';
import { useGlobalStyles, useStackStyles } from '../../styles';
import { IRoom } from '../../types';
import { Button, CircleBorder } from '..';

const { MODAL } = ConstantConfig;

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
					...globalStyles.shadow,
					...stackStyles.center,
					width: MODAL.WINNER.WIDTH,
					padding: MODAL.WINNER.PADDING,
					borderRadius: MODAL.WINNER.BORDER_RADIUS,
				}}
			>
				<CircleBorder
					style={{ marginVertical: MODAL.WINNER.AVATAR.MARGIN_VERTICAL }}
					label={client?.name ?? ''}
				>
					<Avatar.Image
						size={MODAL.WINNER.AVATAR.ICON_SIZE}
						source={require('../../assets/images/avatar.png')}
					/>
				</CircleBorder>
				<Text variant="headlineMedium">Chiến Thắng</Text>
				<Button mode="contained" onPress={onPressContinue} soundName="button_click.mp3" icon="skip-next">
					Tiếp tục
				</Button>
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
