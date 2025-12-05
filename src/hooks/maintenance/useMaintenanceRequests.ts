import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchMaintenanceRequest,
    callFetchMaintenanceRequestById,
    callCreateInternalMaintenanceRequest,
    callCreateCustomerMaintenanceRequest,
    callAutoAssignAll,
    callAssignTechnicianManual,
    callFetchRejectLogsByRequestId,
    callFetchPendingMaintenanceRequests,
} from "@/config/api";
import type {
    IModelPaginate,
    IResMaintenanceRequestDTO,
    IResMaintenanceRequestDetailDTO,
    IReqMaintenanceRequestInternalDTO,
    IReqMaintenanceRequestCustomerDTO,
    IResMaintenanceRejectDTO,
} from "@/types/backend";
import { notify } from "@/components/common/notification/notify";


/** ========================= Lấy danh sách phiếu bảo trì ========================= */
export const useMaintenanceRequestsQuery = (query: string) => {
    return useQuery({
        queryKey: ["maintenance-requests", query],
        queryFn: async () => {
            const res = await callFetchMaintenanceRequest(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách phiếu bảo trì");
            return res.data as IModelPaginate<IResMaintenanceRequestDTO>;
        },
    });
};

/**  ========================= Lấy danh sách phiếu CHỜ PHÂN CÔNG ========================= */
export const usePendingMaintenanceRequestsQuery = (query: string) => {
    return useQuery({
        queryKey: ["pending-maintenance-requests", query],
        queryFn: async () => {
            const res = await callFetchPendingMaintenanceRequests(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách phiếu chờ phân công");
            return res.data as IModelPaginate<IResMaintenanceRequestDTO>;
        },
    });
};

/** ========================= Lấy chi tiết phiếu bảo trì theo ID ========================= */
export const useMaintenanceRequestByIdQuery = (id?: string) => {
    return useQuery({
        queryKey: ["maintenance-request", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID phiếu bảo trì");
            const res = await callFetchMaintenanceRequestById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin phiếu bảo trì");
            return res.data as IResMaintenanceRequestDetailDTO;
        },
    });
};

/** ========================= Lấy log từ chối phiếu bảo trì ========================= */
export const useRejectLogsByRequestIdQuery = (id?: string) => {
    return useQuery({
        queryKey: ["maintenance-request-reject-logs", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID phiếu bảo trì");
            const res = await callFetchRejectLogsByRequestId(id);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lấy danh sách log từ chối");
            return res.data as IResMaintenanceRejectDTO;
        },
    });
};

/** ========================= Tạo phiếu nội bộ (Employee) ========================= */
export const useCreateInternalMaintenanceRequestMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IReqMaintenanceRequestInternalDTO) => {
            const res = await callCreateInternalMaintenanceRequest(payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể tạo phiếu bảo trì nội bộ");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo phiếu bảo trì nội bộ thành công");
            queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo phiếu bảo trì nội bộ");
        },
    });
};

/** ========================= Tạo phiếu khách hàng (Customer) ========================= */
export const useCreateCustomerMaintenanceRequestMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IReqMaintenanceRequestCustomerDTO) => {
            const res = await callCreateCustomerMaintenanceRequest(payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể tạo phiếu bảo trì cho khách hàng");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo phiếu bảo trì khách hàng thành công");
            queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo phiếu bảo trì khách hàng");
        },
    });
};

/** ========================= Phân công kỹ thuật viên thủ công ========================= */
export const useAssignTechnicianManualMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            requestId,
            technicianId,
        }: {
            requestId: string;
            technicianId: string;
        }) => {
            const res = await callAssignTechnicianManual(requestId, technicianId);
            if (!res?.data) {
                throw new Error(res?.message || "Không thể gán kỹ thuật viên");
            }
            return { message: res.message, data: res.data };
        },
        onSuccess: (res) => {
            notify.updated(res.message || "Gán kỹ thuật viên thành công");
            queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
            queryClient.invalidateQueries({ queryKey: ["pending-maintenance-requests"] });
            queryClient.invalidateQueries({ queryKey: ["maintenance-request"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi gán kỹ thuật viên");
        },
    });
};

/** ========================= Phân công tự động ========================= */
export const useAutoAssignAllMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await callAutoAssignAll();
            if (!res?.data) {
                throw new Error(res?.message || "Không thể phân công tự động");
            }
            return { message: res.message, data: res.data };
        },
        onSuccess: (res) => {
            notify.success(res.message || "Phân công tự động thành công");
            queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
            queryClient.invalidateQueries({ queryKey: ["pending-maintenance-requests"] }); // ✅ làm mới tab chờ phân công
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi phân công tự động");
        },
    });
};
