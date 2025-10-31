import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import NotPermitted from '@/components/share/protected-route.ts';
import { useMyPurchaseHistoryQuery, useMyMaintenanceRequestsQuery } from "@/hooks/useCustomerPurchaseHistory"; // Import hooks lấy dữ liệu
import Loading from '@/components/share/loading';

interface ProtectedPageProps {
    isAuthenticated: boolean;
    redirectPath: string; // Đường dẫn chuyển hướng khi không có dữ liệu
    children: React.ReactNode;
    path: string; // Xác định là `purchase-history` hay `maintenance-requests`
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({
    isAuthenticated,
    redirectPath,
    children,
    path,
}) => {
    // ========================== Lấy dữ liệu =========================
    const { data: dataPurchase, isLoading: loadingPurchase } = useMyPurchaseHistoryQuery();
    const { data: dataMaintenance, isLoading: loadingMaintenance } = useMyMaintenanceRequestsQuery("page=1&pageSize=10");

    // ========================== Xử lý dữ liệu =========================
    const purchaseHistory = dataPurchase?.result ?? [];
    const maintenanceRequests = dataMaintenance?.result ?? [];

    // Nếu đang tải dữ liệu
    if (loadingPurchase || loadingMaintenance) {
        return <Loading />; // Hiển thị loading khi đang tải dữ liệu
    }

    // Nếu người dùng chưa đăng nhập, chuyển hướng về trang login
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // Nếu không có dữ liệu (lịch sử mua hàng hoặc phiếu bảo trì)
    if (
        (path === "purchase-history" && purchaseHistory.length === 0) ||
        (path === "maintenance-requests" && maintenanceRequests.length === 0)
    ) {
        return <NotPermitted message={`Không có ${path === "purchase-history" ? "lịch sử mua hàng" : "phiếu bảo trì nào"}`} />;
    }

    // Nếu có dữ liệu, render trang chính
    return <>{children}</>;
};

export default ProtectedPage;
