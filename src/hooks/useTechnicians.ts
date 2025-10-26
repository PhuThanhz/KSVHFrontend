import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ITechnician, IModelPaginate } from "@/types/backend";
import {
    callFetchTechnician,
    callFetchTechnicianById,
    callCreateTechnician,
    callUpdateTechnician,
    callDeleteTechnician,
} from "@/config/api";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách kỹ thuật viên ========================= */
export const useTechniciansQuery = (query: string) => {
    return useQuery({
        queryKey: ["technicians", query],
        queryFn: async () => {
            const res = await callFetchTechnician(query);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lấy danh sách kỹ thuật viên");
            return res.data as IModelPaginate<ITechnician>;
        },
        staleTime: 1000 * 60 * 2, // cache 2 phút
        retry: false,
    });
};

/** ========================= Lấy chi tiết kỹ thuật viên theo ID ========================= */
export const useTechnicianByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["technician", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID kỹ thuật viên");
            const res = await callFetchTechnicianById(id);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lấy thông tin kỹ thuật viên");
            return res.data as ITechnician;
        },
        retry: false,
    });
};

/** ========================= Tạo mới kỹ thuật viên ========================= */
export const useCreateTechnicianMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: ITechnician) => {
            const res = await callCreateTechnician(payload);
            if (!res?.data || res.statusCode !== 201) {
                throw new Error(res?.message || "Không thể tạo kỹ thuật viên");
            }
            return res.data;
        },
        onSuccess: (_, variables) => {
            notify.created("Tạo kỹ thuật viên thành công");
            queryClient.invalidateQueries({ queryKey: ["technicians"], exact: false });
            // Nếu muốn làm mới detail sau khi tạo, có thể thêm:
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ["technician", variables.id] });
            }
        },
        onError: (error: any) => {
            notify.error(error?.message || "Lỗi khi tạo kỹ thuật viên");
        },
    });
};

/** ========================= Cập nhật kỹ thuật viên ========================= */
export const useUpdateTechnicianMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: ITechnician) => {
            const res = await callUpdateTechnician(payload);
            if (!res?.data || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể cập nhật kỹ thuật viên");
            }
            return res.data;
        },
        onSuccess: (data, variables) => {
            notify.updated("Cập nhật kỹ thuật viên thành công");
            queryClient.invalidateQueries({ queryKey: ["technicians"], exact: false });
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ["technician", variables.id] });
            }
        },
        onError: (error: any) => {
            notify.error(error?.message || "Lỗi khi cập nhật kỹ thuật viên");
        },
    });
};
