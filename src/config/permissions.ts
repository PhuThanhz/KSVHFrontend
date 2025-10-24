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
        UPDATE: { method: "PUT", apiPath: "/api/v1/employees/{id}", module: "EMPLOYEE" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/employees/{id}", module: "EMPLOYEE" },
    },
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
};