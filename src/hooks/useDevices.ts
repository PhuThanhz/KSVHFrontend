import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchDevice,
    callFetchDeviceById,
    callCreateDevice,
    callUpdateDevice,
    callDeleteDevice,
} from "@/config/api";
import type {
    IDevice,
    IModelPaginate,
    ICreateDeviceRequest,
    IUpdateDeviceRequest,
} from "@/types/backend";
import { notify } from "@/components/common/notify";

/** =========================
 *  Lấy danh sách thiết bị
 *  ========================= */
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

export const useDeviceByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["device", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID thiết bị");
            const res = await callFetchDeviceById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin thiết bị");
            return res.data as IDevice;
        },
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
            id: string | number;
            payload: IUpdateDeviceRequest;
        }) => {
            const res = await callUpdateDevice(id, payload);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật thiết bị");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật thiết bị thành công");
            queryClient.invalidateQueries({ queryKey: ["devices"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật thiết bị");
        },
    });
};


export const useDeleteDeviceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeleteDevice(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa thiết bị");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa thiết bị thành công");
            queryClient.invalidateQueries({ queryKey: ["devices"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa thiết bị");
        },
    });
};
