import { useAppDispatch } from '../redux/hooks';
import {
	initialState,
	DialogState,
	disappearDialog,
	renderDialog,
} from '../redux/slices/dialog.slice';

const useDialog = () => {
	const dispatch = useAppDispatch();

	const openDialog = (state: Partial<DialogState>) => {
		dispatch(renderDialog({ ...initialState, ...state, isOpen: true }));
	};
	const closeDialog = () => {
		dispatch(disappearDialog());
	};
	return { openDialog, closeDialog };
};

export default useDialog;
