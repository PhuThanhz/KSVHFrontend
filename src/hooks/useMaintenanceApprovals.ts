import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchMaintenanceApprovals,
    callFetchMaintenancePlanDetail,
    callFetchMaintenancePlanMaterials,
    callApproveMaintenancePlan,
    callRejectMaintenancePlan,
} from "@/config/api";
import type {
    IModelPaginate,
    IResMaintenancePlanSimpleDTO,
    IResMaintenancePlanDetailDTO,
    IResMaintenancePlanMaterialGroupDTO,
    IResMaintenancePlanApprovalDTO,
    IReqRejectPlanDTO,
} from "@/types/backend";
import { notify } from "@/components/common/notify";

/** ============================
 *  Lấy danh sách kế hoạch chờ phê duyệt
 *  ============================ */
export const useMaintenanceApprovalsQuery = (query: string) => {
    return useQuery({
        queryKey: ["maintenance-approvals", query],
        queryFn: async () => {
            const res = await callFetchMaintenanceApprovals(query);
            if (!res?.data)
                throw new Error("Không thể lấy danh sách kế hoạch bảo trì");
            return res.data as IModelPaginate<IResMaintenancePlanSimpleDTO>;
        },
    });
};

/** ============================
 *  Lấy chi tiết kế hoạch bảo trì
 *  ============================ */
export const useMaintenancePlanDetailQuery = (planId?: string) => {
    return useQuery({
        queryKey: ["maintenance-plan-detail", planId],
        enabled: !!planId,
        queryFn: async () => {
            if (!planId) throw new Error("Thiếu ID kế hoạch bảo trì");
            const res = await callFetchMaintenancePlanDetail(planId);
            if (!res?.data)
                throw new Error("Không thể lấy chi tiết kế hoạch bảo trì");
            return res.data as IResMaintenancePlanDetailDTO;
        },
    });
};

/** ============================
 *  Lấy danh sách vật tư trong kế hoạch
 *  ============================ */
export const useMaintenancePlanMaterialsQuery = (planId?: string) => {
    return useQuery({
        queryKey: ["maintenance-plan-materials", planId],
        enabled: !!planId,
        queryFn: async () => {
            if (!planId) throw new Error("Thiếu ID kế hoạch bảo trì");
            const res = await callFetchMaintenancePlanMaterials(planId);
            if (!res?.data)
                throw new Error("Không thể lấy danh sách vật tư của kế hoạch");
            return res.data as IResMaintenancePlanMaterialGroupDTO;
        },
    });
};

/** ============================
 *  Duyệt kế hoạch bảo trì
 *  ============================ */
export const useApprovePlanMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (planId: string) => {
            const res = await callApproveMaintenancePlan(planId);
            if (!res?.data)
                throw new Error(res?.message || "Không thể duyệt kế hoạch");
            return res.data as IResMaintenancePlanApprovalDTO;
        },
        onSuccess: (res) => {
            notify.success(res?.message || "Duyệt kế hoạch thành công");
            queryClient.invalidateQueries({ queryKey: ["maintenance-approvals"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi duyệt kế hoạch");
        },
    });
};

/** ============================
 *  Từ chối kế hoạch bảo trì
 *  ============================ */
export const useRejectPlanMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            planId,
            data,
        }: {
            planId: string;
            data: IReqRejectPlanDTO;
        }) => {
            const res = await callRejectMaintenancePlan(planId, data);
            if (!res?.data)
                throw new Error(res?.message || "Không thể từ chối kế hoạch");
            return res.data as IResMaintenancePlanApprovalDTO;
        },
        onSuccess: (res) => {
            notify.warning(res?.message || "Đã từ chối kế hoạch bảo trì");
            queryClient.invalidateQueries({ queryKey: ["maintenance-approvals"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi từ chối kế hoạch");
        },
    });
};
