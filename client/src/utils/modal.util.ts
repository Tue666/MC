import { useModal } from '../hooks';
import { ModalComponent, ModalState } from '../redux/slices/modal.slice';

let modalRef: ReturnType<typeof useModal>;
const ModalUtilConfiguration = () => {
	modalRef = useModal();

	return null;
};

export const openModal = <T extends ModalComponent>(state: Partial<ModalState<T>>) => {
	modalRef.openModal<T>(state);
};

export const closeModal = () => {
	modalRef.closeModal();
};

export default ModalUtilConfiguration;
