import type {
    IBackendRes,
    IAccount,
    IUser,
    IModelPaginate,
    IGetAccount,
    IPermission,
    IRole,
    IForgotPasswordRequest,
    IConfirmResetPasswordRequest,
    ISendAccountInfoRequest,
} from '@/types/backend';
import axios from 'config/axios-customize';

/** Module Auth **/
export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}



//================================ Module User ================================//

export const callCreateUser = (user: IUser) => {
    const payload = {
        name: user.name,
        email: user.email,
        password: (user as any).password,
        address: user.address,
        role: { id: user.role?.id },
    };

    return axios.post<IBackendRes<IUser>>('/api/v1/users', payload, {
        headers: { 'Content-Type': 'application/json' },
    });
};


export const callUpdateUser = (user: IUser) => {
    const payload = {
        id: user.id,
        name: user.name,
        address: user.address,
        role: { id: user.role?.id },
        active: user.active,
    };

    return axios.put<IBackendRes<IUser>>('/api/v1/users', payload, {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
};

export const callFetchUserById = (id: string | number) => {
    return axios.get<IBackendRes<IUser>>(`/api/v1/users/${id}`);
};

export const callForgotPassword = (data: IForgotPasswordRequest) => {
    return axios.post<IBackendRes<string>>('/api/v1/users/forgot-password', data);
};

export const callConfirmResetPassword = (data: IConfirmResetPasswordRequest) => {
    return axios.post<IBackendRes<string>>('/api/v1/users/confirm-reset-password', data);
};

export const callSendAccountInfo = (data: ISendAccountInfoRequest) => {
    return axios.post<IBackendRes<string>>('/api/v1/users/send-account-info', data);
};
//================================End Module User ================================//


/** Module Permission **/
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.put<IBackendRes<IPermission>>(`/api/v1/permissions`, { id, ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**  Module Role **/
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.put<IBackendRes<IRole>>(`/api/v1/roles`, { id, ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}
