import {
    callFetchMaintenanceSchedules,
    callFetchMaintenanceScheduleById,
    callFetchScheduleByDevice,
    callGenerateScheduleRequest,
    callGenerateDueRequests,
} from "@/config/api";

import type {
    IMaintenanceSchedule,
    IMaintenanceScheduleDetail,
    IMaintenanceScheduleByDevice,
    IModelPaginate,
} from "@/types/backend";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/common/notification/notify";

/* ============================================================
 * 1. Lấy danh sách lịch bảo trì (pagination)
 * ============================================================ */
export const useMaintenanceSchedulesQuery = (query: string) => {
    return useQuery({
        queryKey: ["maintenance-schedules", query],
        queryFn: async () => {
            const res = await callFetchMaintenanceSchedules(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách lịch bảo trì");
            return res.data as IModelPaginate<IMaintenanceSchedule>;
        },
    });
};

/* ============================================================
 * 2. Lấy chi tiết lịch bảo trì
 * ============================================================ */
export const useMaintenanceScheduleByIdQuery = (id?: string) => {
    return useQuery({
        queryKey: ["maintenance-schedule-detail", id],
        enabled: !!id,
        queryFn: async () => {
            const res = await callFetchMaintenanceScheduleById(id!);
            if (!res?.data)
                throw new Error("Không thể lấy thông tin chi tiết lịch bảo trì");
            return res.data as IMaintenanceScheduleDetail;
        },
    });
};

/* ============================================================
 * 3. Lấy danh sách lịch bảo trì theo thiết bị
 * ============================================================ */
export const useSchedulesByDeviceQuery = (deviceId?: string) => {
    return useQuery({
        queryKey: ["maintenance-schedules-device", deviceId],
        enabled: !!deviceId,
        queryFn: async () => {
            const res = await callFetchScheduleByDevice(deviceId!);
            if (!res?.data)
                throw new Error("Không thể lấy lịch bảo trì của thiết bị");
            return res.data as IMaintenanceScheduleByDevice[];
        },
    });
};

/* ============================================================
 * 4. Tạo phiếu bảo trì THỦ CÔNG từ lịch
 * ============================================================ */
export const useGenerateScheduleRequestMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (scheduleId: string) => {
            const res = await callGenerateScheduleRequest(scheduleId);
            if (!res?.statusCode || res.statusCode !== 200)
                throw new Error(res?.message || "Không thể tạo phiếu bảo trì");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Đã tạo phiếu bảo trì thành công");
            queryClient.invalidateQueries({ queryKey: ["maintenance-schedules"] });
        },
        onError: (err: any) => {
            notify.error(err.message || "Lỗi khi tạo phiếu bảo trì");
        },
    });
};

/* ============================================================
 * 5. Sinh phiếu tự động cho các kỳ đến hạn
 * ============================================================ */
export const useGenerateDueRequestsMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await callGenerateDueRequests();
            if (!res?.statusCode || res.statusCode !== 200)
                throw new Error(res?.message || "Không thể sinh phiếu tự động");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Đã sinh phiếu bảo trì tự động");
            queryClient.invalidateQueries({ queryKey: ["maintenance-schedules"] });
        },
        onError: (err: any) => {
            notify.error(err.message || "Lỗi khi sinh phiếu tự động");
        },
    });
};
