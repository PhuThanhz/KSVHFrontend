import React from "react";
import { Navigate } from "react-router-dom";
import NotPermitted from "@/components/share/protected-route.ts";
import { useMyPurchaseHistoryQuery, useMyMaintenanceRequestsQuery } from "@/hooks/useCustomerPurchaseHistory";
import Loading from "@/components/share/loading";

interface ProtectedCustomerPageProps {
    isAuthenticated: boolean;
    redirectPath: string;
    children: React.ReactNode;
    path: string;
}

/**
 * ProtectedCustomerPage
 * - Dành riêng cho khách hàng
 * - Kiểm tra đăng nhập và dữ liệu (mua hàng, phiếu bảo trì)
 */
const ProtectedCustomerPage: React.FC<ProtectedCustomerPageProps> = ({
    isAuthenticated,
    redirectPath,
    children,
    path,
}) => {
    // Lấy dữ liệu cần thiết
    const { data: dataPurchase, isLoading: loadingPurchase } = useMyPurchaseHistoryQuery();
    const { data: dataMaintenance, isLoading: loadingMaintenance } =
        useMyMaintenanceRequestsQuery("page=1&pageSize=10");

    const purchaseHistory = dataPurchase?.result ?? [];
    const maintenanceRequests = dataMaintenance?.result ?? [];

    // Loading
    if (loadingPurchase || loadingMaintenance) {
        return <Loading />;
    }

    // Chưa đăng nhập
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // Không có dữ liệu
    if (
        (path === "purchase-history" && purchaseHistory.length === 0) ||
        (path === "maintenance-requests" && maintenanceRequests.length === 0)
    ) {
        return (
            <NotPermitted
                message={`Không có ${path === "purchase-history" ? "lịch sử mua hàng" : "phiếu bảo trì nào"
                    }`}
            />
        );
    }

    // Có dữ liệu
    return <>{children}</>;
};

export default ProtectedCustomerPage;
