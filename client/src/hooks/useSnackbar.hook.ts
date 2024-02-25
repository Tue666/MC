import { useAppDispatch } from '../redux/hooks';
import {
	initialState,
	SnackbarState,
	disappearSnackbar,
	renderSnackbar,
} from '../redux/slices/snackbar.slice';
import { ICommon } from '../types';

const useSnackbar = () => {
	const dispatch = useAppDispatch();

	const openSnackbar = (state: ICommon.RequiredBy<Partial<SnackbarState>, 'content'>) => {
		dispatch(renderSnackbar({ ...initialState, ...state, isOpen: true }));
	};
	const closeSnackbar = () => {
		dispatch(disappearSnackbar());
	};
	return { openSnackbar, closeSnackbar };
};

export default useSnackbar;
