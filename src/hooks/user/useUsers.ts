import {
    callFetchUser,
    callFetchUserById,
    callCreateUser,
    callUpdateUser,
} from "@/config/api";
import type { IUser, IModelPaginate } from "@/types/backend";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/common/notification/notify";

/** ========================= Lấy danh sách người dùng ========================= */
export const useUsersQuery = (query: string) => {
    return useQuery({
        queryKey: ["users", query],
        queryFn: async () => {
            const res = await callFetchUser(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách người dùng");
            return res.data as IModelPaginate<IUser>;
        },
    });
};

/** ========================= Lấy chi tiết người dùng ========================= */
export const useUserByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["user", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID người dùng");
            const res = await callFetchUserById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin người dùng");
            return res.data as IUser;
        },
    });
};

export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: IUser) => {
            const res = await callCreateUser(user);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo người dùng");
            return res.data;
        },
        onSuccess: (data) => {
            notify.created("Tạo người dùng thành công");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo người dùng");
        },
    });
};

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: IUser) => {
            const res = await callUpdateUser(user);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật người dùng");
            return res.data;
        },
        onSuccess: (updatedData, variables) => {
            notify.updated("Cập nhật người dùng thành công");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
                queryClient.setQueryData(["user", variables.id], updatedData);
            }

            // Refetch entity phụ
            const type = (variables as IUser)?.accountTypeDisplay;
            if (type === "EMPLOYEE") queryClient.invalidateQueries({ queryKey: ["employees"] });
            if (type === "TECHNICIAN") queryClient.invalidateQueries({ queryKey: ["technicians"] });
            if (type === "CUSTOMER") queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật người dùng");
        },
    });
};

