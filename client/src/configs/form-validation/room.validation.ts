import * as yup from 'yup';
import { IRoom } from '../../types';

export const createFormingValidation = (
	minToStart: IRoom.Room['minToStart'],
	maxCapacity: IRoom.Room['maxCapacity']
) =>
	yup.object().shape({
		name: yup.string().required('Tên phòng không được bỏ trống!'),
		maxCapacity: yup
			.number()
			.required('Số lượng không được bỏ trống!')
			.min(minToStart, `Ít nhất ${minToStart} thành viên`)
			.max(maxCapacity, `Nhiều nhất ${maxCapacity} thành viên`),
	});
