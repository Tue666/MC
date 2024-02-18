import base64 from 'react-native-base64';
import { AxiosError } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { IAccount, IOperation, IResource, IRole } from '../../types';
import { accountAPI, roleAPI } from '../../apis';
import { openDialog } from '../../utils/dialog.util';
import { JWTUtil } from '../../utils';

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
	resources: Resources;
}

const initialState: AccountState = {
	profile: {} as AccountState['profile'],
	resources: {} as Resources,
};

export const slice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		initAccount(state: AccountState, action: PayloadAction<AccountState>) {
			const { profile, resources } = action.payload;
			state.profile = profile;
			state.resources = resources;
		},
		clearAccount(state: AccountState) {
			state.profile = {} as AccountState['profile'];
			state.resources = {} as Resources;
		},
	},
});

const { reducer, actions } = slice;
export const { clearAccount } = actions;
export const selectAccount = (state: RootState) => state.account;
export default reducer;

export const initAccount = () => async (dispatch: AppDispatch) => {
	try {
		const { profile } = await accountAPI.getProfile();
		const { roles } = await roleAPI.findByIds({ _ids: profile?.roles || [] });
		const { mergedPermissions, mergedResources } = mergeRoles(roles);
		const encodePermissions = base64.encode(JSON.stringify(mergedPermissions));
		JWTUtil.setHeader(JWTUtil.ACCESS_RESOURCES_HEADER, encodePermissions);

		dispatch(
			slice.actions.initAccount({
				profile,
				resources: mergedResources,
			})
		);
	} catch (error) {
		openDialog({
			closable: false,
			content: `Đã có lỗi xảy ra: ${(error as AxiosError).response?.data}`,
		});
	}
};
