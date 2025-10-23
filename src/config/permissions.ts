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
};

export const ALL_MODULES = {
    FILES: "FILES",
    PERMISSIONS: "PERMISSIONS",
    ROLES: "ROLES",
    USERS: "USERS",
};
