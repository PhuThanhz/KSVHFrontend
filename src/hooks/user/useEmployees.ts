import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchEmployee,
    callFetchEmployeeById,
    callCreateEmployee,
    callUpdateEmployee,
} from "@/config/api";
import type { IEmployee, IModelPaginate } from "@/types/backend";
import { notify } from "@/components/common/notification/notify";

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
export const useCreateEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await callCreateEmployee(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo nhân viên");
            return res.data;
        },
        onSuccess: () => {
            notify.created("Tạo nhân viên thành công");
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo nhân viên");
        },
    });
};

export const useUpdateEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await callUpdateEmployee(payload);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật nhân viên");
            return res.data;
        },
        onSuccess: (data, variables) => {
            notify.updated("Cập nhật nhân viên thành công");
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            if (variables?.id) {
                queryClient.setQueryData(["employee", variables.id], data);
            }
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật nhân viên");
        },
    });
};
