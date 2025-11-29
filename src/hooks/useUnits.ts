import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IUnit, IModelPaginate } from "@/types/backend";
import {
    callFetchUnit,
    callFetchUnitById,
    callCreateUnit,
    callUpdateUnit,
    callDeleteUnit,
} from "@/config/api";
import { notify } from "@/components/common/notification/notify";


export const useUnitsQuery = (query: string) => {
    return useQuery({
        queryKey: ["units", query],
        queryFn: async () => {
            const res = await callFetchUnit(query);
            if (!res?.data) throw new Error("Không thể tải danh sách đơn vị");
            return res.data as IModelPaginate<IUnit>;
        },
    });
};


export const useUnitByIdQuery = (id?: number | string) => {
    return useQuery({
        queryKey: ["unit", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID đơn vị");
            const res = await callFetchUnitById(id);
            if (!res?.data) throw new Error("Không thể tải thông tin đơn vị");
            return res.data as IUnit;
        },
    });
};


export const useCreateUnitMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (unit: IUnit) => {
            const res = await callCreateUnit(unit);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo đơn vị");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo đơn vị thành công");
            queryClient.invalidateQueries({ queryKey: ["units"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo đơn vị");
        },
    });
};


export const useUpdateUnitMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (unit: IUnit) => {
            const res = await callUpdateUnit(unit);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật đơn vị");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật đơn vị thành công");
            queryClient.invalidateQueries({ queryKey: ["units"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật đơn vị");
        },
    });
};


export const useDeleteUnitMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await callDeleteUnit(id);
            if (!res?.statusCode || res.statusCode !== 200)
                throw new Error(res?.message || "Không thể xóa đơn vị");
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa đơn vị thành công");
            queryClient.invalidateQueries({ queryKey: ["units"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa đơn vị");
        },
    });
};
