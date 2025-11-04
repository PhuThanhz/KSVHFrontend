import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchMaintenanceRequest,
    callFetchMaintenanceRequestById,
    callCreateInternalMaintenanceRequest,
    callCreateCustomerMaintenanceRequest,
    callAutoAssignAllMaintenanceRequests,
    callAssignTechnicianManual,
    callFetchRejectLogsByRequestId,
} from "@/config/api";
import type {
    IModelPaginate,
    IResMaintenanceRequestDTO,
    IResMaintenanceRequestDetailDTO,
    IReqMaintenanceRequestInternalDTO,
    IReqMaintenanceRequestCustomerDTO,
    IResAutoAssignAllDTO,
    IResMaintenanceRejectDTO,
} from "@/types/backend";
import { notify } from "@/components/common/notify";

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

/** ========================= Phân công kỹ thuật viên tự động ========================= */
export const useAutoAssignAllMaintenanceRequestsMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<IResAutoAssignAllDTO>({
        mutationFn: async () => {
            const res = await callAutoAssignAllMaintenanceRequests();
            if (!res?.data)
                throw new Error(res?.message || "Không thể phân công tự động");
            return res.data as IResAutoAssignAllDTO;
        },
        onSuccess: () => {
            notify.created("Đã phân công kỹ thuật viên tự động");
            queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi phân công tự động");
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
            queryClient.invalidateQueries({ queryKey: ["maintenance-request"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi gán kỹ thuật viên");
        },
    });
};
