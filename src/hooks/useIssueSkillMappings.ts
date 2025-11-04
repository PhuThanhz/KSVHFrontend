import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchIssueSkillMappings,

    callCreateIssueSkillMapping,
    callUpdateIssueSkillMapping,
    callDeleteIssueSkillMapping,
} from "@/config/api";
import type {
    IModelPaginate,
    IIssueSkillMappingRequest,
    IIssueSkillMappingResponse,
} from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách IssueSkillMapping ========================= */
export const useIssueSkillMappingsQuery = (query: string) => {
    return useQuery({
        queryKey: ["issue-skill-mappings", query],
        queryFn: async () => {
            const res = await callFetchIssueSkillMappings(query);
            if (!res?.data)
                throw new Error("Không thể lấy danh sách cấu hình kỹ năng cho sự cố");
            return res.data as IModelPaginate<IIssueSkillMappingResponse>;
        },
    });
};


/** ========================= Tạo mới IssueSkillMapping ========================= */
export const useCreateIssueSkillMappingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IIssueSkillMappingRequest) => {
            const res = await callCreateIssueSkillMapping(payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể tạo cấu hình kỹ năng");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo cấu hình kỹ năng thành công");
            queryClient.invalidateQueries({
                queryKey: ["issue-skill-mappings"],
            });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo cấu hình kỹ năng");
        },
    });
};

/** ========================= Cập nhật IssueSkillMapping ========================= */
export const useUpdateIssueSkillMappingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IIssueSkillMappingResponse) => {
            const res = await callUpdateIssueSkillMapping(payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật cấu hình kỹ năng");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật cấu hình kỹ năng thành công");
            queryClient.invalidateQueries({
                queryKey: ["issue-skill-mappings"],
            });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật cấu hình kỹ năng");
        },
    });
};

/** ========================= Xóa IssueSkillMapping ========================= */
export const useDeleteIssueSkillMappingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const res = await callDeleteIssueSkillMapping(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa cấu hình kỹ năng");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa cấu hình kỹ năng thành công");
            queryClient.invalidateQueries({
                queryKey: ["issue-skill-mappings"],
                exact: false,
            });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa cấu hình kỹ năng");
        },
    });
};
