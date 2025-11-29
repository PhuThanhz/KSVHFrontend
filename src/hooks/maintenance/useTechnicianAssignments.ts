import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchTechnicianAssignments,
    callFetchTechnicianAssignmentById,
    callAcceptTechnicianAssignment,
    callRejectTechnicianAssignment,
} from "@/config/api";
import type {
    IModelPaginate,
    IReqRejectAssignmentDTO,
    IResTechnicianAssignmentDTO,
} from "@/types/backend";
import { notify } from "@/components/common/notification/notify";

/** =========================
 * Lấy danh sách công việc được phân công cho kỹ thuật viên
 * ========================= */
export const useTechnicianAssignmentsQuery = (query: string) => {
    return useQuery({
        queryKey: ["technicianAssignments", query],
        queryFn: async () => {
            const res = await callFetchTechnicianAssignments(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách công việc kỹ thuật viên");
            return res.data as IModelPaginate<IResTechnicianAssignmentDTO>;
        },
    });
};

/** =========================
 * Lấy chi tiết công việc kỹ thuật viên theo ID
 * ========================= */
export const useTechnicianAssignmentByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["technicianAssignment", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID công việc kỹ thuật viên");
            const res = await callFetchTechnicianAssignmentById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin công việc kỹ thuật viên");
            return res.data as IResTechnicianAssignmentDTO;
        },
    });
};

/** =========================
 * Xác nhận nhận việc (Kỹ thuật viên)
 * ========================= */
export const useAcceptTechnicianAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callAcceptTechnicianAssignment(id);
            if (!res?.data)
                throw new Error(res?.message || "Không thể xác nhận nhận việc");
            return res;
        },
        onSuccess: (res) => {
            notify.success(res?.message || "Xác nhận nhận việc thành công");
            queryClient.invalidateQueries({ queryKey: ["technicianAssignments"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xác nhận nhận việc");
        },
    });
};

/** =========================
 * Từ chối nhận việc (Kỹ thuật viên)
 * ========================= */
export const useRejectTechnicianAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string | number;
            payload: IReqRejectAssignmentDTO;
        }) => {
            const res = await callRejectTechnicianAssignment(id, payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể từ chối nhận việc");
            return res;
        },
        onSuccess: (res) => {
            notify.warning(res?.message || "Đã từ chối nhận việc");
            queryClient.invalidateQueries({ queryKey: ["technicianAssignments"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi từ chối nhận việc");
        },
    });
};
