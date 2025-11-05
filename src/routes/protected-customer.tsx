import React from "react";
import { Navigate } from "react-router-dom";
import NotPermitted from "@/components/share/not-permitted";
import Loading from "@/components/share/loading";
import { useAppSelector } from "@/redux/hooks";
import { useMyPurchaseHistoryQuery, useMyMaintenanceRequestsQuery } from "@/hooks/useCustomerPurchaseHistory";
import { ROLES } from "@/constants/roles";

interface ProtectedCustomerPageProps {
    redirectPath: string;
    children: React.ReactNode;
    path: "purchase-history" | "maintenance-requests";
}


const ProtectedCustomerPage: React.FC<ProtectedCustomerPageProps> = ({
    redirectPath,
    children,
    path,
}) => {
    const { isAuthenticated, user } = useAppSelector((s) => s.account);
    const role = user?.role?.name;

    const { data: dataPurchase, isLoading: loadingPurchase } = useMyPurchaseHistoryQuery();
    const { data: dataMaintenance, isLoading: loadingMaintenance } =
        useMyMaintenanceRequestsQuery("page=1&pageSize=10");

    if (loadingPurchase || loadingMaintenance) return <Loading />;

    if (!isAuthenticated) return <Navigate to={redirectPath} replace />;

    if (role !== ROLES.CUSTOMER) {
        return <NotPermitted message="Bạn không có quyền truy cập trang khách hàng." />;
    }

    const purchaseHistory = dataPurchase?.result ?? [];
    const maintenanceRequests = dataMaintenance?.result ?? [];

    if (
        (path === "purchase-history" && purchaseHistory.length === 0) ||
        (path === "maintenance-requests" && maintenanceRequests.length === 0)
    ) {
        return (
            <NotPermitted
                message={`Không có ${path === "purchase-history" ? "lịch sử mua hàng" : "phiếu bảo trì nào"}`}
            />
        );
    }

    return <>{children}</>;
};

export default ProtectedCustomerPage;
