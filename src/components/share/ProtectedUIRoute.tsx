import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { usePermission } from "@/hooks/usePermission";
import Loading from "@/components/common/loading/loading";
import NotPermitted from "./not-permitted";

interface IProps {
    module: string;
    path: string;
    method?: string;
    children: React.ReactNode;
}

const ProtectedUIRoute = ({ module, path, method = "VIEW", children }: IProps) => {
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.account);
    const { hasPermission } = usePermission();

    if (isLoading) return <Loading />;

    // Chưa đăng nhập → chuyển hướng login
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Kiểm tra quyền UI
    const allow = hasPermission(module, method, path);
    if (!allow) {
        return <NotPermitted message="Rất tiếc, nội dung bạn đang tìm không khả dụng hoặc đã bị hạn chế truy cập." />;
    }

    return <>{children} </>;
};

export default ProtectedUIRoute;
