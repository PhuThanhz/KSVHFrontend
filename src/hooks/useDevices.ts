import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchDevice,
    callFetchDeviceById,
    callCreateDevice,
    callUpdateDevice,
    callFetchDeviceByCode,
} from "@/config/api";

import type {
    IDevice,
    IDeviceList,
    IModelPaginate,
    ICreateDeviceRequest,
    IUpdateDeviceRequest,
} from "@/types/backend";

import { notify } from "@/components/common/notify";

/** ===================== Danh sách thiết bị ===================== **/
export const useDevicesQuery = (query: string) => {
    return useQuery({
        queryKey: ["devices", query],
        queryFn: async () => {
            const res = await callFetchDevice(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách thiết bị");
            return res.data as IModelPaginate<IDeviceList>;
        },
    });
};

/** ===================== Chi tiết thiết bị ===================== **/
export const useDeviceByIdQuery = (id?: string) => {
    return useQuery({
        queryKey: ["device", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID thiết bị");
            const res = await callFetchDeviceById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin thiết bị");
            return res.data as IDevice;
        },
        placeholderData: (prev) => prev,
    });
};

/** ===================== Tạo thiết bị ===================== **/
export const useCreateDeviceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ICreateDeviceRequest) => {
            const res = await callCreateDevice(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo thiết bị");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo thiết bị thành công");
            queryClient.invalidateQueries({ queryKey: ["devices"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo thiết bị");
        },
    });
};

/** ===================== Cập nhật thiết bị ===================== **/
export const useUpdateDeviceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string;
            payload: IUpdateDeviceRequest;
        }) => {
            const res = await callUpdateDevice(id, payload);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật thiết bị");
            return res;
        },
        onSuccess: (res, variables) => {
            notify.updated(res?.message || "Cập nhật thiết bị thành công");
            queryClient.invalidateQueries({ queryKey: ["devices"] });
            queryClient.invalidateQueries({ queryKey: ["device", variables.id] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật thiết bị");
        },
    });
};

/** ===================== Thiết bị theo mã vạch ===================== **/
export const useDeviceByCodeQuery = (deviceCode?: string) => {
    return useQuery({
        queryKey: ["device-by-code", deviceCode],
        enabled: !!deviceCode && deviceCode.trim() !== "",
        queryFn: async () => {
            if (!deviceCode) throw new Error("Thiếu mã thiết bị");

            const res = await callFetchDeviceByCode(deviceCode.trim());
            if (!res?.data) throw new Error("Không tìm thấy thiết bị");

            return res.data as IDevice;
        },
        placeholderData: (prev) => prev,
    });
};
