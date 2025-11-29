import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ISkill, IModelPaginate } from "@/types/backend";
import {
    callFetchSkill,
    callFetchSkillById,
    callCreateSkill,
    callUpdateSkill,
    callDeleteSkill,
} from "@/config/api";
import { notify } from "@/components/common/notification/notify";

/** ========================= Lấy danh sách kỹ năng ========================= */
export const useSkillsQuery = (query: string) => {
    return useQuery({
        queryKey: ["skills", query],
        queryFn: async () => {
            const res = await callFetchSkill(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách kỹ năng");
            return res.data as IModelPaginate<ISkill>;
        },
    });
};

/** ========================= Lấy chi tiết kỹ năng theo ID ========================= */
export const useSkillByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["skill", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID kỹ năng");
            const res = await callFetchSkillById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin kỹ năng");
            return res.data as ISkill;
        },
    });
};

/** ========================= Tạo mới kỹ năng ========================= */
export const useCreateSkillMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (skill: ISkill) => {
            const res = await callCreateSkill(skill);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo kỹ năng");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo kỹ năng thành công");
            queryClient.invalidateQueries({ queryKey: ["skills"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo kỹ năng");
        },
    });
};

/** ========================= Cập nhật kỹ năng ========================= */
export const useUpdateSkillMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (skill: ISkill) => {
            const res = await callUpdateSkill(skill);
            if (!res?.data) throw new Error(res?.message || "Không thể cập nhật kỹ năng");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật kỹ năng thành công");
            queryClient.invalidateQueries({ queryKey: ["skills"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật kỹ năng");
        },
    });
};

/** ========================= Xóa kỹ năng ========================= */
export const useDeleteSkillMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await callDeleteSkill(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa kỹ năng");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa kỹ năng thành công");
            queryClient.invalidateQueries({ queryKey: ["skills"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa kỹ năng");
        },
    });
};
