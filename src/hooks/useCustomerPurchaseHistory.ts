import { useQuery } from "@tanstack/react-query";
import {
    callFetchCustomerPurchaseHistory,
    callFetchCustomerPurchaseHistoryById,
    callFetchCustomerPurchaseHistoryByCustomer,
    callFetchMyPurchaseHistory,
    callFetchMyMaintenanceRequests,
} from "@/config/api";
import type {
    ICustomerPurchaseHistoryAdmin,
    ICustomerPurchaseHistoryClient,
    IModelPaginate,
    IResMaintenanceRequestDTO,
} from "@/types/backend";
import { notify } from "@/components/common/notification/notify";

/** ========================= ADMIN: Lấy danh sách lịch sử mua hàng ========================= */
export const useCustomerPurchaseHistoriesQuery = (query: string) => {
    return useQuery({
        queryKey: ["customer-purchase-histories", query],
        queryFn: async () => {
            try {
                const res = await callFetchCustomerPurchaseHistory(query);
                if (!res?.data)
                    throw new Error("Không thể lấy danh sách lịch sử mua hàng");
                return res.data as IModelPaginate<ICustomerPurchaseHistoryAdmin>;
            } catch (error: any) {
                notify.error(error.message || "Lỗi khi tải danh sách lịch sử mua hàng");
                throw error;
            }
        },
    });
};

/** ========================= ADMIN: Lấy chi tiết lịch sử mua hàng theo ID ========================= */
export const useCustomerPurchaseHistoryByIdQuery = (id?: string) => {
    return useQuery({
        queryKey: ["customer-purchase-history", id],
        enabled: !!id,
        queryFn: async () => {
            try {
                if (!id) throw new Error("Thiếu ID lịch sử mua hàng");
                const res = await callFetchCustomerPurchaseHistoryById(id);
                if (!res?.data)
                    throw new Error("Không thể lấy thông tin lịch sử mua hàng");
                return res.data as ICustomerPurchaseHistoryAdmin;
            } catch (error: any) {
                notify.error(error.message || "Lỗi khi tải chi tiết lịch sử mua hàng");
                throw error;
            }
        },
    });
};

/** ========================= ADMIN: Lấy lịch sử mua hàng theo khách hàng ========================= */
export const useCustomerPurchaseHistoryByCustomerQuery = (customerId?: string) => {
    return useQuery({
        queryKey: ["customer-purchase-history-by-customer", customerId],
        enabled: !!customerId,
        queryFn: async () => {
            try {
                if (!customerId) throw new Error("Thiếu ID khách hàng");
                const res = await callFetchCustomerPurchaseHistoryByCustomer(customerId);
                if (!res?.data)
                    throw new Error("Không thể lấy lịch sử mua hàng của khách hàng");
                return res.data as ICustomerPurchaseHistoryAdmin[];
            } catch (error: any) {
                notify.error(error.message || "Lỗi khi tải lịch sử mua hàng theo khách hàng");
                throw error;
            }
        },
    });
};

/** ========================= CLIENT: Lấy lịch sử mua hàng của chính khách hàng đang đăng nhập ========================= */
export const useMyPurchaseHistoryQuery = () => {
    return useQuery({
        queryKey: ["my-purchase-history"],
        queryFn: async () => {
            try {
                const res = await callFetchMyPurchaseHistory();
                if (!res?.data)
                    throw new Error("Không thể lấy lịch sử mua hàng của bạn");
                return res.data as IModelPaginate<ICustomerPurchaseHistoryClient>;
            } catch (error: any) {
                console.warn("useMyPurchaseHistoryQuery error:", error.message);
                throw error;
            }
        },
    });
};

/** ========================= Lấy danh sách phiếu bảo trì của chính khách hàng ========================= */
export const useMyMaintenanceRequestsQuery = (query: string) => {
    return useQuery({
        queryKey: ["my-maintenance-requests", query],
        queryFn: async () => {
            const res = await callFetchMyMaintenanceRequests(query);
            if (!res?.data)
                throw new Error("Không thể lấy danh sách phiếu bảo trì của khách hàng");
            return res.data as IModelPaginate<IResMaintenanceRequestDTO>;
        },
    });
};