import * as yup from 'yup';
import { IRoom } from '../../types';

export const createFormingValidation = (maxCapacity: IRoom.Room['maxCapacity']) =>
	yup.object().shape({
		name: yup.string().required('Tên phòng không được bỏ trống!'),
		maxCapacity: yup
			.number()
			.required('Số lượng không được bỏ trống!')
			.min(maxCapacity, `Ít nhất ${maxCapacity} thành viên`),
	});
