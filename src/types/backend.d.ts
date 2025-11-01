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
    access_token?: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar?: string;
        role: {
            id: string;
            name: string;
            permissions: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[];
        };
    };
    employee?: {
        id: string;
        employeeCode: string;
        fullName: string;
        phone?: string;
        email?: string;
        positionName?: string;
    };
}


export interface IGetAccount extends Omit<IAccount, "access_token"> { }

export interface IRequestPasswordCode {
    email: string;
}
export interface IConfirmResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
}

export interface IUser {
    id?: string;
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
    id?: string;
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
    id?: string;
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
 *   MODULE CUSTOMER PURCHASE HISTORY
 *  ============================== */
export interface IDeviceSummary {
    id?: string;
    deviceCode?: string;
    deviceName?: string;
    brand?: string | null;
    modelDesc?: string | null;
    supplierName?: string | null;
    companyName?: string | null;
    departmentName?: string | null;
    deviceTypeName?: string | null;
    warrantyExpiryDate?: string | null;
    warrantyMonths?: number | null;
    image1?: string | null;
    image2?: string | null;
    image3?: string | null;
}
export interface ICustomerSummary {
    id?: string;
    customerCode?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}
export interface ICustomerPurchaseHistoryAdmin {
    id?: string;
    purchaseDate?: string;
    customer?: ICustomerSummary;
    device?: IDeviceSummary;
}
export interface ICustomerPurchaseHistoryClient {
    id?: string;
    purchaseDate?: string;
    device?: IDeviceSummary;
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
    id?: string;
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


/** ========================== ENUM TYPES ========================== */
export type TimeUnitType = "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
export type DeviceStatus = "NEW" | "IN_USE" | "IN_STORAGE" | "NOT_IN_USE" | "LIQUIDATED";
export type DeviceOwnershipType = "INTERNAL" | "CUSTOMER";

/** ========================== INTERFACE: DEVICE PART ========================== */
export interface IDevicePart {
    id?: number | string;
    partCode: string;
    partName: string;
    quantity: number;
    deviceId?: string;
}

/** ========================== LIST ITEM ========================== */
export interface IDeviceList {
    id?: string;
    deviceCode: string;
    deviceName: string;

    deviceTypeName?: string;
    departmentName?: string;
    supplierName?: string;
    companyName?: string;

    ownershipType?: DeviceOwnershipType;
    status?: DeviceStatus;
}

/** ========================== DEVICE DETAIL ========================== */
export interface IDevice {
    id?: string;
    deviceCode: string;
    accountingCode?: string;
    deviceName: string;

    company?: { id?: number | string; name?: string };
    department?: { id?: number | string; name?: string };
    deviceType?: { id?: number | string; typeName?: string };
    supplier?: { id?: number | string; supplierName?: string; phone?: string };
    manager?: { id?: string; name?: string; email?: string };
    unit?: { id?: number | string; name?: string };

    customer?: { id?: string; name?: string; customerCode?: string };

    brand?: string;
    modelDesc?: string;
    powerCapacity?: string;

    length?: number | null;
    width?: number | null;
    height?: number | null;

    image1?: string | null;
    image2?: string | null;
    image3?: string | null;

    unitPrice?: string | number | null;
    ownershipType?: DeviceOwnershipType;

    startDate?: string | null;
    warrantyExpiryDate?: string | null;

    depreciationPeriodValue?: number | null;
    depreciationPeriodUnit?: TimeUnitType | null;
    depreciationEndDate?: string | null;

    maintenanceFrequencyValue?: number | null;
    maintenanceFrequencyUnit?: TimeUnitType | null;
    maintenanceDayOfMonth?: number | null;
    maintenanceMonth?: number | null;

    note?: string;
    status?: DeviceStatus | null;

    parts?: IDevicePart[];

    createdAt?: string | null;
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
}

/** ========================== REQUEST: CREATE ========================== */
export interface ICreateDeviceRequest {
    deviceCode: string;
    accountingCode?: string;
    deviceName: string;

    companyId: number;
    departmentId: number;
    deviceTypeId: number;
    supplierId: number;
    managerUserId: string;
    unitId: number;

    brand?: string;
    modelDesc?: string;
    powerCapacity?: string;
    ownershipType?: DeviceOwnershipType;

    customerId?: string;

    length?: number;
    width?: number;
    height?: number;

    image1?: string;
    image2?: string;
    image3?: string;

    unitPrice?: string | number;

    startDate?: string | null;
    warrantyExpiryDate?: string | null;

    depreciationPeriodValue?: number;
    depreciationPeriodUnit?: TimeUnitType;
    depreciationEndDate?: string | null;

    maintenanceFrequencyValue?: number;
    maintenanceFrequencyUnit?: TimeUnitType;
    maintenanceDayOfMonth?: number;
    maintenanceMonth?: number;

    note?: string;
    status?: DeviceStatus;

    parts?: IDevicePart[];
}

/** ========================== REQUEST: UPDATE ========================== */
export interface IUpdateDeviceRequest extends Partial<ICreateDeviceRequest> { }

/** ==============================
 *   MODULE SHIFT TEMPLATE
 *  ============================== */
export interface IShiftTemplate {
    id?: string;
    name: string;
    startTime: string;
    endTime: string;
    note?: string | null;
    active?: boolean;

    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}

/** ==============================
 *   MODULE TECHNICIAN
 *  ============================== */
export interface ITechnicianSummary {
    id: string;
    technicianCode: string;
    fullName: string;
    phone?: string | null;
    email?: string | null;
}

/** ==============================
 *   MODULE SHIFT TEMPLATE SUMMARY
 *  ============================== */
export interface IShiftTemplateSummary {
    id: string;
    name: string;
    startTime?: string | null;
    endTime?: string | null;
}

/** ==============================
 *   MODULE TECHNICIAN AVAILABILITY
 *  ============================== */
export type TechnicianAvailabilityStatus =
    | "AVAILABLE"
    | "BUSY"
    | "OFFLINE"
    | "ON_LEAVE";

export interface ITechnicianAvailability {
    id?: string;

    /** Nested object thay vì field phẳng */
    technician?: ITechnicianSummary | null;
    shiftTemplate?: IShiftTemplateSummary | null;

    workDate: string;    // yyyy-MM-dd
    startTime: string;   // HH:mm:ss
    endTime: string;     // HH:mm:ss

    status?: TechnicianAvailabilityStatus;
    isSpecial?: boolean;
    note?: string | null;

    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}

/** ==============================
 *   REQUEST DTOs FOR TECHNICIAN AVAILABILITY
 *  ============================== */
export interface IReqTechnicianAvailability {
    id?: string;
    technicianId?: string;
    workDate: string;
    endDate?: string;
    shiftTemplateId?: string | null;
    startTime?: string;
    endTime?: string;
    status?: TechnicianAvailabilityStatus;
    isSpecial?: boolean;
    note?: string | null;
    workingDays?: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[];
}



/** ==============================
 *   ENUM PHIẾU ĐẦY ĐỦ 
 *  ============================== */
export type DamageLevel = "NHE" | "TRUNG_BINH" | "NANG" | "RAT_NANG";
export type MaintenanceType = "DOT_XUAT" | "DINH_KY" | "SUA_CHUA";
export type PriorityLevel = "KHAN_CAP" | "CAO" | "TRUNG_BINH" | "THAP";
export type CreatorType = "EMPLOYEE" | "CUSTOMER";

export type MaintenanceRequestStatus =
    | "CHO_PHAN_CONG"
    | "DANG_PHAN_CONG"
    | "DA_XAC_NHAN"
    | "DA_KHAO_SAT"
    | "DA_LAP_KE_HOACH"
    | "TU_CHOI_PHE_DUYET"
    | "DA_PHE_DUYET"
    | "DANG_BAO_TRI"
    | "CHO_NGHIEM_THU"
    | "TU_CHOI_NGHIEM_THU"
    | "HOAN_THANH"
    | "HUY";

/** =============================================================
 *                COMMON CHUNG CỦA PHIẾU 
 * ==============================================================*/


/*  ======================== Phiếu yêu cầu ====================== */
export interface IResRequestCommonDTO {
    requestId?: string;
    requestCode?: string;
    employeeOrCustomerCode?: string;
    fullName?: string;
    phone?: string;
    position?: string;
    companyName?: string;
    departmentName?: string;
    locationDetail?: string;
    creatorType?: CreatorType;
    deviceCode?: string;
    deviceName?: string;
    issueName?: string;
    priorityLevel?: PriorityLevel;
    maintenanceType?: MaintenanceType;
    status?: MaintenanceRequestStatus;
    attachment1?: string;
    attachment2?: string;
    attachment3?: string;
    note?: string | null;
    createdAt?: string;
    updatedAt?: string;
}
/*  ==================== Phiếu cập nhật khảo sát ===================== */
export interface IResSurveyCommonDTO {
    actualIssueDescription?: string;
    causeName?: string;
    damageLevel?: DamageLevel;
    maintenanceTypeActual?: MaintenanceType;
    surveyDate?: string;
    technicianName?: string;
    attachment1?: string;
    attachment2?: string;
    attachment3?: string;
}
/*  ================== Thông tin Cập nhật phiếu khảo sát ===================== */
export interface IResMaintenanceAssignmentDTO {
    id?: string;
    requestCode?: string;
    technicianName?: string;
    assignedAt?: string;
    assignedBy?: string;
}













//========================== PHIẾU BẢO TRÌ ===========================//

/*  ================== Từ chối phiếu ===================== */
export interface IResMaintenanceRejectDTO {
    reasonName?: string;
    note?: string;
}
/*  ================== Thông tin phiếu bảo trì ===================== */
export interface IResMaintenanceRequestDTO {
    requestInfo: IResRequestCommonDTO;
    technicianName?: string;
    assignedAt?: string;
    rejectInfo?: IResMaintenanceRejectDTO;
}
/*  ================== Chi tiết phiếu bảo trì ===================== */
export interface IResMaintenanceRequestDetailDTO {
    requestInfo: IResRequestCommonDTO;
    assignmentInfo?: IResMaintenanceAssignmentDTO;
    rejectInfo?: IResMaintenanceRejectDTO;
    surveyInfo?: IResMaintenanceSurveyDTO;
}


/*  ================== Nhân viên nội bộ tạo phiếu bảo trì ===================== */
export interface IReqMaintenanceRequestInternalDTO {
    deviceCode: string;
    issueId: string;
    priorityLevel: PriorityLevel;
    maintenanceType: MaintenanceType;
    locationDetail?: string | null;
    attachment1?: string | null;
    attachment2?: string | null;
    attachment3?: string | null;
    note?: string | null;
}


/*  ================== Khách hàng tạo phiếu bảo trì ===================== */
export interface IReqMaintenanceRequestCustomerDTO {
    deviceCode: string;
    issueId: string;
    priorityLevel: PriorityLevel;
    maintenanceType: MaintenanceType;
    locationDetail?: string | null;
    attachment1?: string | null;
    attachment2?: string | null;
    attachment3?: string | null;
    note?: string | null;
}










//========================== PHIẾU KHẢO SÁT ===========================//



/*  ================== Thông tin Cập nhật phiếu khảo sát ===================== */
export interface IResMaintenanceSurveyDTO {
    id?: string;
    maintenanceRequestId?: string;
    requestCode?: string;
    deviceName?: string;
    issueName?: string;
    surveyInfo?: IResSurveyCommonDTO;
}
