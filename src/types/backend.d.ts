// Backend Response Types
export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

// Pagination Interface
export interface IModelPaginate<T> {
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: T[]
}
export interface IResUploadFileDTO {
    fileName: string;
    uploadedAt: string;
}
export interface IAccount {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: {
            id: string;
            name: string;
            permissions: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }
    }
}

export interface IGetAccount extends Omit<IAccount, "access_token"> { }

export interface IForgotPasswordRequest {
    email: string;
}

export interface IConfirmResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
}

export interface ISendAccountInfoRequest {
    email: string;
}

export interface IUser {
    id?: string | number;
    email?: string;
    name: string;
    password?: string;
    address?: string | null;
    role?: {
        id: string | number;
        name?: string;
    };
    accountTypeDisplay?: string;
    avatar?: string | null;
    active?: boolean;

    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}



export interface IPermission {
    id?: string;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

}

export interface IRole {
    id?: string;
    name: string;
    description: string;
    active: boolean;
    permissions: IPermission[] | string[];

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}
/** ==============================
 *   COMPANY MODULE
 *  ============================== */
export interface ICompany {
    id?: number | string;
    companyCode: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}
/** ==============================
 *   ASSET TYPE MODULE
 *  ============================== */
export interface IAssetType {
    id?: number | string;
    assetTypeCode: string;
    assetTypeName: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}
/** ==============================
 *   DEPARTMENT MODULE
 *  ============================== */
export interface IDepartment {
    id?: number | string;
    departmentCode: string;
    name: string;
    company: {
        id: number | string;
        name?: string;
    };
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}

/** ==============================
 *   EMPLOYEE MODULE
 *  ============================== */
export interface IEmployee {
    id?: number | string;
    employeeCode: string;
    fullName: string;
    phone?: string | null;
    email?: string | null;

    company: {
        id: number | string;
        name?: string;
    };
    department: {
        id: number | string;
        name?: string;
    };
    position: {
        id: number | string;
        name?: string;
    };
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

/** ==============================
 *   MODULE POSITION 
 *  ============================== */
export interface IPosition {
    id?: number | string;
    name: string;

    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}


/** ==============================
 *   MODULE CUSTOMER 
 *  ============================== */
export interface ICustomer {
    id?: number | string;
    customerCode?: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}
/** ==============================
 *   DEVICE TYPE MODULE
 *  ============================== */
export interface IDeviceType {
    id?: number | string;
    deviceTypeCode: string;
    typeName: string;

    assetType: {
        id: number | string;
        assetTypeCode?: string;
        assetTypeName?: string;
    };

    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}
/** ==============================
 *   MODULE SKILL
 *  ============================== */
export interface ISkill {
    id?: number | string;
    techniqueName: string;

    createdAt?: string | null;
    updatedAt?: string | null;
}

/** ==============================
 *   MODULE SOLUTION
 *  ============================== */
export interface ISolution {
    id?: number | string;
    solutionName: string;

    createdAt?: string | null;
    updatedAt?: string | null;
}

/* ===========================
   MODULE WAREHOUSE
   =========================== */
export interface IWarehouse {
    id?: number | string;
    warehouseName: string;
    address: string;
    createdAt?: string | null;
    updatedAt?: string | null;
}

/** ==============================
 *   MODULE UNIT
 *  ============================== */
export interface IUnit {
    id?: number | string;
    name: string;

    createdAt?: string | null;
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
}


export type ReasonTypeEnum = "ASSIGNMENT" | "PLAN" | "ACCEPTANCE";

/** ==============================
 *   MODULE REJECT_REASON
 *  ============================== */

export interface IRejectReason {
    id?: number | string;
    reasonType: ReasonTypeEnum;
    reasonName: string;
    description?: string;

    createdAt?: string | null;
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
}

/** ==============================
 *   TECHNICIAN SUPPLIER MODULE
 *  ============================== */
export interface ITechnicianSupplier {
    id?: number | string;
    supplierCode: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;

    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}
/** ==============================
 *   ISSUE MODULE
 *  ============================== */
export interface IIssue {
    id?: number | string;
    issueName: string;

    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}

/** ==============================
 *   MATERIAL SUPPLIER MODULE
 *  ============================== */
export interface IMaterialSupplier {
    id?: number | string;
    supplierCode: string;
    supplierName: string;
    representative?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;

    createdAt?: string | null;
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
}

/** ==============================
 *   TECHNICIAN MODULE
 *  ============================== */
export type TechnicianTypeEnum = "INTERNAL" | "OUTSOURCE";

export interface ITechnician {
    id?: number | string;
    technicianCode: string;
    fullName: string;
    activeStatus?: boolean;
    technicianType: TechnicianTypeEnum;
    supplier?: {
        id: number | string;
        supplierCode: string;
        name: string;
    } | null;
    technicianSupplierId?: number | string | null;
    costPerHire?: number | null;
    phone?: string | null;
    email?: string | null;
    skillIds?: (number | string)[];
    skills?: {
        id: number | string;
        techniqueName: string;
    }[];

    createdAt?: string | null;
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
}


/** ==============================
 *   TECHNICIAN InventoryItem
 *  ============================== */
export interface IInventoryItem {
    id?: number | string;
    itemCode: string;
    itemName: string;
    quantity: number;
    unitPrice: number;

    unit: {
        id: number | string;
        name?: string;
    };

    deviceType: {
        id: number | string;
        deviceTypeCode?: string;
        typeName?: string;
    };

    warehouse: {
        id: number | string;
        warehouseName?: string;
        address?: string;
    };

    materialSupplier: {
        id: number | string;
        supplierCode?: string;
        supplierName?: string;
    };

    createdAt?: string | null;
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
}

/** ==============================
 *   DEVICE PART MODULE
 *  ============================== */
export interface IDevicePart {
    id?: number | string;
    partCode: string;
    partName: string;
    quantity: number;
    device: {
        id: number | string;
        name?: string;
    };
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}

/** ========================== ENUM TYPES ========================== */
export type TimeUnitType = "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
export type DeviceStatus = "NEW" | "IN_USE" | "IN_STORAGE" | "NOT_IN_USE" | "LIQUIDATED";
export type DeviceOwnershipType = "INTERNAL" | "CUSTOMER";

/** ========================== INTERFACE: LINH KIỆN ========================== */
export interface IDevicePart {
    partCode: string;
    partName: string;
    quantity: number;
}

/** ========================== INTERFACE: RESPONSE (READ DTO) ========================== */
export interface IDevice {
    id?: number | string;
    deviceCode: string;
    accountingCode?: string;
    deviceName: string;

    company?: { id?: number | string; name?: string };
    department?: { id?: number | string; name?: string };
    deviceType?: { id?: number | string; typeName?: string };
    supplier?: { id?: number | string; supplierName?: string; phone?: string };
    manager?: { id?: number | string; name?: string; email?: string };
    unit?: { id?: number | string; name?: string };

    brand?: string;
    modelDesc?: string;
    powerCapacity?: string;

    /** Kích thước vật lý (cm) */
    length?: number | null;
    width?: number | null;
    height?: number | null;

    /** Hình ảnh thiết bị (tối đa 3) */
    image1?: string | null;
    image2?: string | null;
    image3?: string | null;

    /** Giá trị thiết bị & quyền sở hữu */
    unitPrice?: number | null;
    ownershipType?: DeviceOwnershipType;

    /** Ngày sử dụng & bảo hành */
    startDate?: string | null;
    warrantyExpiryDate?: string | null;

    /** Thông tin khấu hao */
    depreciationPeriodValue?: number | null;
    depreciationPeriodUnit?: TimeUnitType | null;
    depreciationEndDate?: string | null;

    /** Thông tin bảo dưỡng */
    maintenanceFrequencyValue?: number | null;
    maintenanceFrequencyUnit?: TimeUnitType | null;
    maintenanceDayOfMonth?: number | null;
    maintenanceDayOfWeek?: number | null;
    maintenanceWeekOrder?: number | null;
    maintenanceMonth?: number | null;

    /** Ghi chú & trạng thái */
    note?: string;
    status?: DeviceStatus | null;

    /** Linh kiện liên quan */
    parts?: IDevicePart[];

    /** Thông tin hệ thống */
    createdAt?: string | null;
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
}

/** ========================== INTERFACE: CREATE DTO ========================== */
export interface ICreateDeviceRequest {
    /** Thông tin cơ bản */
    deviceCode: string;
    accountingCode?: string;
    deviceName: string;

    /** Quan hệ bắt buộc (foreign keys) */
    companyId: number;
    departmentId: number;
    deviceTypeId: number;
    supplierId: number;
    managerUserId: number;
    unitId: number;

    /** Thông tin chung */
    brand?: string;
    modelDesc?: string;
    powerCapacity?: string;
    ownershipType?: DeviceOwnershipType;

    /** Kích thước (cm) */
    length?: number;
    width?: number;
    height?: number;

    /** Hình ảnh (URL hoặc file path) */
    image1?: string;
    image2?: string;
    image3?: string;

    /** Đơn giá */
    unitPrice?: number;

    /** Ngày sử dụng & bảo hành */
    startDate?: string;
    warrantyExpiryDate?: string;

    /** Thông tin khấu hao */
    depreciationPeriodValue?: number;
    depreciationPeriodUnit?: TimeUnitType;
    depreciationEndDate?: string;

    /** Thông tin bảo dưỡng */
    maintenanceFrequencyValue?: number;
    maintenanceFrequencyUnit?: TimeUnitType;
    maintenanceDayOfMonth?: number;
    maintenanceDayOfWeek?: number;
    maintenanceWeekOrder?: number;
    maintenanceMonth?: number;

    /** Khác */
    note?: string;
    status?: DeviceStatus;
    parts?: IDevicePart[];
}

/** ========================== INTERFACE: UPDATE DTO ========================== */

export interface IUpdateDeviceRequest extends Partial<ICreateDeviceRequest> { }

