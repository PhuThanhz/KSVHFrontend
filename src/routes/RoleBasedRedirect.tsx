import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { PATHS } from "@/constants/paths";
import Loading from "@/components/share/loading";
import { ROLES } from "@/constants/roles";

/**
 * RoleBasedRedirect
 * - Điều hướng theo vai trò sau khi đăng nhập hoặc khi truy cập /redirect.
 */
const RoleBasedRedirect: React.FC = () => {
    const { isAuthenticated, isLoading, user } = useAppSelector((s) => s.account);
    const role = user?.role?.name;

    if (isLoading) return <Loading />;

    if (!isAuthenticated) return <Navigate to={PATHS.LOGIN} replace />;

    switch (role) {
        case ROLES.SUPER_ADMIN:
        case ROLES.EMPLOYEE:
            return <Navigate to={PATHS.ADMIN.ROOT} replace />;
        case ROLES.TECHNICIAN:
            return <Navigate to={PATHS.TECHNICIAN.ROOT} replace />;
        case ROLES.CUSTOMER:
            return <Navigate to={PATHS.CLIENT.HOME} replace />;
        default:
            return <Navigate to={PATHS.LOGIN} replace />;
    }
};

export default RoleBasedRedirect;
