export const ALL_PERMISSIONS = {
    USERS: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/users", module: "USERS" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/users/{id}", module: "USERS" },
        CREATE: { method: "POST", apiPath: "/api/v1/users", module: "USERS" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/users", module: "USERS" },
        FORGOT_PASSWORD: { method: "POST", apiPath: "/api/v1/users/forgot-password", module: "USERS" },
        CONFIRM_RESET_PASSWORD: { method: "POST", apiPath: "/api/v1/users/confirm-reset-password", module: "USERS" },
        SEND_ACCOUNT_INFO: { method: "POST", apiPath: "/api/v1/users/send-account-info", module: "USERS" },
    },

    PERMISSIONS: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/permissions", module: "PERMISSIONS" },
        CREATE: { method: "POST", apiPath: "/api/v1/permissions", module: "PERMISSIONS" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/permissions", module: "PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/permissions/{id}", module: "PERMISSIONS" },
    },

    ROLES: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/roles", module: "ROLES" },
        CREATE: { method: "POST", apiPath: "/api/v1/roles", module: "ROLES" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/roles", module: "ROLES" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/roles/{id}", module: "ROLES" },
    },

    COMPANY: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/companies", module: "COMPANY" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/companies/{id}", module: "COMPANY" },
        CREATE: { method: "POST", apiPath: "/api/v1/companies", module: "COMPANY" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/companies", module: "COMPANY" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/companies/{id}", module: "COMPANY" },
    },

    ASSET_TYPE: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/asset-types", module: "ASSET_TYPE" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/asset-types/{id}", module: "ASSET_TYPE" },
        CREATE: { method: "POST", apiPath: "/api/v1/asset-types", module: "ASSET_TYPE" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/asset-types", module: "ASSET_TYPE" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/asset-types/{id}", module: "ASSET_TYPE" },
    },

    DEPARTMENT: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/departments", module: "DEPARTMENT" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/departments/{id}", module: "DEPARTMENT" },
        CREATE: { method: "POST", apiPath: "/api/v1/departments", module: "DEPARTMENT" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/departments", module: "DEPARTMENT" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/departments/{id}", module: "DEPARTMENT" },
    },

    POSITION: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/positions", module: "POSITION" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/positions/{id}", module: "POSITION" },
        CREATE: { method: "POST", apiPath: "/api/v1/positions", module: "POSITION" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/positions", module: "POSITION" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/positions/{id}", module: "POSITION" },
    },

    EMPLOYEE: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/employees", module: "EMPLOYEE" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/employees/{id}", module: "EMPLOYEE" },
        CREATE: { method: "POST", apiPath: "/api/v1/employees", module: "EMPLOYEE" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/employees", module: "EMPLOYEE" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/employees/{id}", module: "EMPLOYEE" },
    },

    CUSTOMER: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/customers", module: "CUSTOMER" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/customers/{id}", module: "CUSTOMER" },
        CREATE: { method: "POST", apiPath: "/api/v1/customers", module: "CUSTOMER" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/customers", module: "CUSTOMER" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/customers/{id}", module: "CUSTOMER" },
    },
    DEVICE_TYPES: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/device-types", module: "DEVICE_TYPES" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/device-types/{id}", module: "DEVICE_TYPES" },
        CREATE: { method: "POST", apiPath: "/api/v1/device-types", module: "DEVICE_TYPES" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/device-types", module: "DEVICE_TYPES" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/device-types/{id}", module: "DEVICE_TYPES" },
    },
    SKILL: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/skills", module: "SKILL" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/skills/{id}", module: "SKILL" },
        CREATE: { method: "POST", apiPath: "/api/v1/skills", module: "SKILL" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/skills", module: "SKILL" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/skills/{id}", module: "SKILL" },
    },

    SOLUTION: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/solutions", module: "SOLUTION" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/solutions/{id}", module: "SOLUTION" },
        CREATE: { method: "POST", apiPath: "/api/v1/solutions", module: "SOLUTION" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/solutions", module: "SOLUTION" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/solutions/{id}", module: "SOLUTION" },
    },
    WAREHOUSE: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/warehouses", module: "WAREHOUSE" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/warehouses/{id}", module: "WAREHOUSE" },
        CREATE: { method: "POST", apiPath: "/api/v1/warehouses", module: "WAREHOUSE" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/warehouses", module: "WAREHOUSE" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/warehouses/{id}", module: "WAREHOUSE" },
    },
    UNIT: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/units", module: "UNIT" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/units/{id}", module: "UNIT" },
        CREATE: { method: "POST", apiPath: "/api/v1/units", module: "UNIT" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/units", module: "UNIT" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/units/{id}", module: "UNIT" },
    },
    REJECT_REASON: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/reject-reasons", module: "REJECT_REASON" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/reject-reasons/{id}", module: "REJECT_REASON" },
        CREATE: { method: "POST", apiPath: "/api/v1/reject-reasons", module: "REJECT_REASON" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/reject-reasons", module: "REJECT_REASON" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/reject-reasons/{id}", module: "REJECT_REASON" },
    },
    TECHNICIAN_SUPPLIER: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/technician-suppliers", module: "TECHNICIAN_SUPPLIER" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/technician-suppliers/{id}", module: "TECHNICIAN_SUPPLIER" },
        CREATE: { method: "POST", apiPath: "/api/v1/technician-suppliers", module: "TECHNICIAN_SUPPLIER" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/technician-suppliers", module: "TECHNICIAN_SUPPLIER" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/technician-suppliers/{id}", module: "TECHNICIAN_SUPPLIER" },
    },
    ISSUE: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/issues", module: "ISSUE" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/issues/{id}", module: "ISSUE" },
        CREATE: { method: "POST", apiPath: "/api/v1/issues", module: "ISSUE" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/issues", module: "ISSUE" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/issues/{id}", module: "ISSUE" },
    },
    MATERIAL_SUPPLIER: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/material-suppliers", module: "MATERIAL_SUPPLIER" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/material-suppliers/{id}", module: "MATERIAL_SUPPLIER" },
        CREATE: { method: "POST", apiPath: "/api/v1/material-suppliers", module: "MATERIAL_SUPPLIER" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/material-suppliers", module: "MATERIAL_SUPPLIER" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/material-suppliers/{id}", module: "MATERIAL_SUPPLIER" },
    },
    TECHNICIAN: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/technicians", module: "TECHNICIAN" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/technicians/{id}", module: "TECHNICIAN" },
        CREATE: { method: "POST", apiPath: "/api/v1/technicians", module: "TECHNICIAN" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/technicians", module: "TECHNICIAN" },
    },
    INVENTORY_ITEM: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/inventory-items", module: "INVENTORY_ITEM" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/inventory-items/{id}", module: "INVENTORY_ITEM" },
        CREATE: { method: "POST", apiPath: "/api/v1/inventory-items", module: "INVENTORY_ITEM" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/inventory-items", module: "INVENTORY_ITEM" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/inventory-items/{id}", module: "INVENTORY_ITEM" },
    },
    DEVICE: {
        GET_PAGINATE: { method: "GET", apiPath: "/api/v1/devices", module: "DEVICE" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/devices/{id}", module: "DEVICE" },
        CREATE: { method: "POST", apiPath: "/api/v1/devices", module: "DEVICE" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/devices/{id}", module: "DEVICE" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/devices/{id}", module: "DEVICE" },
    },
    // DEVICE_PART: {
    //     GET_BY_DEVICE_ID: { method: "GET", apiPath: "/api/v1/device-parts/{deviceId}", module: "DEVICE_PART" },
    //     SYNC_BY_DEVICE_ID: { method: "POST", apiPath: "/api/v1/device-parts/{deviceId}", module: "DEVICE_PART" },
    // },

};

export const ALL_MODULES = {
    FILES: "FILES",
    PERMISSIONS: "PERMISSIONS",
    ROLES: "ROLES",
    USERS: "USERS",
    COMPANY: "COMPANY",
    ASSET_TYPE: "ASSET_TYPE",
    DEPARTMENT: "DEPARTMENT",
    POSITION: "POSITION",
    EMPLOYEE: "EMPLOYEE",
    CUSTOMER: "CUSTOMER",
    DEVICE_TYPES: "DEVICE_TYPES",
    SKILL: "SKILL",
    SOLUTION: "SOLUTION",
    WAREHOUSE: "WAREHOUSE",
    UNIT: "UNIT",
    REJECT_REASON: "REJECT_REASON",
    TECHNICIAN_SUPPLIER: "TECHNICIAN_SUPPLIER",
    ISSUE: "ISSUE",
    MATERIAL_SUPPLIER: "MATERIAL_SUPPLIER",
    TECHNICIAN: "TECHNICIAN",
    // DEVICE_PART: "DEVICE_PART",
    DEVICE: "DEVICE",

};
