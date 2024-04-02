import base64 from 'react-native-base64';
import { AxiosError } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountAPI, RoleAPI } from '../../apis';
import { ConstantConfig } from '../../configs';
import { IAccount, IOperation, IResource, IRole, ISchema } from '../../types';
import { JWTUtil, openDialog, openSnackbar } from '../../utils';
import { AppDispatch, RootState } from '../store';

const { MAX_MATCH_VISIBLE_PER_ACCOUNT } = ConstantConfig;

const mergeRoles = (
	roles: IRole.Role[]
): { mergedPermissions: Permissions; mergedResources: Resources } => {
	const mergedPermissions = {} as Permissions;
	const mergedResources = {} as Resources;

	for (let i = 0; i < roles.length; i++) {
		const { permissions } = roles[i];

		for (let j = 0; j < permissions.length; j++) {
			const { resource, operations } = permissions[j];
			const operationIds = operations.map((operation) => operation._id);

			if (!mergedPermissions[resource._id] && !mergedResources[resource._id]) {
				mergedPermissions[resource._id] = operationIds;
				mergedResources[resource._id] = { ...resource, operations: operationIds };
			} else {
				mergedPermissions[resource._id] = [
					...new Set([...mergedPermissions[resource._id], ...operationIds]),
				];
				mergedResources[resource._id] = {
					...mergedResources[resource._id],
					operations: [...new Set([...mergedResources[resource._id].operations, ...operationIds])],
				};
			}
		}
	}

	return { mergedPermissions, mergedResources };
};

export type Permissions = {
	[key: IResource.Resource['_id']]: IOperation.Operation['_id'][];
};

export type Resources = {
	[key: IResource.Resource['_id']]: Omit<IResource.Resource, 'operations'> & {
		operations: IOperation.Operation['_id'][];
	};
};

export interface AccountState {
	profile: IAccount.ProfileResponse['profile'];
	point: ISchema.Point;
	resources: Resources;
}

const initialState: AccountState = {
	profile: {} as AccountState['profile'],
	point: {} as ISchema.Point,
	resources: {} as Resources,
};

export const slice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		initAccountSuccess(state: AccountState, action: PayloadAction<AccountState>) {
			const { profile, point, resources } = action.payload;

			state.profile = profile;
			state.point = point;
			state.resources = resources;
		},
		updateProfile(state: AccountState, action: PayloadAction<Partial<AccountState['profile']>>) {
			if (action.payload.matches) {
				action.payload.matches = action.payload.matches.slice(0, MAX_MATCH_VISIBLE_PER_ACCOUNT);
			}

			const newProfile = {
				...state.profile,
				...action.payload,
			};

			state.profile = newProfile;
		},
		updateCoverSuccess(
			state: AccountState,
			action: PayloadAction<IAccount.UpdateCoverResponse['account']>
		) {
			const { cover } = action.payload;

			state.profile = { ...state.profile, cover };
		},
		updateAvatarSuccess(
			state: AccountState,
			action: PayloadAction<IAccount.UpdateAvatarResponse['account']>
		) {
			const { avatar } = action.payload;

			state.profile = { ...state.profile, avatar };
		},
		clearAccount(state: AccountState) {
			state.profile = {} as AccountState['profile'];
			state.resources = {} as Resources;
		},
	},
});

const { reducer, actions } = slice;
export const { updateProfile, clearAccount } = actions;
export const selectAccount = (state: RootState) => state.account;
export default reducer;

export const initAccount = () => async (dispatch: AppDispatch) => {
	try {
		const { profile, point } = await AccountAPI.getProfile();
		const { roles } = await RoleAPI.findByIds({ _ids: profile?.roles || [] });
		const { mergedPermissions, mergedResources } = mergeRoles(roles);
		const encodePermissions = base64.encode(JSON.stringify(mergedPermissions));
		JWTUtil.setHeader(JWTUtil.ACCESS_RESOURCES_HEADER, encodePermissions);

		dispatch(
			slice.actions.initAccountSuccess({
				profile,
				point,
				resources: mergedResources,
			})
		);
	} catch (error) {
		openDialog({
			title: 'Lỗi',
			content: `${(error as AxiosError).response?.data}`,
		});
	}
};

export const updateCover =
	(updateCoverBody: IAccount.UpdateCoverBody) => async (dispatch: AppDispatch) => {
		try {
			const { account, error } = await AccountAPI.updateCover(updateCoverBody);
			if (error) {
				openDialog({
					title: 'Lỗi',
					content: error,
				});
				return;
			}

			dispatch(slice.actions.updateCoverSuccess(account));
			openSnackbar({
				content: 'Cập nhật ảnh thành công',
			});
		} catch (error) {
			openDialog({
				title: 'Lỗi',
				content: `${(error as AxiosError).response?.data}`,
			});
		}
	};

export const updateAvatar =
	(updateAvatarBody: IAccount.UpdateAvatarBody) => async (dispatch: AppDispatch) => {
		try {
			const { account, error } = await AccountAPI.updateAvatar(updateAvatarBody);
			if (error) {
				console.log(error);
				openDialog({
					title: 'Lỗi',
					content: error,
				});
				return;
			}

			dispatch(slice.actions.updateAvatarSuccess(account));
			openSnackbar({
				content: 'Cập nhật ảnh thành công',
			});
		} catch (error) {
			console.log(error);
			openDialog({
				title: 'Lỗi',
				content: `${(error as AxiosError).response?.data}`,
			});
		}
	};
