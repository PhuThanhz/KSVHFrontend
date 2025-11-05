import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import NotPermitted from "../not-permitted";
import Loading from "../loading";
import { ROLES } from "@/constants/roles";

/**
 * ProtectedRoute
 * - Bảo vệ khu vực dành cho Admin hoặc Employee.
 * - Kiểm tra đăng nhập + role.
 * - Backend vẫn phải kiểm tra RBAC ở API.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading, user } = useAppSelector((s) => s.account);
    const role = user?.role?.name;

    if (isLoading) return <Loading />;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (role !== ROLES.SUPER_ADMIN && role !== ROLES.EMPLOYEE) {
        return <NotPermitted message="Bạn không có quyền truy cập trang quản trị." />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
