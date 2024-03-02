import { useAppDispatch } from '../redux/hooks';
import {
	initialState,
	ModalState,
	disappearModal,
	renderModal,
	ModalComponent,
} from '../redux/slices/modal.slice';

const useModal = () => {
	const dispatch = useAppDispatch();

	const openModal = <T extends ModalComponent>(state: Partial<ModalState<T>>) => {
		dispatch(renderModal({ ...initialState, ...state, isOpen: true }));
	};
	const closeModal = () => {
		dispatch(disappearModal());
	};

	return { openModal, closeModal };
};

export default useModal;
