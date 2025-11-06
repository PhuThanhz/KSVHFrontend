// src/hooks/usePermission.ts
import { useAppSelector } from "@/redux/hooks";

/**
 * Hook kiểm tra quyền truy cập (UI hoặc API)
 * ------------------------------------------
 * - Đọc quyền từ Redux (user.role.permissions)
 * - Dùng cho mọi nơi: Header, Route, Component, Button...
 *
 * @example
 * const { hasPermission, hasModule } = usePermission();
 * hasPermission('UI_MODULE', 'VIEW', '/ui/admin/dashboard');
 * hasModule('UI_MODULE');
 */

export const usePermission = () => {
    const permissions =
        useAppSelector((state) => state.account.user?.role?.permissions) || [];

    /**
     * Kiểm tra quyền theo module + method + apiPath
     * @param module string - tên module (ví dụ: 'UI_MODULE' hoặc 'DEVICE')
     * @param method string - hành động ('GET', 'POST', 'VIEW', 'UPDATE', ...)
     * @param apiPath string - endpoint hoặc định danh giao diện (vd '/ui/client/purchase-history')
     */
    const hasPermission = (
        module: string,
        method?: string,
        apiPath?: string
    ): boolean => {
        if (!permissions || permissions.length === 0) return false;

        return permissions.some((p) => {
            const matchModule = p.module === module;
            const matchMethod =
                !method || p.method.toUpperCase() === method.toUpperCase();
            const matchPath = !apiPath || p.apiPath === apiPath;

            return matchModule && matchMethod && matchPath;
        });
    };

    /**
     * Kiểm tra xem user có bất kỳ quyền nào trong 1 module
     * @param module string - tên module
     */
    const hasModule = (module: string): boolean => {
        if (!permissions || permissions.length === 0) return false;
        return permissions.some((p) => p.module === module);
    };

    /**
     * Kiểm tra quyền theo tên permission cụ thể (ví dụ: 'Xem lịch sử mua hàng')
     */
    const hasPermissionName = (name: string): boolean => {
        if (!permissions || permissions.length === 0) return false;
        return permissions.some(
            (p) => p.name.toLowerCase() === name.toLowerCase()
        );
    };

    return {
        hasPermission,
        hasModule,
        hasPermissionName,
    };
};
