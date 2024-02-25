import { useDialog } from '../hooks';
import { DialogState } from '../redux/slices/dialog.slice';

let dialogRef: any;
const DialogUtilConfiguration = () => {
	dialogRef = useDialog();

	return null;
};

export const openDialog = (state: Partial<DialogState> = {}) => {
	dialogRef.openDialog(state);
};

export const closeDialog = () => {
	dialogRef.closeDialog();
};

export default DialogUtilConfiguration;
