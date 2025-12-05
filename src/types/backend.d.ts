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

export interface IBreadcrumbItem {
    path: string;
    label: string;
    isLast?: boolean;
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
        address?: string;
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

    customer?: {
        id: string;
        customerCode: string;
        name: string;
        phone?: string;
        email?: string;
        address?: string;
    };

    technician?: {
        id: string;
        technicianCode: string;
        fullName: string;
        phone?: string;
        email?: string;
        technicianType?: string;
        supplierName?: string;
    };
}


export interface IReqUpdateProfileDTO {
    name?: string;
    address?: string;
    avatar?: string;
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
    active?: boolean;

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

    supervisor?: {
        id: string;
        fullName: string;
        positionName?: string;
    } | null;

    subordinates?: {
        id: string;
        fullName: string;
        employeeCode: string;
        positionName?: string;
        departmentName?: string;
    }[];

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
    active?: boolean;
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
    active?: boolean;
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
 *    InventoryItem
 *  ============================== */
export interface IInventoryItem {
    id?: number | string;
    itemCode: string;
    itemName: string;
    quantity: number;
    unitPrice: number;

    image?: string | null;

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



/* ============================================================
   ENUMS THIẾT BỊ
   ============================================================ */
export type TimeUnitType = "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";

export type DeviceStatus =
    | "NEW"
    | "IN_USE"
    | "IN_STORAGE"
    | "NOT_IN_USE"
    | "LIQUIDATED";

export type DeviceOwnershipType = "INTERNAL" | "CUSTOMER";

/* ============================================================
   DEVICE PART
   ============================================================ */

export type DevicePartStatus =
    | "WORKING"
    | "BROKEN"
    | "REPLACED"
    | "REMOVED";

export interface IDevicePart {
    id: string;
    partCode: string;
    partName: string;
    status: DevicePartStatus;
    dateInUse: string | null;
    dateExpired: string | null;
}

export interface ICreatePartRequest {
    partCode: string;
    partName: string;
    dateInUse?: string | null;
    dateExpired?: string | null;
}

export interface IUpdatePartStatusRequest {
    status: DevicePartStatus;
}


/* ============================================================
   LIST ITEM
   ============================================================ */
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


/* ============================================================
   DEVICE DETAIL (SHOW)
   ============================================================ */
export interface IDevice {
    id?: string;

    deviceCode: string;
    accountingCode?: string | null;
    deviceName: string;

    company?: { id?: number | string; name?: string };
    department?: { id?: number | string; name?: string };
    deviceType?: { id?: number | string; typeName?: string };
    supplier?: { id?: number | string; supplierName?: string; phone?: string };
    manager?: { id?: string; name?: string; email?: string };
    unit?: { id?: number | string; name?: string };
    customer?: { id?: string; name?: string; customerCode?: string };

    brand?: string | null;
    modelDesc?: string | null;
    powerCapacity?: string | null;

    length?: number | null;
    width?: number | null;
    height?: number | null;

    image1?: string | null;
    image2?: string | null;
    image3?: string | null;

    unitPrice?: number | string | null;
    ownershipType?: DeviceOwnershipType;

    /** Ngày đưa vào sử dụng */
    startDate?: string | null;

    /** Ngày hết hạn bảo hành */
    warrantyExpiryDate?: string | null;

    /** Khấu hao (thời gian) */
    depreciationPeriodValue?: number | null;
    depreciationPeriodUnit?: TimeUnitType | null;

    /** Bảo dưỡng định kỳ (thời gian) */
    maintenanceFrequencyValue?: number | null;
    maintenanceFrequencyUnit?: TimeUnitType | null;

    note?: string | null;
    status?: DeviceStatus;

    createdAt?: string | null;
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;

    barcodeBase64?: string | null;
    qrCodeBase64?: string | null;
}


/* ============================================================
   CREATE DEVICE REQUEST
   ============================================================ */
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

    length?: number | null;
    width?: number | null;
    height?: number | null;

    image1?: string | null;
    image2?: string | null;
    image3?: string | null;

    unitPrice?: number | string | null;

    /** Ngày đưa vào sử dụng */
    startDate?: string | null;

    /** Ngày hết hạn bảo hành */
    warrantyExpiryDate?: string | null;

    /** Thời gian khấu hao (Số + Đơn vị) */
    depreciationPeriodValue?: number | null;
    depreciationPeriodUnit?: TimeUnitType | null;

    /** Tần suất bảo dưỡng (Số + Đơn vị) */
    maintenanceFrequencyValue?: number | null;
    maintenanceFrequencyUnit?: TimeUnitType | null;

    note?: string | null;
    status?: DeviceStatus | null;

    /** Khi ownershipType = CUSTOMER */
    customerId?: string | null;
}

/* ============================================================
   UPDATE DEVICE REQUEST
   ============================================================ */
export interface IUpdateDeviceRequest {
    companyId?: number;
    departmentId?: number;
    supplierId?: number;
    managerUserId?: string;
    unitId?: number;
    brand?: string;
    modelDesc?: string;
    powerCapacity?: string;
    length?: number | null;
    width?: number | null;
    height?: number | null;
    unitPrice?: number | string | null;
    startDate?: string | null;
    image1?: string | null;
    image2?: string | null;
    image3?: string | null;
    note?: string;
    status?: DeviceStatus | null;
}












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
    active: boolean;
}

/** ==============================
 *   MODULE MaintenanceCause
 *  ============================== */
export interface IMaintenanceCause {
    id?: string;
    causeName: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
}

export interface IMaintenanceCauseRequest {
    id?: string;
    causeName: string;
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
    special?: boolean;
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
    special?: boolean;
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
export type DeviceOwnershipType = "INTERNAL" | "CUSTOMER";

/** ==============================
 *   PHÂN CÔNG TỰ ĐỘNG
 *  ============================== */
export interface IIssueSkillMappingRequest {
    issueId: string;
    skillId: number;
    weight: number;
}

export interface IIssueSkillMappingResponse {
    id: number;
    issueId: string;
    issueName: string;
    skillId: number;
    skillName: string;
    weight: number;
}
export interface IAutoAssignmentResponse {
    id: string;
    requestCode: string;
    technicianCode: string;
    technicianName: string;
    technicianPhone: string;
    assignedAt: string;
    assignedBy: string;
}





/** ==============================
 *   ENUM TRẠNG THÁI PHIẾU 
 * ============================== */
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

/** ============ Thông tin thiết bị đơn giản ============ */
export interface IResDeviceSimpleDTO {
    deviceCode?: string;
    deviceName?: string;
    image1?: string;
    image2?: string;
    image3?: string;
    ownershipType?: DeviceOwnershipType;
    companyName?: string;
    departmentName?: string;
}
/** ======================== Thông tin phiếu yêu cầu (Chung) ====================== */
export interface IResRequestCommonDTO {
    requestId?: string;
    requestCode?: string;
    employeeOrCustomerCode?: string;
    fullName?: string;
    phone?: string;
    position?: string;
    locationDetail?: string;
    creatorType?: CreatorType;
    device?: IResDeviceSimpleDTO;
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

/** ==================== Thông tin khảo sát (Chung) ===================== */
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

/** ==================== Thông tin kế hoạch (Chung) ===================== */
export interface IResPlanCommonDTO {
    planId?: string | null;
    solutionName?: string | null;
    customSolution?: string | null;
    useMaterial?: boolean | null;
    note?: string | null;
    createdAt?: string | null;
    createdBy?: string | null;
    materials?: IPlanMaterialItem[];
}

export interface IPlanMaterialItem {
    partCode?: string;
    partName?: string;
    quantity?: number;
    isNewProposal?: boolean;
    isShortage?: boolean;
    image?: string;
}

/** ==================== Thông tin thi công bảo trì (Chung) ===================== */
export interface IResExecutionCommonDTO {
    executionId?: string;
    requestCode?: string;
    status?: string;
    mainTechnician?: string;
    startAt?: string;
    endAt?: string;
    totalTasks?: number;
    completedTasks?: number;
    tasks?: IExecutionTaskItem[];
    materials?: IExecutionMaterialItem[];
    rejectHistory?: IExecutionRejectHistoryItem[];
    supportRequests?: ISupportRequestItem[];
}

export interface IExecutionTaskItem {
    id?: string;
    content?: string;
    done?: boolean;
    doneAt?: string;
    doneBy?: string;
    note?: string;
    image1?: string;
    image2?: string;
    image3?: string;
    video?: string;
}

export interface IExecutionMaterialItem {
    partCode?: string;
    partName?: string;
    quantity?: number;
    isNewProposal?: boolean;
    isShortage?: boolean;
    stock?: number;
    warehouseName?: string;
    image?: string;
}

export interface IExecutionRejectHistoryItem {
    reasonName?: string;
    note?: string;
    rejectedBy?: string;
    rejectedAt?: string;
}

export interface ISupportRequestItem {
    requesterName?: string;
    supporterName?: string;
    reason?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    createdAt?: string;
}

/** ==================== Thông tin nghiệm thu ===================== */
export interface IResAcceptanceCommonDTO {
    acceptanceId?: string;
    approverType?: string;
    isAccepted?: boolean;
    rating?: number;
    isOnTime?: boolean;
    isProfessional?: boolean;
    isDeviceWorking?: boolean;
    comment?: string;
    createdAt?: string;
    createdBy?: string;
}

/** ==================== Lịch sử từ chối nghiệm thu ===================== */
export interface IResAcceptanceRejectCommonDTO {
    rejectId?: string;
    reasonName?: string;
    note?: string;
    rejectedBy?: string;
    rejectedAt?: string;
}


/** ================== Thông tin phân công kỹ thuật viên ===================== */
export interface IResMaintenanceAssignmentDTO {
    id: string;
    requestCode: string;
    technicianCode?: string;
    technicianName?: string;
    technicianPhone?: string;
    assignedAt?: string;
    assignedBy?: string;
    acceptedAt?: string;
    status?: "ASSIGNED" | "ACCEPTED" | "REJECTED";
}

/** ================== Thông tin phiếu bị từ chối ===================== */
export interface IResMaintenanceRejectDTO {
    logs: {
        technicianName?: string;
        reasonName?: string;
        note?: string;
        rejectedBy?: string;
        rejectedAt?: string;
    }[];
}

/** ================== Phiếu bảo trì (Dùng cho danh sách) ===================== */
export interface IResMaintenanceRequestDTO {
    requestInfo: IResRequestCommonDTO;
    technicianCode?: string;
    technicianName?: string;
    technicianPhone?: string;
    assignedAt?: string;
    assignedBy?: string;
    latestRejectReason?: string;
    latestRejectedAt?: string;
}

/** ================== Chi tiết phiếu bảo trì ===================== */
export interface IResMaintenanceRequestDetailDTO {
    /** ===== Thông tin chung & phân công ===== */
    requestInfo: IResRequestCommonDTO;                       // Thông tin cơ bản của phiếu bảo trì
    assignmentInfo?: IResMaintenanceAssignmentDTO;            // Kỹ thuật viên được phân công
    rejectInfo?: IResMaintenanceRejectDTO;                    // Lịch sử kỹ thuật viên từ chối phiếu

    /** ===== Giai đoạn khảo sát ===== */
    surveyInfo?: IResSurveyCommonDTO;                         // Thông tin khảo sát thực tế

    /** ===== Giai đoạn kế hoạch ===== */
    planInfo?: IResPlanCommonDTO;                             // Thông tin kế hoạch bảo trì
    planRejectInfo?: IResMaintenancePlanRejectDTO;            // Thông tin từ chối kế hoạch (nếu bị từ chối phê duyệt)

    /** ===== Giai đoạn thi công ===== */
    executionInfo?: IResExecutionCommonDTO;                   // Thông tin thi công thực tế

    /** ===== Giai đoạn nghiệm thu ===== */
    acceptanceInfos?: IResAcceptanceCommonDTO[];              // Danh sách tất cả người nghiệm thu (CREATOR, DEVICE_MANAGER)
    acceptanceRejectInfo?: IResAcceptanceRejectCommonDTO;     // Thông tin từ chối nghiệm thu (nếu có)
}


/** ================== Nhân viên nội bộ tạo phiếu ===================== */
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

/** ================== Khách hàng tạo phiếu ===================== */
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

/** ====================== Từ chối phân công ======================= */
export interface IReqRejectAssignmentDTO {
    reasonId: string | number;
    note?: string | null;
}

export interface IResTechnicianAssignmentDTO {
    id: string;
    requestInfo: IResRequestCommonDTO;
    assignedAt: string;
    assignedBy: string;
}

/** ================== Phiếu khảo sát ===================== */
export interface IReqMaintenanceSurveyDTO {
    maintenanceRequestId: string;
    issueId: string;
    damageLevel: DamageLevel;
    causeId?: string;
    otherCause?: string;
    maintenanceTypeActual?: MaintenanceType;
    attachment1?: string;
    attachment2?: string;
    attachment3?: string;
    note?: string;
}

/** ================== Kết quả khi tạo hoặc xem khảo sát ===================== */
export interface IResMaintenanceSurveyDTO {
    surveyId?: string;
    maintenanceRequestId?: string;
    requestCode?: string;
    deviceName?: string;
    issueName?: string;
    note?: string | null;
    surveyInfo?: IResSurveyCommonDTO;
}

/** ================== Danh sách phiếu chờ khảo sát ===================== */
export interface IResMaintenanceSurveyListDTO {
    requestInfo: IResRequestCommonDTO;
    assignedAt?: string;
    assignedBy?: string;
}


/** ==============================
 *   MODULE MAINTENANCE PLAN
 *  ============================== */
export interface IReqMaintenancePlanDTO {
    maintenanceRequestId: string;
    solutionIds?: number[];
    customSolution?: string | null;
    useMaterial?: boolean;
    note?: string | null;
    materials?: IReqMaintenancePlanMaterialItemDTO[];
}
export interface IReqMaintenancePlanMaterialItemDTO {
    inventoryItemId?: number | null;
    partCode?: string | null;
    partName?: string | null;
    quantity?: number | null;
    image?: string | null;
    isNewProposal?: boolean | null;
    isShortage?: boolean | null;
}

export interface IResMaintenancePlanCreateDTO {
    planId: string;
    maintenanceRequestId: string;
    maintenanceRequestCode: string;
    solutionNames: string[];
    useMaterial?: boolean;
    note?: string | null;
    status: MaintenanceRequestStatus;
    createdAt: string;
    createdBy: string;
}

export interface IResMaintenanceSurveyedListDTO {
    requestId: string;
    requestCode: string;
    priorityLevel: PriorityLevel;
    status: MaintenanceRequestStatus;
    device: {
        deviceCode?: string;
        deviceName?: string;
        image1?: string | null;
        image2?: string | null;
        image3?: string | null;
    };
    maintenanceTypeActual?: MaintenanceType | null;
    actualIssueDescription?: string | null;
    damageLevel?: string | null;
    rejectInfo?: IResMaintenancePlanRejectDTO;
}

export interface IResMaintenanceSurveyedDetailDTO {
    requestId: string;
    requestCode: string;
    issueName?: string | null;
    issueDescription?: string | null;
    priorityLevel: PriorityLevel;
    maintenanceType: MaintenanceType;
    status: MaintenanceRequestStatus;
    damageLevel?: DamageLevel | null;

    device?: {
        deviceCode?: string;
        deviceName?: string;
        ownershipType?: DeviceOwnershipType;
        image1?: string | null;
        image2?: string | null;
        image3?: string | null;
        companyName?: string | null;
        departmentName?: string | null;
    };

    assignmentInfo?: IResMaintenanceAssignmentDTO;
    surveyInfo?: IResSurveyCommonDTO;
    rejectInfo?: IResMaintenancePlanRejectDTO;

    /** ===== Thông tin kế hoạch (nếu có) ===== */
    planInfo?: {
        planId: string;
        createdAt: string;

        // ===== Bổ sung cho form lập lại kế hoạch =====
        note?: string | null;
        customSolution?: string | null;
        useMaterial?: boolean;
        solutionIds?: number[];
        materials?: {
            partCode?: string | null;
            partName?: string | null;
            quantity?: number | null;
            isNewProposal?: boolean | null;
            isShortage?: boolean | null;
        }[];
    };
}



/** ==============================
 *   MODULE MAINTENANCE APPROVAL
 *  ============================== */

export interface IReqRejectPlanDTO {
    rejectReasonId: number;
    note?: string;
}

export interface IResMaterialDTO {
    partCode?: string;
    partName?: string;
    quantity?: number;
    warehouseName?: string;
    stock?: number;
    isNewProposal?: boolean;
    isShortage?: boolean;
}

export interface IResMaintenancePlanMaterialGroupDTO {
    planId: string;
    requestCode: string;
    availableMaterials: IResMaterialDTO[];
    shortageMaterials: IResMaterialDTO[];
    newProposals: IResMaterialDTO[];
}

export interface IResMaintenancePlanApprovalDTO {
    planId: string;
    requestCode: string;
    status: MaintenanceRequestStatus;
    rejectReason?: string;
    note?: string;
    message: string;
}
export interface IResMaintenancePlanApprovalListDTO {
    planId: string;
    requestId: string;
    requestCode: string;
    priorityLevel?: string;
    status?: MaintenanceRequestStatus;
    createdAt?: string;
    maintenanceTypeActual?: string;
    actualIssueDescription?: string;
    device?: {
        deviceCode?: string;
        deviceName?: string;
        image1?: string;
        image2?: string;
        image3?: string;
    };
    solutionName?: string;
}
export interface IResMaintenancePlanDetailDTO {
    requestInfo: IResRequestCommonDTO;
    surveyInfo?: IResSurveyCommonDTO;
    planInfo: {
        planId: string;
        solutionName?: string;
        useMaterial?: boolean;
        note?: string;
        createdAt?: string;
        createdBy?: string;
    };
    rejectLogs?: IResMaintenancePlanRejectDTO[];

}
/** ---------- THÔNG TIN TỪ CHỐI KẾ HOẠCH (ADMIN) ---------- */
export interface IResMaintenancePlanRejectDTO {
    rejectedBy?: string;     // Người từ chối
    reasonName?: string;     // Lý do từ chối
    note?: string;           // Ghi chú chi tiết
    rejectedAt?: string;     // Thời điểm từ chối
}






/** ==============================
 *   MODULE MAINTENANCE EXECUTION
 *  ============================== */



export interface IReqUpdateTaskDTO {
    done?: boolean | null;
    note?: string | null;

    image1?: string | null;
    image2?: string | null;
    image3?: string | null;
    video?: string | null;
}


export interface IResExecutionTaskDTO {
    id: string;
    content: string;

    done: boolean | null;
    doneBy: string | null;
    doneAt: string | null;

    note: string | null;
    image1: string | null;
    image2: string | null;
    image3: string | null;
    video: string | null;
}



export interface IResExecutionMaterialGroupDTO {
    providedMaterials: IResMaterialDTO[];
    pendingMaterials: IResMaterialDTO[];
}




export interface IResExecutionCardDTO {
    requestId: string;
    requestCode: string;

    deviceCode?: string | null;
    deviceName?: string | null;

    locationDetail?: string | null;
    companyName?: string | null;
    departmentName?: string | null;

    status: MaintenanceRequestStatus;
    createdAt?: string | null;
    completedAt?: string | null;

    deviceImage1?: string | null;
    deviceImage2?: string | null;
    deviceImage3?: string | null;

    surveyInfo?: IResSurveyCommonDTO | null;
    planInfo?: IResPlanCommonDTO | null;

    // ===== TIẾN ĐỘ =====
    totalTasks: number;
    completedTasks: number;

    // ===== NEW =====
    rejectInfo?: {
        reasonName: string;
        note: string;
        rejectedAt: string;
        rejectedBy: string;
    } | null;
}




export interface IResExecutionDetailDTO {
    requestInfo: IResRequestCommonDTO;

    surveyInfo?: IResSurveyCommonDTO | null;
    planInfo?: IResPlanCommonDTO | null;

    materials?: IResExecutionMaterialGroupDTO | null;

    tasks?: IResExecutionTaskDTO[] | null;

    // ===== NEW =====
    rejectHistory?: {
        reasonName: string;
        note: string;
        rejectedBy: string;
        rejectedAt: string;
    }[] | null;
}




export interface ITechnicianSummary {
    id: string;
    fullName: string;
    phone?: string | null;
    email?: string | null;
    isMain?: boolean | null;
}

export interface IReqSupportRequestDTO {
    supporterId: string;
    reason: string;
}
export interface IReqSupportApproveDTO {
    approve: boolean;
}

import { MaintenanceRequestStatus } from "@/types/backend/maintenance-request-status";
import type { ITechnicianSummary } from "@/types/backend/technician";

export interface IResAdminExecutionCardDTO {
    requestId: string;
    requestCode: string;
    status: MaintenanceRequestStatus;
    createdAt?: string | null;

    // ===== Thiết bị =====
    deviceCode?: string | null;
    deviceName?: string | null;
    deviceImage1?: string | null;
    deviceImage2?: string | null;
    deviceImage3?: string | null;

    // ===== Kỹ thuật viên =====
    technicians?: ITechnicianSummary[];

    // ===== Tiến độ =====
    totalTasks?: number | null;
    completedTasks?: number | null;
    progressPercent?: number | null;
    startAt?: string | null;
    endAt?: string | null;

    // ===== Khảo sát =====
    actualIssueDescription?: string | null;
    causeName?: string | null;
    surveyDate?: string | null;

    pendingSupportCount?: number | null;
}




export interface IResAdminExecutionDetailDTO {
    requestInfo: IResRequestCommonDTO;
    surveyInfo?: IResSurveyCommonDTO | null;
    planInfo?: IResPlanCommonDTO | null;
    technicians?: ITechnicianSummary[];
    tasks?: IResExecutionTaskDTO[] | null;
}

export interface IResSupportRequestDTO {
    id: string;
    requestCode: string;
    requesterName: string;
    supporterName: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt?: string | null;
}








/** ==============================
 *   MODULE MAINTENANCE ACCEPTANCE
 *  ============================== */

export interface IReqAcceptanceApproveDTO {
    rating: number;            // 1–5 saoResRequestCommonDTO
    isOnTime: boolean;
    isProfessional: boolean;
    isDeviceWorking: boolean;
    comment?: string;          // góp ý thêm
}

export interface IReqAcceptanceRejectDTO {
    rejectReasonId: number | string;
    note?: string;
}


export interface IResAcceptanceCardDTO {
    // ======= Thông tin cơ bản của phiếu =======
    acceptanceId?: string | null;
    requestId: string;
    requestCode: string;
    priorityLevel: PriorityLevel;
    status: MaintenanceRequestStatus;
    createdAt?: string | null;
    completedAt?: string | null;

    // ======= Thông tin khảo sát / kế hoạch =======
    maintenanceTypeActual?: MaintenanceType | null;
    actualIssueDescription?: string | null;
    surveyInfo?: IResSurveyCommonDTO | null;
    planInfo?: IResPlanCommonDTO | null;

    acceptanceProgress?: string | null;
    fullyAccepted?: boolean | null;

    // ======= Thiết bị =======
    device: {
        deviceCode?: string | null;
        deviceName?: string | null;
        image1?: string | null;
        image2?: string | null;
        image3?: string | null;
        companyName?: string | null;
        departmentName?: string | null;
        locationDetail?: string | null;
    };

    // ======= Lý do từ chối nghiệm thu gần nhất =======
    rejectInfo?: {
        reasonName: string;
        note?: string | null;
        rejectedBy?: string | null;
        rejectedAt: string;
    } | null;
}



export interface IResAcceptanceDetailDTO {
    requestInfo: IResRequestCommonDTO;
    surveyInfo?: IResSurveyCommonDTO | null;
    planInfo?: IResPlanCommonDTO | null;
    tasks?: IResExecutionTaskDTO[] | null;
    rejectHistory?: {
        reasonName: string;
        note?: string | null;
        rejectedBy?: string | null;
        rejectedAt: string;
    }[] | null;
}

export interface IResAcceptanceDTO {
    id?: string | null;
    acceptedAt?: string | null;
    rating?: number | null;
    comment?: string | null;

    requestId?: string | null;
    requestCode?: string | null;
    status: MaintenanceRequestStatus;
    priorityLevel?: PriorityLevel | null;
    maintenanceType?: MaintenanceType | null;
    createdAt?: string | null;

    device?: {
        deviceCode?: string | null;
        deviceName?: string | null;
        image1?: string | null;
        image2?: string | null;
        image3?: string | null;
        companyName?: string | null;
        departmentName?: string | null;
        locationDetail?: string | null;
    } | null;

    acceptanceProgress?: string | null;
    fullyAccepted?: boolean | null;
}


export interface IResEvaluationDTO {
    rating?: number | null;
    isOnTime?: boolean | null;
    isProfessional?: boolean | null;
    isDeviceWorking?: boolean | null;
    comment?: string | null;
    evaluatedAt?: string | null;
}






/** ==============================
 *  MAINTENANCE SCHEDULE MODULE
 * ============================== */

/** Enum trạng thái lịch bảo trì (theo backend Java) */
export type MaintenanceScheduleStatus =
    | "CHUA_THUC_HIEN"
    | "DA_TAO_PHIEU"
    | "HOAN_THANH";

export interface IMaintenanceSchedule {
    id: string;
    deviceCode?: string;
    deviceName?: string;
    scheduledDate: string;
    underWarranty: boolean;
    status: MaintenanceScheduleStatus;
    requestCode?: string | null;
    createdAt?: string | null;
}

export interface IMaintenanceScheduleByDevice {
    id: string;
    scheduledDate: string;
    underWarranty: boolean;
    status: MaintenanceScheduleStatus;
    requestCode?: string | null;
}

export interface IMaintenanceScheduleDetail {
    id: string;
    scheduledDate: string;
    underWarranty: boolean;
    note?: string | null;
    requestInfo?: IResRequestCommonDTO | null;
}































// ==================== +++++++++++++++ BÁO CÁO THỐNG KÊ +++++++++++++++ ====================

// ------------------------ REQUEST FILTERS ------------------------

export interface IRequestMaintenanceFilter {
    fromDate?: string;
    toDate?: string;
    companyName?: string;
    departmentName?: string;
    maintenanceType?: string;
    status?: string;
    priorityLevel?: string;
    keyword?: string;
}

export interface IDeviceHistoryFilter {
    deviceCode?: string;
    deviceName?: string;
    companyName?: string;
    departmentName?: string;
    fromDate?: string;
    toDate?: string;
}

export interface IMaterialUsageFilter {
    fromDate?: string;
    toDate?: string;
    materialType?: string;
    warehouseName?: string;
    unitName?: string;
}

export interface ITechnicianActivityFilter {
    fromDate?: string;
    toDate?: string;
    specialty?: string;
    type?: string;
}

export interface IDeviceDepreciationFilter {
    companyId?: number | string;
    departmentId?: number | string;
    deviceTypeId?: number | string;
    status?: string;
    startDate?: string;
    endDate?: string;
}



export interface IWarrantyProductFilter {
    startDate?: string;
    endDate?: string;
    customerCode?: string;
    customerName?: string;
    city?: string;
    ward?: string;
    deviceType?: string;
    solution?: string;
}

// ------------------------ RESPONSE MODELS ------------------------

export interface IDeviceDepreciationReport {
    deviceCode: string;
    deviceName: string;
    companyName: string;
    departmentName: string;
    deviceTypeName: string;
    assetType: string;
    unitPrice: number;

    startDate?: string;
    warrantyExpiryDate?: string;
    depreciationPeriod?: string;
    depreciationEndDate?: string;

    monthlyDepreciation?: number;
    depreciationToDate?: number;
    remainingValue?: number;

    monthlyDepreciationStr?: string;
    depreciationToDateStr?: string;
    remainingValueStr?: string;

    managerName?: string;
    status?: string;
}

export interface IDeviceMaintenanceHistory {
    maintenanceCount: number;
    deviceCode: string;
    deviceName: string;
    companyName: string;
    departmentName: string;
    issueDescription: string;
    causeName: string;
    damageLevel: string;
    maintenanceType: string;
    solutionMethod: string;
    priorityLevel: string;

    createdDate?: string;
    creatorName?: string;
    startDate?: string;
    endDate?: string;
    executorName?: string;
    acceptanceDate?: string;
    acceptanceUserName?: string;
    deviceStatusAfter?: string;
}

export interface IMaintenanceRequestReport {
    requestCode: string;
    deviceName: string;
    companyName: string;
    departmentName: string;
    issueDescription: string;
    causeName: string;

    damageLevel: string;
    maintenanceType: string;

    solutionMethods: string[];
    priorityLevel: string;
    status: string;
    rejectReason?: string;

    createdDate?: string;
    creatorName?: string;
    surveyDate?: string;
    surveyorName?: string;
    planDate?: string;
    plannerName?: string;
    startDate?: string;
    endDate?: string;
    executorName?: string;
    acceptanceDate?: string;
    acceptanceUserName?: string;
}

export interface IMaterialUsageReport {
    partCode: string;
    partName: string;
    materialType: string;
    unitName: string;
    totalQuantityUsed: number;
    unitPrice: number;
    totalAmount: number;
    supplyCount: number;
    warehouseName: string;
    stockRemaining: number;
}



export interface ITechnicianActivityReport {
    technicianCode: string;
    fullName: string;
    specialty: string;
    type: string;
    totalAssigned: number;
    totalCompleted: number;
    completionRate: number;
    totalHours: number;
    avgHoursPerTask: number;
    onTimeCount: number;
}

// ------------------------ WARRANTY PRODUCT REPORT ------------------------

export interface IWarrantyProductReport {
    customerCode: string;
    customerName: string;
    phone?: string;
    address?: string;

    deviceCode: string;
    deviceName: string;
    deviceType?: string;
    brand?: string;
    model?: string;

    purchaseDate?: string;
    warrantyExpiryDate?: string;
    requestDate?: string;
    completionDate?: string;

    issue?: string;
    rootCause?: string;
    solutionMethods: string[];
    technicianName?: string;

    inWarranty?: boolean;
    warrantyRemainingDays?: number;
    warrantyStatusText?: string;
}



/** ========================= THONG BAO ====================================*/
export type NotificationType =
    | "REQUEST_ASSIGNED"     // Khi kỹ thuật viên được giao nhiệm vụ khảo sát / bảo trì
    | "PLAN_APPROVED"        // Khi kế hoạch bảo trì được phê duyệt
    | "PLAN_REJECTED"        // Khi kế hoạch bảo trì bị từ chối
    | "ACCEPTANCE_APPROVED"  // Khi phiếu bảo trì được nghiệm thu
    | "ACCEPTANCE_REJECTED"; // Khi phiếu bảo trì bị từ chối nghiệm thu

/** ================================
 *  THÔNG TIN MỘT THÔNG BÁO
 *  ================================ */
export interface INotification {
    id: string;             // ID thông báo
    title: string;          // Tiêu đề (VD: "Công việc mới được giao")
    message: string;        // Nội dung chi tiết
    type: NotificationType; // Loại thông báo
    read: boolean;          // Đã đọc hay chưa
    createdAt: string;      // Thời gian tạo (ISO)
}


