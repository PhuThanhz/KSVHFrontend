import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchDevicePart,
    callFetchDevicePartById,
    callCreateDevicePart,
    callUpdateDevicePart,
    callDeleteDevicePart,
} from "@/config/api";
import type { IDevicePart, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách linh kiện ========================= */
export const useDevicePartsQuery = (query: string) => {
    return useQuery({
        queryKey: ["device-parts", query],
        queryFn: async () => {
            const res = await callFetchDevicePart(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách linh kiện");
            return res.data as IModelPaginate<IDevicePart>;
        },
    });
};

/** ========================= Lấy chi tiết linh kiện theo ID ========================= */
export const useDevicePartByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["device-part", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID linh kiện");
            const res = await callFetchDevicePartById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin linh kiện");
            return res.data as IDevicePart;
        },
    });
};

/** ========================= Tạo mới linh kiện ========================= */
export const useCreateDevicePartMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IDevicePart) => {
            const res = await callCreateDevicePart(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo linh kiện");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo linh kiện thành công");
            queryClient.invalidateQueries({ queryKey: ["device-parts"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo linh kiện");
        },
    });
};

/** ========================= Cập nhật linh kiện ========================= */
export const useUpdateDevicePartMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string | number;
            payload: IDevicePart;
        }) => {
            const res = await callUpdateDevicePart(id, payload);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật linh kiện");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật linh kiện thành công");
            queryClient.invalidateQueries({ queryKey: ["device-parts"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật linh kiện");
        },
    });
};

/** ========================= Xóa linh kiện ========================= */
export const useDeleteDevicePartMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeleteDevicePart(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa linh kiện");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa linh kiện thành công");
            queryClient.invalidateQueries({ queryKey: ["device-parts"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa linh kiện");
        },
    });
};
