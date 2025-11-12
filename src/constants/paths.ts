export const PATHS = {
    HOME: "/",
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",

    ADMIN: {
        ROOT: "/admin",
        DASHBOARD: "/admin",
        USER: "/admin/user",
        ROLE: "/admin/role",
        PERMISSION: "/admin/permission",
        COMPANY: "/admin/company",
        ASSET_TYPE: "/admin/asset-type",
        DEPARTMENT: "/admin/department",
        POSITION: "/admin/position",
        EMPLOYEE: "/admin/employee",
        CUSTOMER: "/admin/customer",
        DEVICE_TYPE: "/admin/device-type",
        SKILL: "/admin/skill",
        SOLUTION: "/admin/solution",
        WAREHOUSE: "/admin/warehouse",
        UNIT: "/admin/unit",
        REJECT_REASON: "/admin/reject-reason",
        TECHNICIAN_SUPPLIER: "/admin/technician-supplier",
        ISSUE: "/admin/issue",
        MATERIAL_SUPPLIER: "/admin/material-supplier",
        TECHNICIAN: "/admin/technician",
        INVENTORY_ITEM: "/admin/inventory-items",
        DEVICE_PART: "/admin/device-part",
        DEVICE: "/admin/device",
        SHIFT_TEMPLATE: "/admin/shift-template",
        TECHNICIAN_AVAILABILITY: "/admin/technician-availability",
        CUSTOMER_PURCHASE_HISTORY: "/admin/customer-purchase-history",
        MAINTENANCE: "/admin/maintenance",
        ISSUE_SKILL_MAPPING: "/admin/issue-skill-mapping",
        MAINTENANCE_CAUSE: "/admin/maintenance-cause",
        MAINTENANCE_APPROVAL: "/admin/maintenance-approval",

    },

    CLIENT: {
        HOME: "/",
        CREATE_MAINTENANCE_REQUEST: "/create-maintenance-request",
        MY_MAINTENANCE_REQUESTS: "/my-maintenance-requests",
        PURCHASE_HISTORY: "/purchase-history",

    },

    TECHNICIAN: {
        ROOT: "/technician",
        ASSIGNMENT: "/technician/assignment",          // Công việc được giao
        SCHEDULE: "/technician/schedule",              // Lịch làm việc
        SURVEY: "/technician/survey",                  // Khảo sát
        PLAN: "/technician/plan",                      // Kế hoạch làm việc
        EXECUTION: "/technician/execution",            // Thi công bảo trì
        NOTIFICATIONS: "/technician/notifications",    // Thông báo
        PROFILE: "/technician/profile",                // Hồ sơ cá nhân
        PROGRESS: "/technician/progress",              // Cập nhật tiến độ công việc
    },


};
