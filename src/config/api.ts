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
    ICreatePartRequest,
    IDevice,
    ICreateDeviceRequest,
    IUpdatePartStatusRequest,
    IUpdateDeviceRequest,
    IResUploadFileDTO,
    IDevicePart,
    IShiftTemplate,
    IDeviceList,
    ITechnicianAvailability,
    IReqTechnicianAvailability,
    ICustomerPurchaseHistoryAdmin,
    ICustomerPurchaseHistoryClient,
    IResMaintenanceRejectDTO,
    IIssueSkillMappingRequest,
    IIssueSkillMappingResponse,
    IReqRejectAssignmentDTO,
    IResTechnicianAssignmentDTO,
    IReqMaintenanceSurveyDTO,
    IResMaintenanceSurveyDTO,
    IResMaintenanceSurveyListDTO,
    IReqMaintenancePlanDTO,
    IResMaintenancePlanCreateDTO,
    IResMaintenanceSurveyedListDTO,
    IResMaintenanceSurveyedDetailDTO,
    IResMaintenancePlanApprovalListDTO,
    IResMaintenancePlanDetailDTO,
    IResMaintenancePlanMaterialGroupDTO,
    IResMaintenancePlanApprovalDTO,
    IReqRejectPlanDTO,
    IResExecutionCardDTO,
    IResExecutionDetailDTO,
    IResAdminExecutionCardDTO,
    IResAdminExecutionDetailDTO,
    IReqUpdateTaskDTO,
    IReqAcceptanceApproveDTO,
    IReqAcceptanceRejectDTO,
    IResAcceptanceDTO,
    IResAcceptanceCardDTO,
    IResAcceptanceDetailDTO,

    IMaintenanceSchedule,
    IMaintenanceScheduleDetail,
    IMaintenanceScheduleByDevice,
    IReqSupportRequestDTO,
    IReqSupportApproveDTO,
    IResSupportRequestDTO,
    INotification

} from '@/types/backend';
// THỐNG KÊ BÁO CÁO
import type {
    // request DTO
    IRequestMaintenanceFilter,
    IDeviceHistoryFilter,
    IMaterialUsageFilter,
    ITechnicianActivityFilter,
    IDeviceDepreciationFilter,
    IWarrantyProductFilter,

    // Response DTO
    IMaintenanceRequestReport,
    IDeviceMaintenanceHistory,
    IMaterialUsageReport,
    ITechnicianActivityReport,
    IDeviceDepreciationReport,
    IWarrantyProductReport,
} from "@/types/backend";
import axios from 'config/axios-customize';
import type { IMaintenanceCause, IMaintenanceCauseRequest } from "@/types/backend";
import type {
    IResMaintenanceRequestDTO,
    IResMaintenanceRequestDetailDTO,
    IResMaintenanceAssignmentDTO,
    IReqMaintenanceRequestInternalDTO,
    IReqMaintenanceRequestCustomerDTO,
    IReqUpdateProfileDTO
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

export const callUpdateProfile = (data: IReqUpdateProfileDTO) => {
    return axios.put<IBackendRes<{ user: IAccount["user"] }>>("/api/v1/auth/update-profile", data);
};

// ============================= Upload Single File ============================= //
export const callUploadSingleFile = (file: File, folderType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folderType.toLowerCase());

    return axios.post<IBackendRes<IResUploadFileDTO[]>>(
        "/api/v1/files",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
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
        role: user.role?.id ? { id: user.role.id } : undefined,
        accountType: user.accountTypeDisplay || null,
    };

    return axios.put<IBackendRes<IUser>>("/api/v1/users", payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
};

export const callFetchUserById = (id: string | number) => {
    return axios.get<IBackendRes<IUser>>(`/api/v1/users/${id}`);
};
export const callDeactivateUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
};

export const callRestoreUser = (id: string) => {
    return axios.put<IBackendRes<IUser>>(`/api/v1/users/${id}/restore`);
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



//================================Module MaintenanceCause ================================//
export const callFetchMaintenanceCause = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IMaintenanceCause>>>(
        `/api/v1/causes?${query}`
    );
}

export const callFetchMaintenanceCauseById = (id: string) => {
    return axios.get<IBackendRes<IMaintenanceCause>>(`/api/v1/causes/${id}`);
};

export const callCreateMaintenanceCause = (payload: IMaintenanceCauseRequest) => {
    return axios.post<IBackendRes<IMaintenanceCause>>(`/api/v1/causes`, payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callUpdateMaintenanceCause = (payload: IMaintenanceCauseRequest) => {
    return axios.put<IBackendRes<IMaintenanceCause>>(`/api/v1/causes`, payload, {
        headers: { "Content-Type": "application/json" },
    });
};


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
    supervisorId?: string | null;
}) => {
    const payload = {
        employeeCode: data.employeeCode,
        fullName: data.fullName,
        phone: data.phone ?? null,
        email: data.email ?? null,
        departmentId: data.departmentId,
        positionId: data.positionId,
        companyId: data.companyId,
        supervisorId: data.supervisorId ?? null,
    };

    return axios.post<IBackendRes<IEmployee>>(`/api/v1/employees`, payload, {
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
    supervisorId?: string | null;
}) => {
    const payload = {
        id: data.id,
        employeeCode: data.employeeCode,
        fullName: data.fullName,
        phone: data.phone ?? null,
        email: data.email ?? null,
        departmentId: data.departmentId,
        positionId: data.positionId,
        companyId: data.companyId,
        supervisorId: data.supervisorId ?? null,
    };

    return axios.put<IBackendRes<IEmployee>>(`/api/v1/employees`, payload, {
        headers: { "Content-Type": "application/json" },
    });
};

// Vô hiệu hóa (soft delete)
export const callDeactivateEmployee = (id: string) => {
    return axios.delete<IBackendRes<IEmployee>>(`/api/v1/employees/${id}`);
};

// Phục hồi (restore)
export const callRestoreEmployee = (id: string) => {
    return axios.put<IBackendRes<IEmployee>>(`/api/v1/employees/${id}/restore`);
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
    const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        address: data.address ?? null,
    };

    return axios.post<IBackendRes<ICustomer>>(`/api/v1/customers`, payload, {
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
    const payload = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        address: data.address ?? null,
    };

    return axios.put<IBackendRes<ICustomer>>(`/api/v1/customers`, payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callDeactivateCustomer = (id: string) => {
    return axios.delete<IBackendRes<ICustomer>>(`/api/v1/customers/${id}`);
};

export const callRestoreCustomer = (id: string) => {
    return axios.put<IBackendRes<ICustomer>>(`/api/v1/customers/${id}/restore`);
};


/** ======================== Module Device ======================== **/

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
        // backend hiện đồng bộ theo User.active nên không cần gửi activeStatus nữa
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
// Vô hiệu hóa (soft delete)
export const callDeactivateTechnician = (id: string) => {
    return axios.delete<IBackendRes<ITechnician>>(`/api/v1/technicians/${id}`);
};

// Phục hồi (restore)
export const callRestoreTechnician = (id: string) => {
    return axios.put<IBackendRes<ITechnician>>(`/api/v1/technicians/${id}/restore`);
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
        image: data.image || null,
        unitId: Number(data.unit.id),
        deviceTypeId: Number(data.deviceType.id),
        warehouseId: Number(data.warehouse.id),
        materialSupplierId: Number(data.materialSupplier.id),
    };

    return axios.post<IBackendRes<IInventoryItem>>(`/api/v1/inventory-items`, payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callUpdateInventoryItem = (data: IInventoryItem) => {
    const payload = {
        id: data.id,
        itemCode: data.itemCode,
        itemName: data.itemName,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        image: data.image || null,
        unitId: Number(data.unit.id),
        deviceTypeId: Number(data.deviceType.id),
        warehouseId: Number(data.warehouse.id),
        materialSupplierId: Number(data.materialSupplier.id),
    };

    return axios.put<IBackendRes<IInventoryItem>>(`/api/v1/inventory-items`, payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const callDeleteInventoryItem = (id: string | number) => {
    return axios.delete<IBackendRes<null>>(`/api/v1/inventory-items/${id}`);
};

/** ======================== Module Devices ======================== **/

export const callFetchDevice = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IDeviceList>>>(
        `/api/v1/devices?${query}`
    );
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

export const callFetchDeviceByCode = (deviceCode: string) => {
    return axios.get<IBackendRes<IDevice>>(`/api/v1/devices/by-code/${deviceCode}`);
};

/** ======================== Device Parts ======================== **/

// GET LIST PARTS
export const callFetchDeviceParts = (deviceId: string) => {
    return axios.get<IBackendRes<IDevicePart[]>>(
        `/api/v1/devices/${deviceId}/parts`
    );
};

// CREATE PART
export const callCreateDevicePart = (
    deviceId: string,
    data: ICreatePartRequest
) => {
    return axios.post<IBackendRes<IDevicePart>>(
        `/api/v1/devices/${deviceId}/parts`,
        data,
        { headers: { "Content-Type": "application/json" } }
    );
};

export const callUpdateDevicePartStatus = (
    deviceId: string,
    partId: string,
    data: IUpdatePartStatusRequest
) => {
    return axios.put<IBackendRes<IDevicePart>>(
        `/api/v1/devices/${deviceId}/parts/${partId}/status`,
        data,
        { headers: { "Content-Type": "application/json" } }
    );
};

export const callDeleteDevicePart = (
    deviceId: string,
    partId: string
) => {
    return axios.delete<IBackendRes<any>>(
        `/api/v1/devices/${deviceId}/parts/${partId}`
    );
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
export const callFetchMaintenanceRequest = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResMaintenanceRequestDTO>>>(
        `/api/v1/maintenance-requests?${query}`
    );
};
export const callFetchMaintenanceRequestById = (id: string) => {
    return axios.get<IBackendRes<IResMaintenanceRequestDetailDTO>>(
        `/api/v1/maintenance-requests/${id}`
    );
};
export const callFetchRejectLogsByRequestId = (id: string) => {
    return axios.get<IBackendRes<IResMaintenanceRejectDTO>>(
        `/api/v1/maintenance-requests/${id}/reject-logs`
    );
};
export const callFetchPendingMaintenanceRequests = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResMaintenanceRequestDTO>>>(
        `/api/v1/maintenance-requests/pending-assignment?${query}`
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


// ======================= Xác Nhận Phân Công ======================= //
export const callFetchTechnicianAssignments = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResTechnicianAssignmentDTO>>>(
        `/api/v1/technician/assignments?${query}`
    );
};
export const callFetchTechnicianAssignmentById = (id: string | number) => {
    return axios.get<IBackendRes<IResTechnicianAssignmentDTO>>(
        `/api/v1/technician/assignments/${id}`
    );
};
export const callAcceptTechnicianAssignment = (id: string | number) => {
    return axios.post<IBackendRes<IResTechnicianAssignmentDTO>>(
        `/api/v1/technician/assignments/${id}/accept`
    );
};
export const callRejectTechnicianAssignment = (
    id: string | number,
    data: IReqRejectAssignmentDTO
) => {
    return axios.post<IBackendRes<IResTechnicianAssignmentDTO>>(
        `/api/v1/technician/assignments/${id}/reject`,
        data
    );
};


// =======================   MODULE: Cập nhật khảo sát ======================= //
export const callCreateMaintenanceSurvey = (data: IReqMaintenanceSurveyDTO) => {
    return axios.post<IBackendRes<IResMaintenanceSurveyDTO>>(
        "/api/v1/maintenance-surveys",
        data,
        { headers: { "Content-Type": "application/json" } }
    );
};
export const callFetchMaintenanceSurveyById = (id: string) => {
    return axios.get<IBackendRes<IResMaintenanceSurveyListDTO>>(
        `/api/v1/maintenance-surveys/${id}`
    );
};

export const callFetchMaintenanceSurveysInProgress = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResMaintenanceSurveyListDTO>>>(
        `/api/v1/maintenance-surveys/in-progress?${query}`
    );
};
// =======================   MODULE:Lên Kế hoach bảo trì ======================= //

export const callCreateMaintenancePlan = (payload: IReqMaintenancePlanDTO) => {
    return axios.post<IBackendRes<IResMaintenancePlanCreateDTO>>(
        `/api/v1/maintenance-plans`,
        payload,
        {
            headers: { "Content-Type": "application/json" },
        }
    );
};

export const callReplanMaintenance = (planId: string, payload: IReqMaintenancePlanDTO) => {
    return axios.post<IBackendRes<IResMaintenancePlanCreateDTO>>(
        `/api/v1/maintenance-plans/replan/${planId}`,
        payload,
        {
            headers: { "Content-Type": "application/json" },
        }
    );
};

export const callFetchSurveyedMaintenanceRequests = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResMaintenanceSurveyedListDTO>>>(
        `/api/v1/maintenance-plans/surveyed?${query}`
    );
};

export const callFetchSurveyedMaintenanceDetail = (id: string) => {
    return axios.get<IBackendRes<IResMaintenanceSurveyedDetailDTO>>(
        `/api/v1/maintenance-plans/surveyed/${id}`
    );
};

/* ========================   MODULE: Phê duyệt kế hoạch (ADMIN)========================*/

export const callFetchMaintenanceApprovals = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResMaintenancePlanApprovalListDTO>>>(
        `/api/v1/maintenance-approvals?${query}`
    );
};
export const callFetchMaintenancePlanDetail = (planId: string) => {
    return axios.get<IBackendRes<IResMaintenancePlanDetailDTO>>(
        `/api/v1/maintenance-approvals/${planId}`
    );
};
export const callFetchMaintenancePlanMaterials = (planId: string) => {
    return axios.get<IBackendRes<IResMaintenancePlanMaterialGroupDTO>>(
        `/api/v1/maintenance-approvals/${planId}/materials`
    );
};
export const callApproveMaintenancePlan = (planId: string) => {
    return axios.put<IBackendRes<IResMaintenancePlanApprovalDTO>>(
        `/api/v1/maintenance-approvals/${planId}/approve`
    );
};
export const callRejectMaintenancePlan = (planId: string, data: IReqRejectPlanDTO) => {
    return axios.put<IBackendRes<IResMaintenancePlanApprovalDTO>>(
        `/api/v1/maintenance-approvals/${planId}/reject`,
        data
    );
};




/* ========================   MODULE: Thi Công Kỹ Thuật Viên ( KTV )========================*/

export const callFetchAllExecutions = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<any>>>(
        `/api/v1/maintenance-executions?${query}`
    );
};
export const callFetchApprovedExecutions = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResExecutionCardDTO>>>(
        `/api/v1/maintenance-executions/approved?${query}`
    );
};

export const callGetExecutionDetail = (requestId: string) => {
    return axios.get<IBackendRes<IResExecutionDetailDTO>>(
        `/api/v1/maintenance-executions/${requestId}/detail`
    );
};

export const callStartExecution = (requestId: string) => {
    return axios.put<IBackendRes<IResExecutionDetailDTO>>(
        `/api/v1/maintenance-executions/${requestId}/start`
    );
};

export const callUpdateExecutionTask = (taskId: string, data: IReqUpdateTaskDTO) => {
    return axios.put<IBackendRes<any>>(
        `/api/v1/maintenance-executions/tasks/${taskId}`,
        data,
        { headers: { "Content-Type": "application/json" } }
    );
};


export const callCompleteExecution = (requestId: string) => {
    return axios.put<IBackendRes<IResExecutionDetailDTO>>(
        `/api/v1/maintenance-executions/${requestId}/complete`
    );
};

/* ========== KTV gửi yêu cầu hỗ trợ ========== */
export const callRequestSupport = (
    requestId: string,
    data: IReqSupportRequestDTO
) => {
    return axios.post<IBackendRes<any>>(
        `/api/v1/maintenance-executions/${requestId}/support`,
        data,
        { headers: { "Content-Type": "application/json" } }
    );
};


export const callFetchSupportRequests = (requestId: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResSupportRequestDTO>>>(
        `/api/v1/admin/maintenance-executions/${requestId}/supports`
    );
};


/* ========== Admin phê duyệt yêu cầu hỗ trợ ========== */
export const callApproveSupportRequest = (
    supportId: string,
    data: IReqSupportApproveDTO
) => {
    return axios.put<IBackendRes<any>>(
        `/api/v1/admin/maintenance-executions/supports/${supportId}/approve`,
        data,
        { headers: { "Content-Type": "application/json" } }
    );
};


/* ========================   MODULE: Thi Công Kỹ Thuật Viên ( ADMIN )========================*/

export const callFetchAdminExecutions = (query: string) => {
    return axios.get<
        IBackendRes<IModelPaginate<IResAdminExecutionCardDTO>>
    >(`/api/v1/admin/maintenance-executions?${query}`);
};

export const callFetchAdminExecutionDetail = (requestId: string) => {
    return axios.get<
        IBackendRes<IResAdminExecutionDetailDTO>
    >(`/api/v1/admin/maintenance-executions/${requestId}/detail`);
};



/* ========================   MODULE: Nghiệm Thu========================*/
export const callFetchAcceptancePending = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResAcceptanceCardDTO>>>(
        `/api/v1/maintenance-acceptances/pending?${query}`
    );
};
export const callFetchAcceptancePaginate = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResAcceptanceCardDTO>>>(
        `/api/v1/maintenance-acceptances?${query}`
    );
};
export const callFetchAcceptanceRejected = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResAcceptanceCardDTO>>>(
        `/api/v1/maintenance-acceptances/rejected?${query}`
    );
};

export const callFetchAcceptanceDetail = (requestId: string) => {
    return axios.get<IBackendRes<IResAcceptanceDetailDTO>>(
        `/api/v1/maintenance-acceptances/${requestId}`
    );
};

export const callApproveAcceptance = (
    requestId: string,
    payload: IReqAcceptanceApproveDTO
) => {
    return axios.put<IBackendRes<IResAcceptanceDTO>>(
        `/api/v1/maintenance-acceptances/${requestId}/approve`,
        payload
    );
};

export const callRejectAcceptance = (
    requestId: string,
    payload: IReqAcceptanceRejectDTO
) => {
    return axios.put<IBackendRes<IResAcceptanceDTO>>(
        `/api/v1/maintenance-acceptances/${requestId}/reject`,
        payload
    );
};




/* ========================   MODULE: lịch bảo trì định kì========================*/

export const callFetchMaintenanceSchedules = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IMaintenanceSchedule>>>(
        `/api/v1/maintenance-schedules?${query}`
    );
};
export const callFetchMaintenanceScheduleById = (id: string) => {
    return axios.get<IBackendRes<IMaintenanceScheduleDetail>>(
        `/api/v1/maintenance-schedules/${id}`
    );
};
export const callFetchScheduleByDevice = (deviceId: string) => {
    return axios.get<IBackendRes<IMaintenanceScheduleByDevice[]>>(
        `/api/v1/maintenance-schedules/device/${deviceId}`
    );
};
export const callGenerateScheduleRequest = (scheduleId: string) => {
    return axios.post<IBackendRes<any>>(
        `/api/v1/maintenance-schedules/${scheduleId}/generate-request`
    );
};
export const callGenerateDueRequests = () => {
    return axios.post<IBackendRes<any>>(
        `/api/v1/maintenance-schedules/generate-requests`
    );
};











//====================+++++++++++++++++ BÁO CÁO THỐNG KÊ +++++++++++++++====================

export const callFetchMaintenanceRequestReport = (
    filter: IRequestMaintenanceFilter,
    query: string
) => {
    return axios.post<IBackendRes<IModelPaginate<IMaintenanceRequestReport>>>(
        `/api/v1/maintenance-report/requests?${query}`,
        filter
    );
};

export const callFetchDeviceHistoryReport = (
    filter: IDeviceHistoryFilter,
    query: string
) => {
    return axios.post<IBackendRes<IModelPaginate<IDeviceMaintenanceHistory>>>(
        `/api/v1/maintenance-report/device-history?${query}`,
        filter
    );
};


export const callFetchMaterialUsageReport = (
    filter: IMaterialUsageFilter,
    query: string
) => {
    return axios.post<IBackendRes<IModelPaginate<IMaterialUsageReport>>>(
        `/api/v1/maintenance-report/material-usage?${query}`,
        filter
    );
};


export const callFetchTechnicianActivityReport = (
    filter: ITechnicianActivityFilter,
    query: string
) => {
    return axios.post<IBackendRes<IModelPaginate<ITechnicianActivityReport>>>(
        `/api/v1/maintenance-report/technician-activity?${query}`,
        filter
    );
};

export const callFetchDeviceDepreciationReport = (
    filter: IDeviceDepreciationFilter,
    query: string
) => {
    return axios.post<IBackendRes<IModelPaginate<IDeviceDepreciationReport>>>(
        `/api/v1/maintenance-report/device-depreciation?${query}`,
        filter
    );
};


export const callFetchWarrantyProductReport = (
    filter: IWarrantyProductFilter,
    query: string
) => {
    return axios.post<IBackendRes<IModelPaginate<IWarrantyProductReport>>>(
        `/api/v1/maintenance-report/customer-products?${query}`,
        filter
    );
};




export const callDownloadMaintenanceRequestReport = (
    filter: IRequestMaintenanceFilter
) => {
    return axios.get(`/api/v1/report/export/maintenance-request`, {
        params: filter,
        responseType: "blob"
    });
};

export const callDownloadDeviceHistoryReport = (
    filter: IDeviceHistoryFilter
) => {
    return axios.get(`/api/v1/report/export/device-history`, {
        params: filter,
        responseType: "blob"
    });
};
export const callDownloadMaterialUsageReport = (
    filter: IMaterialUsageFilter
) => {
    return axios.get(`/api/v1/report/export/material-usage`, {
        params: filter,
        responseType: "blob"
    });
};
export const callDownloadTechnicianActivityReport = (
    filter: ITechnicianActivityFilter
) => {
    return axios.get(`/api/v1/report/export/technician-activity`, {
        params: filter,
        responseType: "blob"
    });
};
export const callDownloadDeviceDepreciationReport = (
    filter: IDeviceDepreciationFilter
) => {
    return axios.get(`/api/v1/report/export/device-depreciation`, {
        params: filter,
        responseType: "blob",
    });
};


export const callDownloadWarrantyProductReport = (
    filter: IWarrantyProductFilter
) => {
    return axios.get(`/api/v1/report/export/warranty-product`, {
        params: filter,
        responseType: "blob"
    });
};


/** ======================== Module Notification  ======================== **/
export const callFetchMyNotifications = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<INotification>>>(
        `/api/v1/notifications?${query}`
    );
};
export const callMarkNotificationAsRead = (id: string) => {
    return axios.put<IBackendRes<null>>(`/api/v1/notifications/${id}/read`);
};

