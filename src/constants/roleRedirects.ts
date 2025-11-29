import { PATHS } from "@/constants/paths";


export const ROLE_REDIRECTS: Record<string, string> = {
    super_admin: PATHS.ADMIN.DASHBOARD,       // Quản trị toàn quyền
    admin_sub: PATHS.ADMIN.DASHBOARD,         // Admin phụ
    employee: PATHS.CLIENT.HOME,              // Nhân viên
    technician: PATHS.TECHNICIAN.ROOT,        // Kỹ thuật viên (KTV)
    customer: PATHS.CLIENT.HOME,              // Khách hàng
};

export const getRedirectPathByRole = (roleName?: string): string => {
    if (!roleName) return PATHS.HOME;

    const lower = roleName.toLowerCase();

    // Dò trong bảng ROLE_REDIRECTS
    for (const [key, path] of Object.entries(ROLE_REDIRECTS)) {
        if (lower.includes(key)) {
            return path;
        }
    }

    // Fallback nếu không match
    return PATHS.HOME;
};
