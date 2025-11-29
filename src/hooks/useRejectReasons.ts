import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchRejectReason,
    callFetchRejectReasonById,
    callCreateRejectReason,
    callUpdateRejectReason,
    callDeleteRejectReason,
} from "@/config/api";
import type { IRejectReason, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notification/notify";

/** ========================= Lấy danh sách lý do từ chối ========================= */
export const useRejectReasonsQuery = (query: string) => {
    return useQuery({
        queryKey: ["reject-reasons", query],
        queryFn: async () => {
            const res = await callFetchRejectReason(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách lý do từ chối");
            return res.data as IModelPaginate<IRejectReason>;
        },
    });
};

/** ========================= Lấy chi tiết lý do theo ID ========================= */
export const useRejectReasonByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["reject-reason", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID lý do");
            const res = await callFetchRejectReasonById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin lý do từ chối");
            return res.data as IRejectReason;
        },
    });
};

/** ========================= Tạo mới lý do từ chối ========================= */
export const useCreateRejectReasonMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IRejectReason) => {
            const res = await callCreateRejectReason(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo lý do");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo lý do thành công");
            queryClient.invalidateQueries({ queryKey: ["reject-reasons"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo lý do");
        },
    });
};

/** ========================= Cập nhật lý do từ chối ========================= */
export const useUpdateRejectReasonMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IRejectReason) => {
            const res = await callUpdateRejectReason(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật lý do");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật lý do thành công");
            queryClient.invalidateQueries({ queryKey: ["reject-reasons"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật lý do");
        },
    });
};

/** ========================= Xóa lý do từ chối ========================= */
export const useDeleteRejectReasonMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeleteRejectReason(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa lý do");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa lý do thành công");
            queryClient.invalidateQueries({ queryKey: ["reject-reasons"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa lý do");
        },
    });
};
