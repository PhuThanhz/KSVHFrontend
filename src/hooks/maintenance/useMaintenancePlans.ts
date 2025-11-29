import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchSurveyedMaintenanceRequests,
    callFetchSurveyedMaintenanceDetail,
    callCreateMaintenancePlan,
    callReplanMaintenance
} from "@/config/api";
import type {
    IModelPaginate,
    IResMaintenanceSurveyedListDTO,
    IResMaintenanceSurveyedDetailDTO,
    IReqMaintenancePlanDTO,
    IResMaintenancePlanCreateDTO,
} from "@/types/backend";
import { notify } from "@/components/common/notification/notify";

/** ========================= Lấy danh sách phiếu đã khảo sát ========================= */
export const useSurveyedRequestsQuery = (query: string) => {
    return useQuery({
        queryKey: ["surveyed-maintenance-requests", query],
        queryFn: async () => {
            const res = await callFetchSurveyedMaintenanceRequests(query);
            if (!res?.data)
                throw new Error("Không thể lấy danh sách phiếu đã khảo sát");
            return res.data as IModelPaginate<IResMaintenanceSurveyedListDTO>;
        },
    });
};

/** ========================= Lấy chi tiết phiếu khảo sát ========================= */
export const useSurveyedRequestDetailQuery = (id?: string) => {
    return useQuery({
        queryKey: ["surveyed-maintenance-request-detail", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID phiếu khảo sát");
            const res = await callFetchSurveyedMaintenanceDetail(id);
            if (!res?.data)
                throw new Error("Không thể lấy chi tiết phiếu khảo sát");
            return res.data as IResMaintenanceSurveyedDetailDTO;
        },
    });
};

/** ========================= Tạo kế hoạch bảo trì ========================= */
export const useCreateMaintenancePlanMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: IReqMaintenancePlanDTO) => {
            const res = await callCreateMaintenancePlan(payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lập kế hoạch bảo trì");
            return res.data as IResMaintenancePlanCreateDTO;
        },
        onSuccess: (res) => {
            notify.created(res?.maintenanceRequestCode
                ? `Đã lập kế hoạch cho phiếu ${res.maintenanceRequestCode}`
                : "Lập kế hoạch bảo trì thành công");
            queryClient.invalidateQueries({
                queryKey: ["surveyed-maintenance-requests"],
            });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi lập kế hoạch bảo trì");
        },
    });
};
/** ========================= Lập lại kế hoạch bảo trì (khi bị từ chối) ========================= */
export const useReplanMaintenanceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { planId: string; payload: IReqMaintenancePlanDTO }) => {
            const { planId, payload } = params;
            const res = await callReplanMaintenance(planId, payload);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lập lại kế hoạch bảo trì");
            return res.data as IResMaintenancePlanCreateDTO;
        },
        onSuccess: (res) => {
            notify.updated(
                res?.maintenanceRequestCode
                    ? `Đã lập lại kế hoạch cho phiếu ${res.maintenanceRequestCode}`
                    : "Lập lại kế hoạch bảo trì thành công"
            );
            queryClient.invalidateQueries({
                queryKey: ["surveyed-maintenance-requests"],
            });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi lập lại kế hoạch bảo trì");
        },
    });
};
