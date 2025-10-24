import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchEmployee,
    callFetchEmployeeById,
    callCreateEmployee,
    callUpdateEmployee,
    callDeleteEmployee,
} from "@/config/api";
import type { IEmployee, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách nhân viên ========================= */
export const useEmployeesQuery = (query: string) => {
    return useQuery({
        queryKey: ["employees", query],
        queryFn: async () => {
            const res = await callFetchEmployee(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách nhân viên");
            return res.data as IModelPaginate<IEmployee>;
        },
    });
};

/** ========================= Lấy chi tiết nhân viên theo ID ========================= */
export const useEmployeeByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["employee", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID nhân viên");
            const res = await callFetchEmployeeById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin nhân viên");
            return res.data as IEmployee;
        },
    });
};

/** ========================= Tạo mới nhân viên ========================= */
export const useCreateEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await callCreateEmployee(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo nhân viên");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo nhân viên thành công");
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo nhân viên");
        },
    });
};

/** ========================= Cập nhật nhân viên ========================= */
export const useUpdateEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string | number;
            payload: any;
        }) => {
            const res = await callUpdateEmployee(id, payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật nhân viên");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật nhân viên thành công");
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật nhân viên");
        },
    });
};

/** ========================= Xóa nhân viên ========================= */
export const useDeleteEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeleteEmployee(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa nhân viên");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa nhân viên thành công");
            queryClient.invalidateQueries({ queryKey: ["employees"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa nhân viên");
        },
    });
};
