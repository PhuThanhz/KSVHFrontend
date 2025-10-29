import {
    callFetchUser,
    callFetchUserById,
    callCreateUser,
    callUpdateUser,
} from '@/config/api';
import type { IUser, IModelPaginate } from '@/types/backend';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/components/common/notify';


export const useUsersQuery = (query: string) => {
    return useQuery({
        queryKey: ['users', query],
        queryFn: async () => {
            const res = await callFetchUser(query);
            if (!res?.data) throw new Error('Không thể lấy danh sách người dùng');
            return res.data as IModelPaginate<IUser>;
        },
    });
};
export const useUserByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            if (!id) throw new Error('Thiếu ID người dùng');
            const res = await callFetchUserById(id);
            if (!res?.data) throw new Error('Không thể lấy thông tin người dùng');
            return res.data as IUser;
        },
        enabled: !!id,
    });
};


// Tạo mới người dùng
export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: IUser) => {
            const res = await callCreateUser(user);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo user");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo người dùng thành công");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo người dùng");
        },
    });
};

// Cập Nhật Người Dùng
export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (user: IUser) => {
            const res = await callUpdateUser(user);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật người dùng");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật người dùng thành công");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            notify.error(
                error.message || error?.message || "Lỗi khi cập nhật người dùng"
            );
        },
    });
};
