import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchCustomer,
    callFetchCustomerById,
    callCreateCustomer,
    callUpdateCustomer,
    callDeleteCustomer,
} from "@/config/api";
import type { ICustomer, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách khách hàng ========================= */
export const useCustomersQuery = (query: string) => {
    return useQuery({
        queryKey: ["customers", query],
        queryFn: async () => {
            const res = await callFetchCustomer(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách khách hàng");
            return res.data as IModelPaginate<ICustomer>;
        },
    });
};

/** ========================= Lấy chi tiết khách hàng theo ID ========================= */
export const useCustomerByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["customer", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID khách hàng");
            const res = await callFetchCustomerById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin khách hàng");
            return res.data as ICustomer;
        },
    });
};

/** ========================= Tạo mới khách hàng ========================= */
export const useCreateCustomerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await callCreateCustomer(payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể tạo khách hàng");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo khách hàng thành công");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo khách hàng");
        },
    });
};

/** ========================= Cập nhật khách hàng ========================= */
export const useUpdateCustomerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await callUpdateCustomer(payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật khách hàng");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật khách hàng thành công");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật khách hàng");
        },
    });
};

/** ========================= Xóa khách hàng ========================= */
export const useDeleteCustomerMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeleteCustomer(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa khách hàng");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa khách hàng thành công");
            queryClient.invalidateQueries({ queryKey: ["customers"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa khách hàng");
        },
    });
};
