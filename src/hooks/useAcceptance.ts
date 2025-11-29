import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    callFetchAcceptancePending,
    callFetchAcceptancePaginate,
    callFetchAcceptanceDetail,
    callApproveAcceptance,
    callFetchAcceptanceRejected,
    callRejectAcceptance,
} from "@/config/api";
import type {
    IReqAcceptanceApproveDTO,
    IReqAcceptanceRejectDTO,
    IResAcceptanceCardDTO,
    IResAcceptanceDetailDTO,
    IResAcceptanceDTO,
    IModelPaginate
} from "@/types/backend";
import { notify } from "@/components/common/notification/notify";


export const useAcceptancePendingQuery = (query: string) => {
    return useQuery({
        queryKey: ["acceptance-pending", query],
        queryFn: async () => {
            const res = await callFetchAcceptancePending(query);
            if (!res?.data) throw new Error("Không thể tải danh sách chờ nghiệm thu");
            return res.data as IModelPaginate<IResAcceptanceCardDTO>;
        },
    });
};


export const useAcceptancePaginateQuery = (query: string) => {
    return useQuery({
        queryKey: ["acceptance-completed", query],
        queryFn: async () => {
            const res = await callFetchAcceptancePaginate(query);
            if (!res?.data) throw new Error("Không thể tải danh sách nghiệm thu");
            return res.data as IModelPaginate<IResAcceptanceCardDTO>;
        },
    });
};

export const useAcceptanceRejectedQuery = (query: string) => {
    return useQuery({
        queryKey: ["acceptance-rejected", query],
        queryFn: async () => {
            const res = await callFetchAcceptanceRejected(query);
            if (!res?.data) throw new Error("Không thể tải danh sách bị từ chối nghiệm thu");
            return res.data as IModelPaginate<IResAcceptanceCardDTO>;
        },
    });
};
export const useAcceptanceDetailQuery = (requestId?: string) => {
    return useQuery({
        queryKey: ["acceptance-detail", requestId],
        enabled: !!requestId,
        queryFn: async () => {
            const res = await callFetchAcceptanceDetail(requestId as string);
            if (!res?.data) throw new Error("Không thể tải chi tiết nghiệm thu");
            return res.data as IResAcceptanceDetailDTO;
        },
    });
};


export const useApproveAcceptanceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            requestId,
            payload,
        }: {
            requestId: string;
            payload: IReqAcceptanceApproveDTO;
        }) => {
            const res = await callApproveAcceptance(requestId, payload);
            if (!res?.data) throw new Error("Không thể nghiệm thu");
            return res.data as IResAcceptanceDTO;
        },
        onSuccess: (data) => {
            notify.success("Nghiệm thu thành công");
            queryClient.invalidateQueries({ queryKey: ["acceptance-pending"] });
            queryClient.invalidateQueries({ queryKey: ["acceptance-completed"] });
            queryClient.invalidateQueries({ queryKey: ["acceptance-detail"] });
        },
        onError: (error: any) => {
            notify.error(error?.message || "Lỗi nghiệm thu");
        },
    });
};


export const useRejectAcceptanceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            requestId,
            payload,
        }: {
            requestId: string;
            payload: IReqAcceptanceRejectDTO;
        }) => {
            const res = await callRejectAcceptance(requestId, payload);
            if (!res?.data) throw new Error("Không thể từ chối nghiệm thu");
            return res.data as IResAcceptanceDTO;
        },
        onSuccess: () => {
            notify.success("Từ chối nghiệm thu thành công");
            queryClient.invalidateQueries({ queryKey: ["acceptance-pending"] });
            queryClient.invalidateQueries({ queryKey: ["acceptance-completed"] });
            queryClient.invalidateQueries({ queryKey: ["acceptance-detail"] });
        },
        onError: (error: any) => {
            notify.error(error?.message || "Lỗi từ chối nghiệm thu");
        },
    });
};
