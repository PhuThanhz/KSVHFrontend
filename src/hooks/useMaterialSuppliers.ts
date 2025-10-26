import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchMaterialSupplier,
    callFetchMaterialSupplierById,
    callCreateMaterialSupplier,
    callUpdateMaterialSupplier,
    callDeleteMaterialSupplier,
} from "@/config/api";
import type { IMaterialSupplier, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách nhà cung cấp vật tư ========================= */
export const useMaterialSuppliersQuery = (query: string) => {
    return useQuery({
        queryKey: ["material-suppliers", query],
        queryFn: async () => {
            const res = await callFetchMaterialSupplier(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách nhà cung cấp vật tư");
            return res.data as IModelPaginate<IMaterialSupplier>;
        },
    });
};

/** ========================= Lấy chi tiết nhà cung cấp vật tư theo ID ========================= */
export const useMaterialSupplierByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["material-supplier", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID nhà cung cấp vật tư");
            const res = await callFetchMaterialSupplierById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin nhà cung cấp vật tư");
            return res.data as IMaterialSupplier;
        },
    });
};

/** ========================= Tạo mới nhà cung cấp vật tư ========================= */
export const useCreateMaterialSupplierMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IMaterialSupplier) => {
            const res = await callCreateMaterialSupplier(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo nhà cung cấp vật tư");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo nhà cung cấp vật tư thành công");
            queryClient.invalidateQueries({ queryKey: ["material-suppliers"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo nhà cung cấp vật tư");
        },
    });
};

/** ========================= Cập nhật nhà cung cấp vật tư ========================= */
export const useUpdateMaterialSupplierMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IMaterialSupplier) => {
            const res = await callUpdateMaterialSupplier(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật nhà cung cấp vật tư");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật nhà cung cấp vật tư thành công");
            queryClient.invalidateQueries({ queryKey: ["material-suppliers"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật nhà cung cấp vật tư");
        },
    });
};

/** ========================= Xóa nhà cung cấp vật tư ========================= */
export const useDeleteMaterialSupplierMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeleteMaterialSupplier(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa nhà cung cấp vật tư");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa nhà cung cấp vật tư thành công");
            queryClient.invalidateQueries({ queryKey: ["material-suppliers"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa nhà cung cấp vật tư");
        },
    });
};
