import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchMaintenanceRequest,
    callFetchMaintenanceRequestById,
    callCreateInternalMaintenanceRequest,
    callCreateCustomerMaintenanceRequest,
    callAutoAssignAllMaintenanceRequests,
    callAssignTechnicianManual,
} from "@/config/api";
import type {
    IModelPaginate,
    IResMaintenanceRequestDTO,
    IResMaintenanceRequestDetailDTO,
    IReqMaintenanceRequestInternalDTO,
    IReqMaintenanceRequestCustomerDTO,
    IResMaintenanceAssignmentDTO,
} from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách phiếu bảo trì ========================= */
export const useMaintenanceRequestsQuery = (query: string) => {
    return useQuery({
        queryKey: ["maintenance-requests", query],
        queryFn: async () => {
            const res = await callFetchMaintenanceRequest(query);
            if (!res?.data)
                throw new Error("Không thể lấy danh sách phiếu bảo trì");
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
            if (!res?.data)
                throw new Error("Không thể lấy thông tin phiếu bảo trì");
            return res.data as IResMaintenanceRequestDetailDTO;
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
    return useMutation({
        mutationFn: async () => {
            const res = await callAutoAssignAllMaintenanceRequests();
            if (!res?.data)
                throw new Error(res?.message || "Không thể phân công tự động");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Đã phân công kỹ thuật viên tự động");
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
            if (!res?.data)
                throw new Error(res?.message || "Không thể gán kỹ thuật viên");
            return res.data as IResMaintenanceAssignmentDTO;
        },
        onSuccess: () => {
            notify.updated("Gán kỹ thuật viên thành công");
            queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
            queryClient.invalidateQueries({ queryKey: ["maintenance-request"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi gán kỹ thuật viên");
        },
    });
};
