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
