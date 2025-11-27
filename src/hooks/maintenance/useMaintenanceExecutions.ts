import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchAllExecutions,
    callFetchApprovedExecutions,
    callGetExecutionDetail,
    callStartExecution,
    callCompleteExecution,
    callUpdateExecutionTask,
    callFetchSupportRequests,
} from "@/config/api";
import type {
    IModelPaginate,
    IResExecutionCardDTO,
    IResExecutionDetailDTO,
    IReqUpdateTaskDTO,
    IReqSupportRequestDTO,
    IReqSupportApproveDTO
} from "@/types/backend";
import { notify } from "@/components/common/notify";
import {
    callRequestSupport,
    callApproveSupportRequest,
} from "@/config/api";
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
/** ========================= Cập nhật 1 task thi công ========================= */
export const useUpdateExecutionTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, payload }: { taskId: string; payload: IReqUpdateTaskDTO }) => {
            const res = await callUpdateExecutionTask(taskId, payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật task thi công");
            return res.data as IResExecutionDetailDTO;
        },

        onSuccess: (res) => {
            notify.success("Cập nhật task thành công");

            // invalidate detail của phiếu
            queryClient.invalidateQueries({
                queryKey: ["maintenance-execution-detail", res.requestInfo.requestId],
            });

            // invalidate list phiếu (có thể task hoàn thành → % thay đổi)
            queryClient.invalidateQueries({
                queryKey: ["maintenance-executions-approved"],
            });
        },

        onError: (err: any) => {
            notify.error(err?.message || "Lỗi khi cập nhật task");
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

/** ========================= Gửi yêu cầu hỗ trợ (KTV) ========================= */
export const useRequestSupportMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { requestId: string; data: IReqSupportRequestDTO }) => {
            const { requestId, data } = params;
            const res = await callRequestSupport(requestId, data);

            // Kiểm tra phản hồi hợp lệ
            if (res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể gửi yêu cầu hỗ trợ");
            }

            return res.data;
        },

        onSuccess: (_, { requestId }) => {
            notify.success("Đã gửi yêu cầu hỗ trợ thành công");
            queryClient.invalidateQueries({
                queryKey: ["maintenance-execution-detail", requestId],
            });
        },

        onError: (error: any) => {
            const messageText = error.message || "Lỗi khi gửi yêu cầu hỗ trợ";
            if (messageText.includes("Chỉ kỹ thuật viên chính")) {
                notify.warning(messageText);
            } else if (messageText.includes("đã được gửi trước đó")) {
                notify.warning(messageText);
            } else {
                notify.error(messageText);
            }
        },
    });
};

/** ========================= Phê duyệt yêu cầu hỗ trợ (Admin) ========================= */
export const useApproveSupportRequestMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { supportId: string; data: IReqSupportApproveDTO }) => {
            const { supportId, data } = params;
            const res = await callApproveSupportRequest(supportId, data);

            if (res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể phê duyệt yêu cầu hỗ trợ");
            }

            return res.data;
        },

        onSuccess: () => {
            notify.success("Đã phê duyệt yêu cầu hỗ trợ");
            queryClient.invalidateQueries({ queryKey: ["admin-support-requests"] });
            queryClient.invalidateQueries({ queryKey: ["maintenance-executions"] });
        },

        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi phê duyệt yêu cầu hỗ trợ");
        },
    });
};

/** ========================= Danh sách yêu cầu hỗ trợ (Admin theo phiếu) ========================= */
export const useSupportRequestsQuery = (requestId?: string) => {
    return useQuery({
        queryKey: ["admin-support-requests", requestId],
        enabled: !!requestId,
        queryFn: async () => {
            if (!requestId) throw new Error("Thiếu requestId để lấy danh sách hỗ trợ");
            const res = await callFetchSupportRequests(requestId);
            if (!res?.data) throw new Error("Không thể lấy danh sách yêu cầu hỗ trợ");
            return res.data;
        },
    });
};
