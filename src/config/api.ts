import type {
    IBackendRes,
    IAccount,
    IUser,
    IModelPaginate,
    IGetAccount,
    IRequestPasswordCode,
    IPermission,
    IRole,
    IEmployee,
    IConfirmResetPasswordRequest,
    ICompany,
    IAssetType,
    IDepartment,
    IPosition,
    ICustomer,
    IDeviceType,
    ISkill,
    ISolution,
    IWarehouse,
    IUnit,
    IRejectReason,
    ITechnicianSupplier,
    IIssue,
    IMaterialSupplier,
    ITechnician,
    IInventoryItem,
    IDevice,
    ICreateDeviceRequest,
    IUpdateDeviceRequest,
    IResUploadFileDTO,
    // IDevicePart,
    IShiftTemplate,
    IDeviceList,
    ITechnicianAvailability,
    IReqTechnicianAvailability,
    ICustomerPurchaseHistoryAdmin,
    ICustomerPurchaseHistoryClient,
    IResMaintenanceRejectDTO,
    IIssueSkillMappingRequest,
    IIssueSkillMappingResponse,
} from '@/types/backend';
import axios from 'config/axios-customize';
import type {
    IResMaintenanceRequestDTO,
    IResMaintenanceRequestDetailDTO,
    IResMaintenanceAssignmentDTO,
    IReqMaintenanceRequestInternalDTO,
    IReqMaintenanceRequestCustomerDTO,
} from '@/types/backend';
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

// ============================= Upload Single File ============================= //
export const callUploadSingleFile = (file: File, folderType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folderType);

    return axios.post<{ fileName: string; uploadedAt: string }[]>("/api/v1/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};


// ============================= Upload Multiple Files ============================= //
export const callUploadMultipleFiles = (files: File[], folderType: string) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("file", file);
    });
    formData.append("folder", folderType);

    return axios.post<IBackendRes<IResUploadFileDTO[]>>("/api/v1/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

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

interface IResponsePasswordCode {
    success: boolean;
    message: string;
}

export const callRequestPasswordCode = (data: IRequestPasswordCode) => {
    return axios.post<IBackendRes<IResponsePasswordCode>>('/api/v1/users/request-password-code', data);
};

export const callConfirmResetPassword = (data: IConfirmResetPasswordRequest) => {
    return axios.post<IBackendRes<IResponsePasswordCode>>('/api/v1/users/confirm-reset-password', data);
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

export const callUpdateEmployee = (data: {
    id: string;
    employeeCode: string;
    fullName: string;
    phone?: string;
    email?: string;
    departmentId: number;
    positionId: number;
    companyId: number;
}) => {
    return axios.put<IBackendRes<IEmployee>>(`/api/v1/employees`, data, {
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
    id: string;
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


/** ======================== Module Customer ======================== **/

export const callFetchDeviceType = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IDeviceType>>>(`/api/v1/device-types?${query}`);
};

export const callFetchDeviceTypeById = (id: number | string) => {
    return axios.get<IBackendRes<IDeviceType>>(`/api/v1/device-types/${id}`);
};
export const callCreateDeviceType = (payload: IDeviceType) => {
    const body = {
        deviceTypeCode: payload.deviceTypeCode,
        typeName: payload.typeName,
        assetType: { id: payload.assetType?.id },
    };
    return axios.post<IBackendRes<IDeviceType>>("/api/v1/device-types", body);
};
export const callUpdateDeviceType = (payload: IDeviceType) => {
    const body = {
        id: payload.id,
        deviceTypeCode: payload.deviceTypeCode,
        typeName: payload.typeName,
        assetType: { id: payload.assetType?.id },
    };
    return axios.put<IBackendRes<IDeviceType>>("/api/v1/device-types", body);
};

export const callDeleteDeviceType = (id: number | string) => {
    return axios.delete<IBackendRes<IDeviceType>>(`/api/v1/device-types/${id}`);
};
/** ======================== Module Customer Purchase History ======================== **/
export const callFetchCustomerPurchaseHistory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICustomerPurchaseHistoryAdmin>>>(
        `/api/v1/customer-purchases?${query}`
    );
};
export const callFetchCustomerPurchaseHistoryById = (id: string) => {
    return axios.get<IBackendRes<ICustomerPurchaseHistoryAdmin>>(
        `/api/v1/customer-purchases/${id}`
    );
};
export const callFetchCustomerPurchaseHistoryByCustomer = (customerId: string) => {
    return axios.get<IBackendRes<ICustomerPurchaseHistoryAdmin[]>>(
        `/api/v1/customer-purchases/by-customer/${customerId}`
    );
};
export const callFetchMyPurchaseHistory = () => {
    return axios.get<IBackendRes<IModelPaginate<ICustomerPurchaseHistoryClient>>>(
        `/api/v1/customer-purchases/my-history`
    );
};


/** ======================== Module Skill ======================== **/

export const callFetchSkill = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISkill>>>(`/api/v1/skills?${query}`);
};

export const callFetchSkillById = (id: number | string) => {
    return axios.get<IBackendRes<ISkill>>(`/api/v1/skills/${id}`);
};

export const callCreateSkill = (skill: ISkill) => {
    const payload = {
        techniqueName: skill.techniqueName,
    };
    return axios.post<IBackendRes<ISkill>>("/api/v1/skills", payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callUpdateSkill = (skill: ISkill) => {
    const payload = {
        id: skill.id,
        techniqueName: skill.techniqueName,
    };
    return axios.put<IBackendRes<ISkill>>("/api/v1/skills", payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callDeleteSkill = (id: number | string) => {
    return axios.delete<IBackendRes<ISkill>>(`/api/v1/skills/${id}`);
};



/** ======================== Module Solution  ======================== **/
export const callFetchSolution = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISolution>>>(`/api/v1/solutions?${query}`);
};
export const callFetchSolutionById = (id: number | string) => {
    return axios.get<IBackendRes<ISolution>>(`/api/v1/solutions/${id}`);
};
export const callCreateSolution = (solution: ISolution) => {
    const payload = {
        solutionName: solution.solutionName,
    };
    return axios.post<IBackendRes<ISolution>>("/api/v1/solutions", payload, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callUpdateSolution = (solution: ISolution) => {
    const payload = {
        id: solution.id,
        solutionName: solution.solutionName,
    };
    return axios.put<IBackendRes<ISolution>>("/api/v1/solutions", payload, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callDeleteSolution = (id: number | string) => {
    return axios.delete<IBackendRes<ISolution>>(`/api/v1/solutions/${id}`);
};


/** ======================== Module Warehouse  ======================== **/

export const callFetchWarehouse = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IWarehouse>>>(`/api/v1/warehouses?${query}`);
};

export const callFetchWarehouseById = (id: number | string) => {
    return axios.get<IBackendRes<IWarehouse>>(`/api/v1/warehouses/${id}`);
};
export const callCreateWarehouse = (warehouse: IWarehouse) => {
    const payload = {
        warehouseName: warehouse.warehouseName,
        address: warehouse.address,
    };
    return axios.post<IBackendRes<IWarehouse>>("/api/v1/warehouses", payload, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callUpdateWarehouse = (warehouse: IWarehouse) => {
    const payload = {
        id: warehouse.id,
        warehouseName: warehouse.warehouseName,
        address: warehouse.address,
    };
    return axios.put<IBackendRes<IWarehouse>>("/api/v1/warehouses", payload, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callDeleteWarehouse = (id: number | string) => {
    return axios.delete<IBackendRes<IWarehouse>>(`/api/v1/warehouses/${id}`);
};




/** ======================== Module Unit  ======================== **/
export const callFetchUnit = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUnit>>>(`/api/v1/units?${query}`);
};

export const callFetchUnitById = (id: number | string) => {
    return axios.get<IBackendRes<IUnit>>(`/api/v1/units/${id}`);
};

export const callCreateUnit = (unit: IUnit) => {
    const payload = {
        name: unit.name,
    };
    return axios.post<IBackendRes<IUnit>>("/api/v1/units", payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callUpdateUnit = (unit: IUnit) => {
    const payload = {
        id: unit.id,
        name: unit.name,
    };
    return axios.put<IBackendRes<IUnit>>("/api/v1/units", payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callDeleteUnit = (id: number | string) => {
    return axios.delete<IBackendRes<IUnit>>(`/api/v1/units/${id}`);
};


/** ======================== Module RejectReason  ======================== **/

export const callFetchRejectReason = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRejectReason>>>(`/api/v1/reject-reasons?${query}`);
};
export const callFetchRejectReasonById = (id: string | number) => {
    return axios.get<IBackendRes<IRejectReason>>(`/api/v1/reject-reasons/${id}`);
};
export const callCreateRejectReason = (reason: IRejectReason) => {
    return axios.post<IBackendRes<IRejectReason>>(`/api/v1/reject-reasons`, reason, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callUpdateRejectReason = (reason: IRejectReason) => {
    return axios.put<IBackendRes<IRejectReason>>(`/api/v1/reject-reasons`, reason, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callDeleteRejectReason = (id: string | number) => {
    return axios.delete<IBackendRes<IRejectReason>>(`/api/v1/reject-reasons/${id}`);
};
export const callFetchTechnicianSupplier = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ITechnicianSupplier>>>(
        `/api/v1/technician-suppliers?${query}`
    );
};


/** ======================== Module TechnicianSupplier  ======================== **/
export const callFetchTechnicianSupplierById = (id: number | string) => {
    return axios.get<IBackendRes<ITechnicianSupplier>>(
        `/api/v1/technician-suppliers/${id}`
    );
};
export const callCreateTechnicianSupplier = (data: ITechnicianSupplier) => {
    return axios.post<IBackendRes<ITechnicianSupplier>>(
        `/api/v1/technician-suppliers`,
        data
    );
};
export const callUpdateTechnicianSupplier = (data: ITechnicianSupplier) => {
    return axios.put<IBackendRes<ITechnicianSupplier>>(
        `/api/v1/technician-suppliers`,
        data
    );
};
export const callDeleteTechnicianSupplier = (id: number | string) => {
    return axios.delete<IBackendRes<ITechnicianSupplier>>(
        `/api/v1/technician-suppliers/${id}`
    );
};


/** ========================= MODULE ISSUE ========================= **/

export const callFetchIssue = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IIssue>>>(`/api/v1/issues?${query}`);
};
export const callFetchIssueById = (id: string | number) => {
    return axios.get<IBackendRes<IIssue>>(`/api/v1/issues/${id}`);
};
export const callCreateIssue = (issue: IIssue) => {
    return axios.post<IBackendRes<IIssue>>(`/api/v1/issues`, issue, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callUpdateIssue = (issue: IIssue) => {
    return axios.put<IBackendRes<IIssue>>(`/api/v1/issues`, issue, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callDeleteIssue = (id: string | number) => {
    return axios.delete<IBackendRes<string>>(`/api/v1/issues/${id}`);
};


/** ========================= MODULE MATERIAL SUPPLIER ========================= **/
export const callFetchMaterialSupplier = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IMaterialSupplier>>>(`/api/v1/material-suppliers?${query}`);
};

export const callFetchMaterialSupplierById = (id: string | number) => {
    return axios.get<IBackendRes<IMaterialSupplier>>(`/api/v1/material-suppliers/${id}`);
};

export const callCreateMaterialSupplier = (data: IMaterialSupplier) => {
    return axios.post<IBackendRes<IMaterialSupplier>>(`/api/v1/material-suppliers`, data, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callUpdateMaterialSupplier = (data: IMaterialSupplier) => {
    return axios.put<IBackendRes<IMaterialSupplier>>(`/api/v1/material-suppliers`, data, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callDeleteMaterialSupplier = (id: string | number) => {
    return axios.delete<IBackendRes<string>>(`/api/v1/material-suppliers/${id}`);
};


/** ========================= MODULE TECHNICIAN ========================= **/
/** ========================= MODULE TECHNICIAN ========================= **/


export const callFetchTechnician = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ITechnician>>>(`/api/v1/technicians?${query}`);
};

export const callFetchTechnicianById = (id: string | number) => {
    return axios.get<IBackendRes<ITechnician>>(`/api/v1/technicians/${id}`);
};

export const callCreateTechnician = (technician: ITechnician) => {
    const payload = {
        technicianCode: technician.technicianCode,
        fullName: technician.fullName,
        activeStatus: technician.activeStatus ?? true,
        technicianType: technician.technicianType,
        technicianSupplierId:
            technician.technicianType === "OUTSOURCE"
                ? technician.technicianSupplierId
                : null,
        costPerHire:
            technician.technicianType === "OUTSOURCE"
                ? technician.costPerHire
                : 0,
        phone: technician.phone,
        email: technician.email,
        skillIds: technician.skillIds ?? [],
    };

    return axios.post<IBackendRes<ITechnician>>(`/api/v1/technicians`, payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callUpdateTechnician = (technician: ITechnician) => {
    const payload = {
        id: technician.id,
        technicianCode: technician.technicianCode,
        fullName: technician.fullName,
        activeStatus: technician.activeStatus ?? true,
        technicianType: technician.technicianType,
        technicianSupplierId:
            technician.technicianType === "OUTSOURCE"
                ? technician.technicianSupplierId
                : null,
        costPerHire:
            technician.technicianType === "OUTSOURCE"
                ? technician.costPerHire
                : 0,
        phone: technician.phone,
        email: technician.email,
        skillIds: technician.skillIds ?? [],
    };

    return axios.put<IBackendRes<ITechnician>>(`/api/v1/technicians`, payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callDeleteTechnician = (id: number | string) => {
    return axios.delete<IBackendRes<string>>(`/api/v1/technicians/${id}`);
};




/** ======================== Module InventoryItem ======================== **/
export const callFetchInventoryItem = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IInventoryItem>>>(`/api/v1/inventory-items?${query}`);
};
export const callFetchInventoryItemById = (id: string | number) => {
    return axios.get<IBackendRes<IInventoryItem>>(`/api/v1/inventory-items/${id}`);
};
export const callCreateInventoryItem = (data: IInventoryItem) => {
    const payload = {
        itemCode: data.itemCode,
        itemName: data.itemName,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        unitId: Number(data.unit.id),
        deviceTypeId: Number(data.deviceType.id),
        warehouseId: Number(data.warehouse.id),
        materialSupplierId: Number(data.materialSupplier.id),
    };

    return axios.post<IBackendRes<IInventoryItem>>(`/api/v1/inventory-items`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
};
export const callUpdateInventoryItem = (data: IInventoryItem) => {
    const payload = {
        id: data.id,
        itemCode: data.itemCode,
        itemName: data.itemName,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        unitId: Number(data.unit.id),
        deviceTypeId: Number(data.deviceType.id),
        warehouseId: Number(data.warehouse.id),
        materialSupplierId: Number(data.materialSupplier.id),
    };

    return axios.put<IBackendRes<IInventoryItem>>(`/api/v1/inventory-items`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
};
export const callDeleteInventoryItem = (id: string | number) => {
    return axios.delete<IBackendRes<null>>(`/api/v1/inventory-items/${id}`);
};

// /** ======================== Module Device Parts ======================== **/

// export const callFetchDeviceParts = (deviceId: string) => {
//     return axios.get<IBackendRes<IDevicePart[]>>(`/api/v1/device-parts/${deviceId}`);
// };

// export const callSyncDeviceParts = (deviceId: string, parts: IDevicePart[]) => {
//     return axios.post<IBackendRes<null>>(`/api/v1/device-parts/${deviceId}`, parts, {
//         headers: { "Content-Type": "application/json" },
//     });
// };

/** ======================== Module Devices ======================== **/

export const callFetchDevice = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IDeviceList>>>(`/api/v1/devices?${query}`);
};
export const callFetchDeviceById = (id: string) => {
    return axios.get<IBackendRes<IDevice>>(`/api/v1/devices/${id}`);
};
export const callCreateDevice = (data: ICreateDeviceRequest) => {
    return axios.post<IBackendRes<IDevice>>(`/api/v1/devices`, data, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callUpdateDevice = (id: string, data: IUpdateDeviceRequest) => {
    return axios.put<IBackendRes<IDevice>>(`/api/v1/devices/${id}`, data, {
        headers: { "Content-Type": "application/json" },
    });
};
export const callDeleteDevice = (id: string) => {
    return axios.delete<IBackendRes<null>>(`/api/v1/devices/${id}`);
};




/** ======================== Module ShiftTemplate ======================== **/

export const callFetchShiftTemplate = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IShiftTemplate>>>(`/api/v1/shift-templates?${query}`);
};

export const callFetchShiftTemplateById = (id: string) => {
    return axios.get<IBackendRes<IShiftTemplate>>(`/api/v1/shift-templates/${id}`);
};

export const callCreateShiftTemplate = (data: IShiftTemplate) => {
    const payload = {
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
        note: data.note,
        active: data.active ?? true,
    };

    return axios.post<IBackendRes<IShiftTemplate>>(`/api/v1/shift-templates`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
};
export const callUpdateShiftTemplate = (data: IShiftTemplate) => {
    const payload = {
        id: data.id,
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
        note: data.note,
        active: data.active,
    };

    return axios.put<IBackendRes<IShiftTemplate>>(`/api/v1/shift-templates`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
};


export const callDeleteShiftTemplate = (id: string) => {
    return axios.delete<IBackendRes<null>>(`/api/v1/shift-templates/${id}`);
};

/** ======================== Module Technician Availability ======================== **/

export const callFetchTechnicianAvailability = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ITechnicianAvailability>>>(
        `/api/v1/technician-availabilities?${query}`
    );
};

export const callFetchTechnicianAvailabilityById = (id: string) => {
    return axios.get<IBackendRes<ITechnicianAvailability>>(
        `/api/v1/technician-availabilities/${id}`
    );
};

export const callCreateTechnicianAvailability = (data: IReqTechnicianAvailability) => {
    return axios.post<IBackendRes<ITechnicianAvailability[]>>(
        `/api/v1/technician-availabilities`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
    );
};

export const callUpdateTechnicianAvailability = (id: string, data: IReqTechnicianAvailability) => {
    return axios.put<IBackendRes<ITechnicianAvailability>>(
        `/api/v1/technician-availabilities/${id}`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
    );
};

export const callDeleteTechnicianAvailability = (id: string) => {
    return axios.delete<IBackendRes<null>>(`/api/v1/technician-availabilities/${id}`);
};

export const callFetchMyTechnicianAvailability = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ITechnicianAvailability>>>(
        `/api/v1/technician-availabilities/my?${query}`
    );
};



/** ======================== Module Maintenance Request ======================== **/
// Lấy danh sách phiếu bảo trì
export const callFetchMaintenanceRequest = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResMaintenanceRequestDTO>>>(
        `/api/v1/maintenance-requests?${query}`
    );
};

// Lấy chi tiết 1 phiếu bảo trì theo ID
export const callFetchMaintenanceRequestById = (id: string) => {
    return axios.get<IBackendRes<IResMaintenanceRequestDetailDTO>>(
        `/api/v1/maintenance-requests/${id}`
    );
};
// Lấy log từ chối bảo trì
export const callFetchRejectLogsByRequestId = (id: string) => {
    return axios.get<IBackendRes<IResMaintenanceRejectDTO>>(
        `/api/v1/maintenance-requests/${id}/reject-logs`
    );
};
// ======================= TẠO PHIẾU BẢO TRÌ ======================= //

// Tạo phiếu bảo trì nội bộ (nhân viên)
export const callCreateInternalMaintenanceRequest = (data: IReqMaintenanceRequestInternalDTO) => {
    return axios.post<IBackendRes<IResMaintenanceRequestDTO>>(
        `/api/v1/maintenance-requests/internal`,
        data,
        { headers: { "Content-Type": "application/json" } }
    );
};
// Tạo phiếu bảo trì cho khách hàng
export const callCreateCustomerMaintenanceRequest = (data: IReqMaintenanceRequestCustomerDTO) => {
    return axios.post<IBackendRes<IResMaintenanceRequestDTO>>(
        `/api/v1/maintenance-requests/customer`,
        data,
        { headers: { "Content-Type": "application/json" } }
    );
};


// ======================= DANH SÁCH PHIẾU BẢO TRÌ CỦA CHÍNH KHÁCH HÀNG ======================= //
export const callFetchMyMaintenanceRequests = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResMaintenanceRequestDTO>>>(
        `/api/v1/customers/maintenance-requests?${query}`
    );
};




// ======================= PHÂN CÔNG KỸ THUẬT VIÊN ======================= //
export const callAssignTechnicianManual = (
    requestId: string,
    technicianId: string
) => {
    return axios.post<IBackendRes<IResMaintenanceAssignmentDTO>>(
        `/api/v1/maintenance-requests/assign-technician`,
        { requestId, technicianId }
    );
};

// ======================= PHÂN CÔNG TỰ ĐỘNG ======================= //
export const callAutoAssignAll = () => {
    return axios.post<IBackendRes<IResMaintenanceAssignmentDTO[]>>(
        `/api/v1/maintenance-requests/auto-assign`
    );
};
// ======================= ISSUE – SKILL MAPPING ======================= //
export const callFetchIssueSkillMappings = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IIssueSkillMappingResponse>>>(
        `/api/v1/issue-skill-mappings?${query}`
    );
};

export const callCreateIssueSkillMapping = (data: IIssueSkillMappingRequest) => {
    return axios.post<IBackendRes<IIssueSkillMappingResponse>>(
        `/api/v1/issue-skill-mappings`,
        data
    );
};

export const callUpdateIssueSkillMapping = (
    data: IIssueSkillMappingResponse
) => {
    return axios.put<IBackendRes<IIssueSkillMappingResponse>>(
        `/api/v1/issue-skill-mappings`,
        data
    );
};

export const callDeleteIssueSkillMapping = (id: string | number) => {
    return axios.delete<IBackendRes<void>>(
        `/api/v1/issue-skill-mappings/${id}`
    );
};
