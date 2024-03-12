import { PermissionsAndroid } from 'react-native';
import {
	Callback,
	CameraOptions,
	launchImageLibrary as onLaunchImageLibrary,
	launchCamera as onLaunchCamera,
	ImageLibraryOptions,
} from 'react-native-image-picker';
import { openDialog } from '../utils';

const useImagePicker = () => {
	const launchCamera = async (options: CameraOptions, callback?: Callback) => {
		const permissionResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
		if (permissionResult !== PermissionsAndroid.RESULTS.GRANTED) {
			openDialog({
				title: 'Thất bại',
				content: 'Bạn cần cho phép quyền truy cập máy ảnh để tiếp tục.',
				actions: [{ label: 'Đồng ý' }],
			});
			return;
		}

		return onLaunchCamera(options, callback);
	};

	const launchImageLibrary = async (options: ImageLibraryOptions, callback?: Callback) => {
		const permissionResult = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
		);
		if (permissionResult !== PermissionsAndroid.RESULTS.GRANTED) {
			openDialog({
				title: 'Thất bại',
				content: 'Bạn cần cho phép quyền truy cập ảnh để tiếp tục.',
				actions: [{ label: 'Đồng ý' }],
			});
			return;
		}

		return onLaunchImageLibrary(options, callback);
	};

	return { launchCamera, launchImageLibrary };
};

export default useImagePicker;
