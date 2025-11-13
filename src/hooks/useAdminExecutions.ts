import { useQuery } from "@tanstack/react-query";
import {
    callFetchAdminExecutions,
    callFetchAdminExecutionDetail,
} from "@/config/api";
import type {
    IModelPaginate,
    IResAdminExecutionCardDTO,
    IResAdminExecutionDetailDTO,
} from "@/types/backend";

/** ========================= Lấy danh sách thi công ========================= */
export const useAdminExecutionsQuery = (query: string) => {
    return useQuery({
        queryKey: ["admin-executions", query],
        queryFn: async () => {
            const res = await callFetchAdminExecutions(query);
            if (!res?.data)
                throw new Error("Không thể lấy danh sách thi công");
            return res.data as IModelPaginate<IResAdminExecutionCardDTO>;
        },
    });
};

/** ========================= Lấy chi tiết thi công ========================= */
export const useAdminExecutionDetailQuery = (requestId?: string) => {
    return useQuery({
        queryKey: ["admin-execution-detail", requestId],
        enabled: !!requestId,
        queryFn: async () => {
            if (!requestId) throw new Error("Thiếu requestId");
            const res = await callFetchAdminExecutionDetail(requestId);
            if (!res?.data)
                throw new Error("Không thể lấy chi tiết thi công");
            return res.data as IResAdminExecutionDetailDTO;
        },
    });
};
