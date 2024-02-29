import { useModal } from '../hooks';
import { ModalState } from '../redux/slices/modal.slice';

let modalRef: ReturnType<typeof useModal>;
const ModalUtilConfiguration = () => {
	modalRef = useModal();

	return null;
};

export const openModal = (state: Partial<ModalState>) => {
	modalRef.openModal(state);
};

export const closeModal = () => {
	modalRef.closeModal();
};

export default ModalUtilConfiguration;
