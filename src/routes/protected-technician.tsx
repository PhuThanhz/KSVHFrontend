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

    const { data, isFetching, isError } = useTechnicianAssignmentsQuery("page=1&size=10&sort=assignedAt,desc");
    const assignments = data?.result ?? [];

    if (isFetching) return <Loading />;

    if (!isAuthenticated) return <Navigate to={redirectPath} replace />;

    if (role !== ROLES.TECHNICIAN) {
        return <NotPermitted message="Trang bạn yêu cầu hiện không khả dụng. Vui lòng kiểm tra lại hoặc quay về trang chính." />
            ;
    }

    if (isError || assignments.length === 0) {
        return <NotPermitted message="Trang bạn yêu cầu hiện không khả dụng. Vui lòng kiểm tra lại hoặc quay về trang chính." />;
    }

    return <>{children}</>;
};

export default ProtectedTechnicianPage;
