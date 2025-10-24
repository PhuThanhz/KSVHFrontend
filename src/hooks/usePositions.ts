import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchPosition,
    callFetchPositionById,
    callCreatePosition,
    callUpdatePosition,
    callDeletePosition,
} from "@/config/api";
import type { IPosition, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách chức vụ ========================= */
export const usePositionsQuery = (query: string) => {
    return useQuery({
        queryKey: ["positions", query],
        queryFn: async () => {
            const res = await callFetchPosition(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách chức vụ");
            return res.data as IModelPaginate<IPosition>;
        },
    });
};

/** ========================= Lấy chi tiết theo ID ========================= */
export const usePositionByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["position", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID chức vụ");
            const res = await callFetchPositionById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin chức vụ");
            return res.data as IPosition;
        },
    });
};

/** ========================= Tạo mới chức vụ ========================= */
export const useCreatePositionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (pos: IPosition) => {
            const res = await callCreatePosition({ name: pos.name });
            if (!res?.data)
                throw new Error(res?.message || "Không thể tạo chức vụ");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo chức vụ thành công");
            queryClient.invalidateQueries({ queryKey: ["positions"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo chức vụ");
        },
    });
};

/** ========================= Cập nhật chức vụ ========================= */
export const useUpdatePositionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (pos: IPosition) => {
            const res = await callUpdatePosition(pos);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật chức vụ");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật chức vụ thành công");
            queryClient.invalidateQueries({ queryKey: ["positions"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật chức vụ");
        },
    });
};

/** ========================= Xóa chức vụ ========================= */
export const useDeletePositionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeletePosition(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa chức vụ");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa chức vụ thành công");
            queryClient.invalidateQueries({ queryKey: ["positions"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa chức vụ");
        },
    });
};
