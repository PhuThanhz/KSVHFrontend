import { useQuery } from "@tanstack/react-query";
import {
    callFetchMaintenanceHistories,
    callFetchMaintenanceHistoryDetail,
} from "@/config/api";

import type {
    IModelPaginate,
    IResMaintenanceHistoryCardDTO,
    IResMaintenanceHistoryDetailDTO
} from "@/types/backend";

/** ========================= Danh sách lịch sử bảo trì ========================= */
export const useMaintenanceHistoryQuery = (query: string) => {
    return useQuery({
        queryKey: ["maintenance-history-list", query],
        queryFn: async () => {
            const res = await callFetchMaintenanceHistories(query);
            if (!res?.data)
                throw new Error("Không thể lấy danh sách lịch sử bảo trì");
            return res.data as IModelPaginate<IResMaintenanceHistoryCardDTO>;
        },
    });
};

/** ========================= Chi tiết lịch sử bảo trì ========================= */
export const useMaintenanceHistoryDetailQuery = (id?: string) => {
    return useQuery({
        queryKey: ["maintenance-history-detail", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID lịch sử bảo trì");
            const res = await callFetchMaintenanceHistoryDetail(id);
            if (!res?.data)
                throw new Error("Không thể lấy chi tiết lịch sử bảo trì");
            return res.data as IResMaintenanceHistoryDetailDTO;
        },
    });
};
