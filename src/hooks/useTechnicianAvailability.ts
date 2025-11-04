import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    ITechnicianAvailability,
    IReqTechnicianAvailability,
    IModelPaginate,
} from "@/types/backend";
import {
    callFetchTechnicianAvailability,
    callFetchTechnicianAvailabilityById,
    callCreateTechnicianAvailability,
    callUpdateTechnicianAvailability,
    callDeleteTechnicianAvailability,
    callFetchMyTechnicianAvailability,
} from "@/config/api";
import { notify } from "@/components/common/notify";

/** ========================= Lấy danh sách ca làm việc kỹ thuật viên ========================= */
export const useTechnicianAvailabilitiesQuery = (query: string) => {
    return useQuery({
        queryKey: ["technician-availabilities", query],
        queryFn: async () => {
            const res = await callFetchTechnicianAvailability(query);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lấy danh sách ca làm việc");
            return res.data as IModelPaginate<ITechnicianAvailability>;
        },
        staleTime: 1000 * 60 * 2,
        retry: false,
    });
};

/** ========================= Lấy chi tiết ca làm việc theo ID ========================= */
export const useTechnicianAvailabilityByIdQuery = (id?: string) => {
    return useQuery({
        queryKey: ["technician-availability", id],
        enabled: !!id,
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID ca làm việc");
            const res = await callFetchTechnicianAvailabilityById(id);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lấy thông tin ca làm việc");
            return res.data as ITechnicianAvailability;
        },
        retry: false,
    });
};

/** ========================= Tạo mới ca làm việc ========================= */
export const useCreateTechnicianAvailabilityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IReqTechnicianAvailability) => {
            const res = await callCreateTechnicianAvailability(payload);
            if (!res?.data || res.statusCode !== 201) {
                throw new Error(res?.message || "Không thể tạo ca làm việc");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.created("Tạo ca làm việc thành công");
            queryClient.invalidateQueries({ queryKey: ["technician-availabilities"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo ca làm việc");
        },
    });
};

/** ========================= Cập nhật ca làm việc ========================= */
export const useUpdateTechnicianAvailabilityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: IReqTechnicianAvailability }) => {
            const res = await callUpdateTechnicianAvailability(id, data);
            if (!res?.data || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể cập nhật ca làm việc");
            }
            return res.data;
        },
        onSuccess: (_, variables) => {
            notify.updated("Cập nhật ca làm việc thành công");
            queryClient.invalidateQueries({ queryKey: ["technician-availabilities"], exact: false });
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ["technician-availability", variables.id] });
            }
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật ca làm việc");
        },
    });
};

/** ========================= Xóa ca làm việc ========================= */
export const useDeleteTechnicianAvailabilityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await callDeleteTechnicianAvailability(id);
            if (!res?.statusCode || res.statusCode !== 200) {
                throw new Error(res?.message || "Không thể xóa ca làm việc");
            }
            return res.data;
        },
        onSuccess: () => {
            notify.deleted("Xóa ca làm việc thành công");
            queryClient.invalidateQueries({ queryKey: ["technician-availabilities"], exact: false });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa ca làm việc");
        },
    });
};

/** ========================= Lấy danh sách ca của kỹ thuật viên đang đăng nhập ========================= */
export const useMyTechnicianAvailabilitiesQuery = (query: string) => {
    return useQuery({
        queryKey: ["my-technician-availabilities", query],
        queryFn: async () => {
            const res = await callFetchMyTechnicianAvailability(query);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lấy danh sách ca của bạn");
            return res.data as IModelPaginate<ITechnicianAvailability>;
        },
        staleTime: 1000 * 60 * 2,
        retry: false,
    });
};
/** ========================= Lấy ca làm việc theo kỹ thuật viên ========================= */
export const useTechnicianAvailabilityByTechnicianIdQuery = ({
    technicianId,
    page = 1,
    pageSize = 5,
}: {
    technicianId?: string;
    page?: number;
    pageSize?: number;
}) => {
    return useQuery({
        queryKey: ["technician-availability-by-tech", technicianId, page, pageSize],
        enabled: !!technicianId,
        queryFn: async () => {
            const query = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
                filter: `technician.id='${technicianId}'`,
            }).toString();

            const res = await callFetchTechnicianAvailability(query);
            if (!res?.data)
                throw new Error(res?.message || "Không thể lấy lịch làm việc của kỹ thuật viên");
            return res.data as IModelPaginate<ITechnicianAvailability>;
        },
        staleTime: 1000 * 60, // 1 phút cache riêng từng kỹ thuật viên
        retry: false,
    });
};
