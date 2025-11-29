import {
    callFetchDepartment,
    callFetchDepartmentById,
    callCreateDepartment,
    callUpdateDepartment,
    callDeleteDepartment,
} from "@/config/api";
import type { IDepartment, IModelPaginate } from "@/types/backend";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/common/notification/notify";

// Lấy danh sách phòng ban
export const useDepartmentsQuery = (query: string) => {
    return useQuery({
        queryKey: ["departments", query],
        queryFn: async () => {
            const res = await callFetchDepartment(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách phòng ban");
            return res.data as IModelPaginate<IDepartment>;
        },
    });
};

// Lấy chi tiết phòng ban theo ID
export const useDepartmentByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["department", id],
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID phòng ban");
            const res = await callFetchDepartmentById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin phòng ban");
            return res.data as IDepartment;
        },
        enabled: !!id,
    });
};

// Tạo mới phòng ban
export const useCreateDepartmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dept: IDepartment) => {
            const res = await callCreateDepartment(dept);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo phòng ban");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo phòng ban thành công");
            queryClient.invalidateQueries({ queryKey: ["departments"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo phòng ban");
        },
    });
};

// Cập nhật phòng ban
export const useUpdateDepartmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dept: IDepartment) => {
            const res = await callUpdateDepartment(dept);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật phòng ban");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật phòng ban thành công");
            queryClient.invalidateQueries({ queryKey: ["departments"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật phòng ban");
        },
    });
};

// Xóa phòng ban
export const useDeleteDepartmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await callDeleteDepartment(id);
            if (res?.statusCode !== 200 && res?.statusCode !== "200")
                throw new Error(res?.message || "Không thể xóa phòng ban");
            return res;
        },
        onSuccess: (res) => {
            notify.deleted(res?.message || "Xóa phòng ban thành công");
            queryClient.invalidateQueries({ queryKey: ["departments"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa phòng ban");
        },
    });
};
