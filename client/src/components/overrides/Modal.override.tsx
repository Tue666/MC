import { Modal as RNPModal } from 'react-native-paper';
import { CreateForming, JoinForming, Winner } from '../modal';
import { useModal } from '../../hooks';
import { useAppSelector } from '../../redux/hooks';
import { ModalProps, selectModal } from '../../redux/slices/modal.slice';
import { globalStyles, stackStyles } from '../../styles';

const components = {
	DEFAULT: (props?: ModalProps['DEFAULT']) => null,
	CREATE_FORMING: (props: ModalProps['CREATE_FORMING']) => <CreateForming {...props} />,
	JOIN_FORMING: (props: ModalProps['JOIN_FORMING']) => <JoinForming {...props} />,
	WINNER: (props: ModalProps['WINNER']) => <Winner {...props} />,
};

const Modal = () => {
	const { isOpen, closable, component, params } = useAppSelector(selectModal);
	const { closeModal } = useModal();

	return (
		<RNPModal
			visible={isOpen}
			dismissable={closable}
			dismissableBackButton={closable}
			onDismiss={closeModal}
			contentContainerStyle={[globalStyles.full, stackStyles.center]}
		>
			{components[component](params)}
		</RNPModal>
	);
};

export default Modal;
