import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchTechnicianSupplier,
    callFetchTechnicianSupplierById,
    callCreateTechnicianSupplier,
    callUpdateTechnicianSupplier,
    callDeleteTechnicianSupplier,
} from "@/config/api";
import type { ITechnicianSupplier, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notify";


export const useTechnicianSuppliersQuery = (query: string) => {
    return useQuery({
        queryKey: ["technician-suppliers", query],
        queryFn: async () => {
            const res = await callFetchTechnicianSupplier(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách nhà cung cấp kỹ thuật viên");
            return res.data as IModelPaginate<ITechnicianSupplier>;
        },
    });
};


export const useTechnicianSupplierByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["technician-supplier", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID nhà cung cấp kỹ thuật viên");
            const res = await callFetchTechnicianSupplierById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin nhà cung cấp kỹ thuật viên");
            return res.data as ITechnicianSupplier;
        },
    });
};


export const useCreateTechnicianSupplierMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ITechnicianSupplier) => {
            const res = await callCreateTechnicianSupplier(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo nhà cung cấp kỹ thuật viên");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo nhà cung cấp kỹ thuật viên thành công");
            queryClient.invalidateQueries({ queryKey: ["technician-suppliers"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo nhà cung cấp kỹ thuật viên");
        },
    });
};


export const useUpdateTechnicianSupplierMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ITechnicianSupplier) => {
            const res = await callUpdateTechnicianSupplier(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật nhà cung cấp kỹ thuật viên");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật nhà cung cấp kỹ thuật viên thành công");
            queryClient.invalidateQueries({ queryKey: ["technician-suppliers"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật nhà cung cấp kỹ thuật viên");
        },
    });
};


export const useDeleteTechnicianSupplierMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeleteTechnicianSupplier(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa nhà cung cấp kỹ thuật viên");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa nhà cung cấp kỹ thuật viên thành công");
            queryClient.invalidateQueries({ queryKey: ["technician-suppliers"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa nhà cung cấp kỹ thuật viên");
        },
    });
};
