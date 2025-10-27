import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchDeviceType,
    callFetchDeviceTypeById,
    callCreateDeviceType,
    callUpdateDeviceType,
    callDeleteDeviceType,
} from "@/config/api";
import type { IDeviceType, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách loại thiết bị ========================= */
export const useDeviceTypesQuery = (query: string) => {
    return useQuery<IModelPaginate<IDeviceType>, Error>({
        queryKey: ["device-types", query],
        queryFn: async () => {
            const res = await callFetchDeviceType(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách loại thiết bị");
            return res.data as IModelPaginate<IDeviceType>;
        },
        placeholderData: (prev) => prev,
    });
};

/** ========================= Lấy chi tiết loại thiết bị theo ID ========================= */
export const useDeviceTypeByIdQuery = (id?: number | string) => {
    return useQuery<IDeviceType, Error>({
        queryKey: ["device-type", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID loại thiết bị");
            const res = await callFetchDeviceTypeById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin loại thiết bị");
            return res.data as IDeviceType;
        },
    });
};

/** ========================= Tạo mới loại thiết bị ========================= */
export const useCreateDeviceTypeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: IDeviceType) => {
            const res = await callCreateDeviceType(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo loại thiết bị");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo loại thiết bị thành công");
            queryClient.invalidateQueries({ queryKey: ["device-types"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo loại thiết bị");
        },
    });
};

/** ========================= Cập nhật loại thiết bị ========================= */
export const useUpdateDeviceTypeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: IDeviceType) => {
            const res = await callUpdateDeviceType(payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật loại thiết bị");
            return res;
        },
        onSuccess: (res, payload) => {
            notify.updated(res?.message || "Cập nhật loại thiết bị thành công");
            if (payload?.id)
                queryClient.invalidateQueries({ queryKey: ["device-type", payload.id] });
            queryClient.invalidateQueries({ queryKey: ["device-types"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật loại thiết bị");
        },
    });
};

/** ========================= Xóa loại thiết bị ========================= */
export const useDeleteDeviceTypeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await callDeleteDeviceType(id);
            if (res?.statusCode !== 200 && res?.statusCode !== "200")
                throw new Error(res?.message || "Không thể xóa loại thiết bị");
            return res;
        },
        onSuccess: (res) => {
            notify.deleted(res?.message || "Xóa loại thiết bị thành công");
            queryClient.invalidateQueries({ queryKey: ["device-types"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa loại thiết bị");
        },
    });
};
