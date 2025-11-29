import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchDeviceParts,
    callCreateDevicePart,
    callUpdateDevicePartStatus,
    callDeleteDevicePart,
} from "@/config/api";

import type {
    IDevicePart,
    ICreatePartRequest,
    IUpdatePartStatusRequest,
} from "@/types/backend";

import { notify } from "@/components/common/notification/notify";

/* ============================================================
   Lấy danh sách linh kiện của 1 thiết bị
   ============================================================ */
export const useDevicePartsQuery = (deviceId?: string) => {
    return useQuery({
        queryKey: ["device-parts", deviceId],
        enabled: !!deviceId,
        queryFn: async () => {
            if (!deviceId) throw new Error("Thiếu deviceId");
            const res = await callFetchDeviceParts(deviceId);

            if (!res?.data) {
                throw new Error("Không thể lấy danh sách linh kiện");
            }

            return res.data as IDevicePart[];
        },
    });
};

/* ============================================================
   Tạo mới linh kiện
   ============================================================ */
export const useCreateDevicePartMutation = (deviceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: ICreatePartRequest) => {
            const res = await callCreateDevicePart(deviceId, payload);

            if (!res?.data) {
                throw new Error(res?.message || "Không thể tạo linh kiện");
            }

            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo linh kiện thành công");
            queryClient.invalidateQueries({ queryKey: ["device-parts", deviceId] });
        },
        onError: (err: any) => {
            notify.error(err?.message || "Lỗi khi tạo linh kiện");
        },
    });
};

/* ============================================================
   Cập nhật trạng thái linh kiện (status-only)
   ============================================================ */
export const useUpdateDevicePartStatusMutation = (deviceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            partId,
            payload,
        }: {
            partId: string;                               // ❗ sửa number → string
            payload: IUpdatePartStatusRequest;
        }) => {
            const res = await callUpdateDevicePartStatus(deviceId, partId, payload);

            if (!res?.data) {
                throw new Error(res?.message || "Không thể cập nhật trạng thái linh kiện");
            }

            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật trạng thái thành công");
            queryClient.invalidateQueries({ queryKey: ["device-parts", deviceId] });
        },
        onError: (err: any) => {
            notify.error(err?.message || "Lỗi khi cập nhật trạng thái linh kiện");
        },
    });
};

/* ============================================================
   Xóa linh kiện
   ============================================================ */
export const useDeleteDevicePartMutation = (deviceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (partId: string) => {          // ❗ sửa number → string
            const res = await callDeleteDevicePart(deviceId, partId);

            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa linh kiện");
            }

            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa linh kiện thành công");
            queryClient.invalidateQueries({ queryKey: ["device-parts", deviceId] });
        },
        onError: (err: any) => {
            notify.error(err?.message || "Lỗi khi xóa linh kiện");
        },
    });
};
