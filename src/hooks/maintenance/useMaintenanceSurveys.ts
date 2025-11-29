import {
    callCreateMaintenanceSurvey,
    callFetchMaintenanceSurveyById,
    callFetchMaintenanceSurveysInProgress,
} from "@/config/api";
import type {
    IModelPaginate,
    IReqMaintenanceSurveyDTO,
    IResMaintenanceSurveyDTO,
    IResMaintenanceSurveyListDTO,
} from "@/types/backend";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/common/notification/notify";

/** ========================= Danh sách phiếu đang xử lý để khảo sát ========================= */
export const useMaintenanceSurveysInProgressQuery = (query: string) => {
    return useQuery({
        queryKey: ["maintenance-surveys-in-progress", query],
        queryFn: async () => {
            const res = await callFetchMaintenanceSurveysInProgress(query);
            if (!res?.data)
                throw new Error("Không thể lấy danh sách phiếu khảo sát đang xử lý");
            return res.data as IModelPaginate<IResMaintenanceSurveyListDTO>;
        },
    });
};

/** ========================= Lấy chi tiết khảo sát theo ID ========================= */
export const useMaintenanceSurveyByIdQuery = (id?: string) => {
    return useQuery({
        queryKey: ["maintenance-survey", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID khảo sát");
            const res = await callFetchMaintenanceSurveyById(id);
            if (!res?.data)
                throw new Error("Không thể lấy thông tin khảo sát theo ID");
            return res.data as IResMaintenanceSurveyListDTO;
        },
    });
};

/** ========================= Tạo khảo sát mới ========================= */
export const useCreateMaintenanceSurveyMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IReqMaintenanceSurveyDTO) => {
            const res = await callCreateMaintenanceSurvey(payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể tạo khảo sát bảo trì");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo khảo sát bảo trì thành công");
            queryClient.invalidateQueries({
                queryKey: ["maintenance-surveys-in-progress"],
            });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo khảo sát bảo trì");
        },
    });
};
