import type {
    IBackendRes,
    IAccount,
    IUser,
    IModelPaginate,
    IGetAccount,
    IPermission,
    IRole,
    IEmployee,
    IForgotPasswordRequest,
    IConfirmResetPasswordRequest,
    ISendAccountInfoRequest,
    ICompany,
    IAssetType,
    IDepartment,
    IPosition,
    ICustomer
} from '@/types/backend';
import axios from 'config/axios-customize';

//================================ Module Auth ================================//

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

//================================Module Permission ================================//

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

//================================Module Role ================================//
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

//================================Module Company ================================//

export const callCreateCompany = (company: ICompany) => {
    const payload = {
        companyCode: company.companyCode, name: company.name, address: company.address, phone: company.phone, email: company.email,
    };
    return axios.post<IBackendRes<ICompany>>('/api/v1/companies', payload, {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const callUpdateCompany = (company: ICompany) => {
    const payload = {
        id: company.id, companyCode: company.companyCode, name: company.name, address: company.address, phone: company.phone, email: company.email,
    };
    return axios.put<IBackendRes<ICompany>>('/api/v1/companies', payload, {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const callDeleteCompany = (id: number | string) => {
    return axios.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
};


export const callFetchCompany = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICompany>>>(`/api/v1/companies?${query}`);
};


export const callFetchCompanyById = (id: number | string) => {
    return axios.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
};
//================================Module AssetType  ================================//
export const callCreateAssetType = (assetType: IAssetType) => {
    const payload = {
        assetTypeCode: assetType.assetTypeCode,
        assetTypeName: assetType.assetTypeName,
    };

    return axios.post<IBackendRes<IAssetType>>("/api/v1/asset-types", payload, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callUpdateAssetType = (assetType: IAssetType) => {
    const payload = {
        id: assetType.id,
        assetTypeCode: assetType.assetTypeCode,
        assetTypeName: assetType.assetTypeName,
    };

    return axios.put<IBackendRes<IAssetType>>("/api/v1/asset-types", payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callDeleteAssetType = (id: number | string) => {
    return axios.delete<IBackendRes<null>>(`/api/v1/asset-types/${id}`);
};

export const callFetchAssetType = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IAssetType>>>(`/api/v1/asset-types?${query}`);
};

export const callFetchAssetTypeById = (id: number | string) => {
    return axios.get<IBackendRes<IAssetType>>(`/api/v1/asset-types/${id}`);
};


//================================Module Department  ================================//
export const callCreateDepartment = (dept: IDepartment) => {
    const payload = {
        departmentCode: dept.departmentCode,
        name: dept.name,
        company: { id: dept.company.id },
    };

    return axios.post<IBackendRes<IDepartment>>("/api/v1/departments", payload, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callUpdateDepartment = (dept: IDepartment) => {
    const payload = {
        id: dept.id,
        departmentCode: dept.departmentCode,
        name: dept.name,
        company: { id: dept.company.id },
    };
    return axios.put<IBackendRes<IDepartment>>("/api/v1/departments", payload, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callDeleteDepartment = (id: number | string) => {
    return axios.delete<IBackendRes<null>>(`/api/v1/departments/${id}`);
};
export const callFetchDepartment = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IDepartment>>>(`/api/v1/departments?${query}`);
};

export const callFetchDepartmentById = (id: number | string) => {
    return axios.get<IBackendRes<IDepartment>>(`/api/v1/departments/${id}`);
};
/** ======================== Module Position ======================== **/

export const callFetchPosition = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPosition>>>(`/api/v1/positions?${query}`);
};

export const callFetchPositionById = (id: string | number) => {
    return axios.get<IBackendRes<IPosition>>(`/api/v1/positions/${id}`);
};

export const callCreatePosition = (data: { name: string }) => {
    return axios.post<IBackendRes<IPosition>>(`/api/v1/positions`, data, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callUpdatePosition = (data: IPosition) => {
    return axios.put<IBackendRes<IPosition>>(`/api/v1/positions`, data, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callDeletePosition = (id: string | number) => {
    return axios.delete<IBackendRes<IPosition>>(`/api/v1/positions/${id}`);
};

/** ======================== Module Employee ======================== **/

export const callFetchEmployee = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IEmployee>>>(`/api/v1/employees?${query}`);
};

export const callFetchEmployeeById = (id: string | number) => {
    return axios.get<IBackendRes<IEmployee>>(`/api/v1/employees/${id}`);
};

export const callCreateEmployee = (data: {
    employeeCode: string;
    fullName: string;
    phone?: string;
    email?: string;
    departmentId: number;
    positionId: number;
    companyId: number;
}) => {
    return axios.post<IBackendRes<IEmployee>>(`/api/v1/employees`, data, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callUpdateEmployee = (
    id: string | number,
    data: {
        employeeCode: string;
        fullName: string;
        phone?: string;
        email?: string;
        departmentId: number;
        positionId: number;
        companyId: number;
    }
) => {
    return axios.put<IBackendRes<IEmployee>>(`/api/v1/employees/${id}`, data, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callDeleteEmployee = (id: string | number) => {
    return axios.delete<IBackendRes<IEmployee>>(`/api/v1/employees/${id}`);
};


/** ======================== Module Customer ======================== **/

export const callFetchCustomer = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICustomer>>>(`/api/v1/customers?${query}`);
};

export const callFetchCustomerById = (id: string | number) => {
    return axios.get<IBackendRes<ICustomer>>(`/api/v1/customers/${id}`);
};

export const callCreateCustomer = (data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
}) => {
    return axios.post<IBackendRes<ICustomer>>(`/api/v1/customers`, data, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callUpdateCustomer = (data: {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}) => {
    return axios.put<IBackendRes<ICustomer>>(`/api/v1/customers`, data, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callDeleteCustomer = (id: string | number) => {
    return axios.delete<IBackendRes<ICustomer>>(`/api/v1/customers/${id}`);
};
