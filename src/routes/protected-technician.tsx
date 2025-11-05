import React from "react";
import { Navigate } from "react-router-dom";
import NotPermitted from "@/components/share/not-permitted";
import Loading from "@/components/share/loading";
import { useAppSelector } from "@/redux/hooks";
import { useTechnicianAssignmentsQuery } from "@/hooks/useTechnicianAssignments";
import { ROLES } from "@/constants/roles";

interface ProtectedTechnicianPageProps {
    redirectPath: string;
    children: React.ReactNode;
}

const ProtectedTechnicianPage: React.FC<ProtectedTechnicianPageProps> = ({
    redirectPath,
    children,
}) => {
    const { isAuthenticated, user } = useAppSelector((s) => s.account);
    const role = user?.role?.name;

    const { isFetching, isError } = useTechnicianAssignmentsQuery(
        "page=1&size=10&sort=assignedAt,desc"
    );

    if (isFetching) return <Loading />;

    if (!isAuthenticated) return <Navigate to={redirectPath} replace />;

    if (role !== ROLES.TECHNICIAN) {
        return (
            <NotPermitted message="Trang bạn yêu cầu hiện không khả dụng. Vui lòng kiểm tra lại hoặc quay về trang chính." />
        );
    }

    if (isError) {
        return (
            <NotPermitted message="Không thể tải dữ liệu kỹ thuật viên. Vui lòng thử lại sau." />
        );
    }

    return <>{children}</>;
};

export default ProtectedTechnicianPage;
