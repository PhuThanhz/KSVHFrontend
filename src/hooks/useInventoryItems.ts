import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchInventoryItem,
    callFetchInventoryItemById,
    callCreateInventoryItem,
    callUpdateInventoryItem,
    callDeleteInventoryItem,
} from "@/config/api";
import type { IInventoryItem, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách vật tư tồn kho ========================= */
export const useInventoryItemsQuery = (query: string) => {
    return useQuery({
        queryKey: ["inventoryItems", query],
        queryFn: async () => {
            const res = await callFetchInventoryItem(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách vật tư tồn kho");
            return res.data as IModelPaginate<IInventoryItem>;
        },
    });
};

/** ========================= Lấy chi tiết vật tư theo ID ========================= */
export const useInventoryItemByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["inventoryItem", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID vật tư tồn kho");
            const res = await callFetchInventoryItemById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin vật tư tồn kho");
            return res.data as IInventoryItem;
        },
    });
};

/** ========================= Tạo mới vật tư tồn kho ========================= */
export const useCreateInventoryItemMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IInventoryItem) => {
            const res = await callCreateInventoryItem(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo vật tư tồn kho");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo vật tư tồn kho thành công");
            queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo vật tư tồn kho");
        },
    });
};

/** ========================= Cập nhật vật tư tồn kho ========================= */
export const useUpdateInventoryItemMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IInventoryItem) => {
            const res = await callUpdateInventoryItem(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật vật tư tồn kho");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật vật tư tồn kho thành công");
            queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật vật tư tồn kho");
        },
    });
};

/** ========================= Xóa vật tư tồn kho ========================= */
export const useDeleteInventoryItemMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeleteInventoryItem(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa vật tư tồn kho");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa vật tư tồn kho thành công");
            queryClient.invalidateQueries({ queryKey: ["inventoryItems"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa vật tư tồn kho");
        },
    });
};
