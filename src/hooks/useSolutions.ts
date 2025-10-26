import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ISolution, IModelPaginate } from "@/types/backend";
import {
    callFetchSolution,
    callFetchSolutionById,
    callCreateSolution,
    callUpdateSolution,
    callDeleteSolution,
} from "@/config/api";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách phương án xử lý ========================= */
export const useSolutionsQuery = (query: string) => {
    return useQuery({
        queryKey: ["solutions", query],
        queryFn: async () => {
            const res = await callFetchSolution(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách phương án xử lý");
            return res.data as IModelPaginate<ISolution>;
        },
    });
};

/** ========================= Lấy chi tiết phương án xử lý theo ID ========================= */
export const useSolutionByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["solution", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID phương án xử lý");
            const res = await callFetchSolutionById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin phương án xử lý");
            return res.data as ISolution;
        },
    });
};

/** ========================= Tạo mới phương án xử lý ========================= */
export const useCreateSolutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (solution: ISolution) => {
            const res = await callCreateSolution(solution);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo phương án xử lý");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo phương án xử lý thành công");
            queryClient.invalidateQueries({ queryKey: ["solutions"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo phương án xử lý");
        },
    });
};

/** ========================= Cập nhật phương án xử lý ========================= */
export const useUpdateSolutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (solution: ISolution) => {
            const res = await callUpdateSolution(solution);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật phương án xử lý");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật phương án xử lý thành công");
            queryClient.invalidateQueries({ queryKey: ["solutions"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật phương án xử lý");
        },
    });
};

/** ========================= Xóa phương án xử lý ========================= */
export const useDeleteSolutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await callDeleteSolution(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa phương án xử lý");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa phương án xử lý thành công");
            queryClient.invalidateQueries({ queryKey: ["solutions"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa phương án xử lý");
        },
    });
};
