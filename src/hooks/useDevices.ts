import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchDevice,
    callFetchDeviceById,
    callCreateDevice,
    callUpdateDevice,
    callDeleteDevice,
    // callFetchDeviceParts,
    // callSyncDeviceParts,
} from "@/config/api";

import type {
    IDevice,
    IModelPaginate,
    ICreateDeviceRequest,
    IUpdateDeviceRequest,
    // IDevicePart,
} from "@/types/backend";
import { notify } from "@/components/common/notify";


export const useDevicesQuery = (query: string) => {
    return useQuery({
        queryKey: ["devices", query],
        queryFn: async () => {
            const res = await callFetchDevice(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách thiết bị");
            return res.data as IModelPaginate<IDevice>;
        },
    });
};
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
            // Invalidate danh sách devices
            queryClient.invalidateQueries({ queryKey: ["devices"] });
            // Invalidate device cụ thể vừa update
            queryClient.invalidateQueries({ queryKey: ["device", variables.id] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật thiết bị");
        },
    });
};

export const useDeleteDeviceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await callDeleteDevice(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa thiết bị");
            }
            return res.data;
        },
        onSuccess: (_, id) => {
            notify.deleted("Xóa thiết bị thành công");
            queryClient.invalidateQueries({ queryKey: ["devices"], exact: false });
            queryClient.removeQueries({ queryKey: ["device", id] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa thiết bị");
        },
    });



    // export const useDevicePartsQuery = (deviceId?: string) => {
    //     return useQuery<IDevicePart[], Error>({
    //         queryKey: ["device-parts", deviceId],
    //         enabled: !!deviceId,
    //         queryFn: async () => {
    //             if (!deviceId) throw new Error("Thiếu ID thiết bị");
    //             const res = await callFetchDeviceParts(deviceId);
    //             if (!res?.data) throw new Error("Không thể lấy danh sách linh kiện");
    //             return res.data as IDevicePart[];
    //         },
    //     });
    // };

    // export const useSyncDevicePartsMutation = () => {
    //     const queryClient = useQueryClient();

    //     return useMutation({
    //         mutationFn: async ({ deviceId, parts }: { deviceId: string; parts: IDevicePart[] }) => {
    //             const res = await callSyncDeviceParts(deviceId, parts);
    //             if (res?.statusCode !== 200 && res?.statusCode !== "200")
    //                 throw new Error(res?.message || "Không thể đồng bộ linh kiện");
    //             return res;
    //         },
    //         onSuccess: (_, { deviceId }) => {
    //             notify.updated("Đồng bộ linh kiện thành công");
    //             queryClient.invalidateQueries({ queryKey: ["device-parts", deviceId] });
    //         },
    //         onError: (error: any) => {
    //             notify.error(error.message || "Lỗi khi đồng bộ linh kiện");
    //         },
    //     });
    // };

};