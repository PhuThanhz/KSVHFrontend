import {
    callFetchAssetType,
    callFetchAssetTypeById,
    callCreateAssetType,
    callUpdateAssetType,
    callDeleteAssetType,
} from "@/config/api";
import type { IAssetType, IModelPaginate } from "@/types/backend";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/common/notify";

// Lấy danh sách loại tài sản
export const useAssetTypesQuery = (query: string) => {
    return useQuery({
        queryKey: ["asset-types", query],
        queryFn: async () => {
            const res = await callFetchAssetType(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách loại tài sản");
            return res.data as IModelPaginate<IAssetType>;
        },
    });
};

// Lấy chi tiết loại tài sản theo ID
export const useAssetTypeByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["asset-type", id],
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID loại tài sản");
            const res = await callFetchAssetTypeById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin loại tài sản");
            return res.data as IAssetType;
        },
        enabled: !!id,
    });
};

// Tạo mới loại tài sản
export const useCreateAssetTypeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (assetType: IAssetType) => {
            const res = await callCreateAssetType(assetType);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo loại tài sản");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo loại tài sản thành công");
            queryClient.invalidateQueries({ queryKey: ["asset-types"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo loại tài sản");
        },
    });
};

// Cập nhật loại tài sản
export const useUpdateAssetTypeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (assetType: IAssetType) => {
            const res = await callUpdateAssetType(assetType);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật loại tài sản");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật loại tài sản thành công");
            queryClient.invalidateQueries({ queryKey: ["asset-types"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật loại tài sản");
        },
    });
};

// Xóa loại tài sản
export const useDeleteAssetTypeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await callDeleteAssetType(id);
            if (res?.statusCode !== 200 && res?.statusCode !== "200")
                throw new Error(res?.message || "Không thể xóa loại tài sản");
            return res;
        },
        onSuccess: (res) => {
            notify.deleted(res?.message || "Xóa loại tài sản thành công");
            queryClient.invalidateQueries({ queryKey: ["asset-types"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa loại tài sản");
        },
    });
};
