import { useSnackbar } from '../hooks';
import { SnackbarState } from '../redux/slices/snackbar.slice';
import { ICommon } from '../types';

let snackbarRef: ReturnType<typeof useSnackbar>;
const SnackbarUtilConfiguration = () => {
	snackbarRef = useSnackbar();

	return null;
};

export const openSnackbar = (state: ICommon.RequiredBy<Partial<SnackbarState>, 'content'>) => {
	snackbarRef.openSnackbar(state);
};

export const closeSnackbar = () => {
	snackbarRef.closeSnackbar();
};

export default SnackbarUtilConfiguration;
