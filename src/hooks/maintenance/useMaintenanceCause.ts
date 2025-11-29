import {
    callFetchMaintenanceCause,
    callFetchMaintenanceCauseById,
    callCreateMaintenanceCause,
    callUpdateMaintenanceCause,
} from "@/config/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/common/notification/notify";
import type { IMaintenanceCause, IModelPaginate } from "@/types/backend";

/** ========================= Lấy danh sách nguyên nhân ========================= */
export const useMaintenanceCausesQuery = (query: string) => {
    return useQuery({
        queryKey: ["maintenanceCauses", query],
        queryFn: async () => {
            const res = await callFetchMaintenanceCause(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách nguyên nhân");
            return res.data as IModelPaginate<IMaintenanceCause>;
        },
    });
};

/** ========================= Lấy chi tiết nguyên nhân theo ID ========================= */
export const useMaintenanceCauseByIdQuery = (id?: string) => {
    return useQuery({
        queryKey: ["maintenanceCause", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID nguyên nhân");
            const res = await callFetchMaintenanceCauseById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin nguyên nhân");
            return res.data as IMaintenanceCause;
        },
    });
};

/** ========================= Tạo mới nguyên nhân ========================= */
export const useCreateMaintenanceCauseMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IMaintenanceCause) => {
            const res = await callCreateMaintenanceCause(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo nguyên nhân");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo nguyên nhân thành công");
            queryClient.invalidateQueries({ queryKey: ["maintenanceCauses"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo nguyên nhân");
        },
    });
};

/** ========================= Cập nhật nguyên nhân ========================= */
export const useUpdateMaintenanceCauseMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IMaintenanceCause) => {
            const res = await callUpdateMaintenanceCause(payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật nguyên nhân");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật nguyên nhân thành công");
            queryClient.invalidateQueries({ queryKey: ["maintenanceCauses"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật nguyên nhân");
        },
    });
};

