import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IShiftTemplate, IModelPaginate } from "@/types/backend";
import {
    callFetchShiftTemplate,
    callFetchShiftTemplateById,
    callCreateShiftTemplate,
    callUpdateShiftTemplate,
    callDeleteShiftTemplate,
} from "@/config/api";
import { notify } from "@/components/common/notification/notify";

/** ========================= Lấy danh sách ca mẫu ========================= */
export const useShiftTemplatesQuery = (query: string) => {
    return useQuery({
        queryKey: ["shift-templates", query],
        queryFn: async () => {
            const res = await callFetchShiftTemplate(query);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lấy danh sách ca mẫu");
            return res.data as IModelPaginate<IShiftTemplate>;
        },
        staleTime: 1000 * 60 * 2, // cache 2 phút
        retry: false,
    });
};

/** ========================= Lấy chi tiết ca mẫu theo ID ========================= */
export const useShiftTemplateByIdQuery = (id?: string) => {
    return useQuery({
        queryKey: ["shift-template", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID ca mẫu");
            const res = await callFetchShiftTemplateById(id);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lấy thông tin ca mẫu");
            return res.data as IShiftTemplate;
        },
        retry: false,
    });
};

/** ========================= Tạo mới ca mẫu ========================= */
export const useCreateShiftTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IShiftTemplate) => {
            const res = await callCreateShiftTemplate(payload);
            if (!res?.data || res.statusCode !== 201) {
                throw new Error(res?.message || "Không thể tạo ca mẫu");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.created("Tạo ca mẫu thành công");
            queryClient.invalidateQueries({ queryKey: ["shift-templates"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo ca mẫu");
        },
    });
};

/** ========================= Cập nhật ca mẫu ========================= */
export const useUpdateShiftTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IShiftTemplate) => {
            const res = await callUpdateShiftTemplate(payload);
            if (!res?.data || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể cập nhật ca mẫu");
            }
            return res.data;
        },
        onSuccess: (data, variables) => {
            notify.updated("Cập nhật ca mẫu thành công");
            queryClient.invalidateQueries({ queryKey: ["shift-templates"], exact: false });
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ["shift-template", variables.id] });
            }
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật ca mẫu");
        },
    });
};

/** ========================= Xóa ca mẫu ========================= */
export const useDeleteShiftTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await callDeleteShiftTemplate(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa ca mẫu");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa ca mẫu thành công");
            queryClient.invalidateQueries({ queryKey: ["shift-templates"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa ca mẫu");
        },
    });
};
