import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IWarehouse, IModelPaginate } from "@/types/backend";
import {
    callFetchWarehouse,
    callFetchWarehouseById,
    callCreateWarehouse,
    callUpdateWarehouse,
    callDeleteWarehouse,
} from "@/config/api";
import { notify } from "@/components/common/notify";


export const useWarehousesQuery = (query: string) => {
    return useQuery({
        queryKey: ["warehouses", query],
        queryFn: async () => {
            const res = await callFetchWarehouse(query);
            if (!res?.data) throw new Error("Không thể tải danh sách kho");
            return res.data as IModelPaginate<IWarehouse>;
        },
    });
};


export const useWarehouseByIdQuery = (id?: number | string) => {
    return useQuery({
        queryKey: ["warehouse", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID kho");
            const res = await callFetchWarehouseById(id);
            if (!res?.data) throw new Error("Không thể tải thông tin kho");
            return res.data as IWarehouse;
        },
    });
};


export const useCreateWarehouseMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (warehouse: IWarehouse) => {
            const res = await callCreateWarehouse(warehouse);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo kho");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo kho thành công");
            queryClient.invalidateQueries({ queryKey: ["warehouses"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo kho");
        },
    });
};


export const useUpdateWarehouseMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (warehouse: IWarehouse) => {
            const res = await callUpdateWarehouse(warehouse);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật kho");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật kho thành công");
            queryClient.invalidateQueries({ queryKey: ["warehouses"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật kho");
        },
    });
};

/* ===========================
   XÓA KHO
   =========================== */
export const useDeleteWarehouseMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await callDeleteWarehouse(id);
            if (!res?.statusCode || res.statusCode !== 200)
                throw new Error(res?.message || "Không thể xóa kho");
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa kho thành công");
            queryClient.invalidateQueries({ queryKey: ["warehouses"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa kho");
        },
    });
};
