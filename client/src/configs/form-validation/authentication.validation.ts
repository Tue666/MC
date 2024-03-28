import * as yup from 'yup';

export const signInValidation = yup.object().shape({
	phone_number: yup.string().required('Số điện thoại không được bỏ trống!'),
	password: yup.string().required('Mật khẩu không được bỏ trống!'),
});

export const signUpValidation = yup.object().shape({
	phone_number: yup.string().required('Số điện thoại không được bỏ trống!'),
	password: yup.string().required('Mật khẩu không được bỏ trống!'),
	passwordConfirm: yup
		.string()
		.oneOf([yup.ref('password')], 'Mật khẩu không khớp!')
		.required('Mật khẩu không được bỏ trống'),
	name: yup.string().max(10, 'Tối đa 10 ký tự'),
});
