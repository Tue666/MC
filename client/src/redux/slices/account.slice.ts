import { AxiosError } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { IAccount, IOperation, IResource, IRole } from '../../types';
import { accountAPI, roleAPI } from '../../apis';
import { openDialog } from '../../utils/dialog.util';

const buildPermissionsFromRoles = (roles: IRole.Role[]): Permissions => {
	const buildPermissions = {} as Permissions;

	for (let i = 0; i < roles.length; i++) {
		const { permissions } = roles[i];

		for (let j = 0; j < permissions.length; j++) {
			const { resource, operations } = permissions[j];
			const operationIds = operations.map((operation) => operation._id);

			if (!buildPermissions[resource._id])
				buildPermissions[resource._id] = { ...resource, operations: operationIds };
			else
				buildPermissions[resource._id] = {
					...buildPermissions[resource._id],
					operations: [...new Set([...buildPermissions[resource._id].operations, ...operationIds])],
				};
		}
	}

	return buildPermissions;
};

export type Permissions = {
	[key: IResource.Resource['_id']]: Omit<IResource.Resource, 'operations'> & {
		operations: IOperation.Operation['_id'][];
	};
};

export interface AccountState {
	profile: IAccount.ProfileResponse['profile'];
	permissions: Permissions;
}

const initialState: AccountState = {
	profile: {} as AccountState['profile'],
	permissions: {} as Permissions,
};

export const slice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		initAccount(state: AccountState, action: PayloadAction<AccountState>) {
			const { profile, permissions } = action.payload;
			state.profile = profile;
			state.permissions = permissions;
		},
		clearAccount(state: AccountState) {
			state.profile = {} as AccountState['profile'];
			state.permissions = {} as Permissions;
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
		const permissions = buildPermissionsFromRoles(roles);

		dispatch(
			slice.actions.initAccount({
				profile,
				permissions,
			})
		);
	} catch (error) {
		openDialog({
			closable: false,
			content: `Đã có lỗi xảy ra: ${(error as AxiosError).response?.data}`,
		});
	}
};
