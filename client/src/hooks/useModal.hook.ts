import { useAppDispatch } from '../redux/hooks';
import { initialState, ModalState, disappearModal, renderModal } from '../redux/slices/modal.slice';

const useModal = () => {
	const dispatch = useAppDispatch();

	const openModal = (state: Partial<ModalState>) => {
		dispatch(renderModal({ ...initialState, ...state, isOpen: true }));
	};
	const closeModal = () => {
		dispatch(disappearModal());
	};
	return { openModal, closeModal };
};

export default useModal;
