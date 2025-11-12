import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchAllExecutions,
    callFetchApprovedExecutions,
    callGetExecutionDetail,
    callStartExecution,
    callUpdateExecutionProgress,
    callCompleteExecution,
} from "@/config/api";
import type {
    IModelPaginate,
    IResExecutionCardDTO,
    IResExecutionDetailDTO,
    IReqUpdateProgressDTO,
} from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ========================= Danh sách thi công (Admin) ========================= */
export const useMaintenanceExecutionsQuery = (query: string) => {
    return useQuery({
        queryKey: ["maintenance-executions", query],
        queryFn: async () => {
            const res = await callFetchAllExecutions(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách thi công");
            return res.data as IModelPaginate<any>;
        },
    });
};

/** ========================= Danh sách phiếu được duyệt để thi công (Kỹ thuật viên) ========================= */
export const useApprovedExecutionsQuery = (query: string) => {
    return useQuery({
        queryKey: ["maintenance-executions-approved", query],
        queryFn: async () => {
            const res = await callFetchApprovedExecutions(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách phiếu thi công");
            return res.data as IModelPaginate<IResExecutionCardDTO>;
        },
    });
};

/** ========================= Chi tiết thi công ========================= */
export const useExecutionDetailQuery = (id?: string) => {
    return useQuery({
        queryKey: ["maintenance-execution-detail", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID phiếu thi công");
            const res = await callGetExecutionDetail(id);
            if (!res?.data) throw new Error("Không thể lấy chi tiết thi công");
            return res.data as IResExecutionDetailDTO;
        },
    });
};

/** ========================= Bắt đầu thi công ========================= */
export const useStartExecutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await callStartExecution(id);
            if (!res?.data) throw new Error(res?.message || "Không thể bắt đầu thi công");
            return res.data as IResExecutionDetailDTO;
        },
        onSuccess: (res) => {
            notify.success("Đã bắt đầu thi công");
            queryClient.invalidateQueries({ queryKey: ["maintenance-executions-approved"] });
            queryClient.invalidateQueries({ queryKey: ["maintenance-execution-detail", res.requestInfo.requestId] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi bắt đầu thi công");
        },
    });
};

/** ========================= Cập nhật tiến độ thi công ========================= */
export const useUpdateExecutionProgressMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: { id: string; payload: IReqUpdateProgressDTO }) => {
            const { id, payload } = params;
            const res = await callUpdateExecutionProgress(id, payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật tiến độ thi công");
            return res.data as IResExecutionDetailDTO;
        },
        onSuccess: (res) => {
            notify.updated("Cập nhật tiến độ thành công");
            queryClient.invalidateQueries({ queryKey: ["maintenance-execution-detail", res.requestInfo.requestId] });
            queryClient.invalidateQueries({ queryKey: ["maintenance-executions-approved"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật tiến độ thi công");
        },
    });
};

/** ========================= Hoàn thành thi công ========================= */
export const useCompleteExecutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await callCompleteExecution(id);
            if (!res?.data)
                throw new Error(res?.message || "Không thể hoàn thành thi công");
            return res.data as IResExecutionDetailDTO;
        },
        onSuccess: (res) => {
            notify.success("Đã hoàn thành công việc thi công");
            queryClient.invalidateQueries({ queryKey: ["maintenance-execution-detail", res.requestInfo.requestId] });
            queryClient.invalidateQueries({ queryKey: ["maintenance-executions-approved"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi hoàn thành thi công");
        },
    });
};
