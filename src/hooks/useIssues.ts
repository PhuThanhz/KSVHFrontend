import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchIssue,
    callFetchIssueById,
    callCreateIssue,
    callUpdateIssue,
    callDeleteIssue,
} from "@/config/api";
import type { IIssue, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notification/notify";

/** ========================= Lấy danh sách vấn đề ========================= */
export const useIssuesQuery = (query: string) => {
    return useQuery({
        queryKey: ["issues", query],
        queryFn: async () => {
            const res = await callFetchIssue(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách vấn đề");
            return res.data as IModelPaginate<IIssue>;
        },
    });
};

/** ========================= Lấy chi tiết vấn đề theo ID ========================= */
export const useIssueByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["issue", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID vấn đề");
            const res = await callFetchIssueById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin vấn đề");
            return res.data as IIssue;
        },
    });
};

/** ========================= Tạo mới vấn đề ========================= */
export const useCreateIssueMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IIssue) => {
            const res = await callCreateIssue(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo vấn đề");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo vấn đề thành công");
            queryClient.invalidateQueries({ queryKey: ["issues"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo vấn đề");
        },
    });
};

/** ========================= Cập nhật vấn đề ========================= */
export const useUpdateIssueMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IIssue) => {
            const res = await callUpdateIssue(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật vấn đề");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật vấn đề thành công");
            queryClient.invalidateQueries({ queryKey: ["issues"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật vấn đề");
        },
    });
};

/** ========================= Xóa vấn đề ========================= */
export const useDeleteIssueMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeleteIssue(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa vấn đề");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa vấn đề thành công");
            queryClient.invalidateQueries({ queryKey: ["issues"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa vấn đề");
        },
    });
};
