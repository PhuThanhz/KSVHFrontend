import React from "react";
import { Navigate } from "react-router-dom";
import NotPermitted from "@/components/share/protected-route.ts";
import Loading from "@/components/share/loading";
import { useTechnicianAssignmentsQuery } from "@/hooks/useTechnicianAssignments";

interface ProtectedTechnicianPageProps {
    isAuthenticated: boolean;
    redirectPath: string;
    children: React.ReactNode;
    path: string;
}

/**
 * Protected Page riêng cho Kỹ thuật viên
 * - Kiểm tra đăng nhập
 * - Lấy danh sách công việc được phân công
 * - Nếu chưa có công việc -> NotPermitted
 */
const ProtectedTechnicianPage: React.FC<ProtectedTechnicianPageProps> = ({
    isAuthenticated,
    redirectPath,
    children,
    path,
}) => {
    // ======================= Lấy danh sách công việc được phân công =======================
    const { data, isFetching, isError } = useTechnicianAssignmentsQuery("page=1&size=10&sort=assignedAt,desc");
    const assignments = data?.result ?? [];

    // ======================= Nếu đang tải dữ liệu =======================
    if (isFetching) {
        return <Loading />;
    }

    // ======================= Nếu chưa đăng nhập =======================
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // ======================= Nếu lỗi hoặc không có công việc =======================
    if (isError || assignments.length === 0) {
        return <NotPermitted message="Hiện tại bạn chưa có công việc nào được phân công." />;
    }

    // ======================= Nếu hợp lệ, render trang =======================
    return <>{children}</>;
};

export default ProtectedTechnicianPage;
