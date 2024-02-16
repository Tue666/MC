import { useAppDispatch } from '../redux/hooks';
import { DialogState, disappearDialog, renderDialog } from '../redux/slices/dialog.slice';

const useDialog = () => {
	const dispatch = useAppDispatch();

	const openDialog = (state: Partial<DialogState>) => {
		dispatch(renderDialog({ ...state, isOpen: true }));
	};
	const closeDialog = () => {
		dispatch(disappearDialog());
	};
	return { openDialog, closeDialog };
};

export default useDialog;
