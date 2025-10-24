import {
    callFetchCompany,
    callFetchCompanyById,
    callCreateCompany,
    callUpdateCompany,
    callDeleteCompany,
} from "@/config/api";
import type { ICompany, IModelPaginate } from "@/types/backend";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/common/notify";

// Lấy danh sách công ty
export const useCompaniesQuery = (query: string) => {
    return useQuery({
        queryKey: ["companies", query],
        queryFn: async () => {
            const res = await callFetchCompany(query);
            if (!res?.data) throw new Error("Không thể lấy danh sách công ty");
            return res.data as IModelPaginate<ICompany>;
        },
    });
};

// Lấy chi tiết công ty theo ID
export const useCompanyByIdQuery = (id?: string | number) => {
    return useQuery({
        queryKey: ["company", id],
        queryFn: async () => {
            if (!id) throw new Error("Thiếu ID công ty");
            const res = await callFetchCompanyById(id);
            if (!res?.data) throw new Error("Không thể lấy thông tin công ty");
            return res.data as ICompany;
        },
        enabled: !!id,
    });
};

// Tạo mới công ty
export const useCreateCompanyMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (company: ICompany) => {
            const res = await callCreateCompany(company);
            if (!res?.data) throw new Error(res?.message || "Không thể tạo công ty");
            return res;
        },
        onSuccess: (res) => {
            notify.created(res?.message || "Tạo công ty thành công");
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi tạo công ty");
        },
    });
};

// Cập nhật công ty
export const useUpdateCompanyMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (company: ICompany) => {
            const res = await callUpdateCompany(company);
            if (!res?.data)
                throw new Error(res?.message || "Không thể cập nhật công ty");
            return res;
        },
        onSuccess: (res) => {
            notify.updated(res?.message || "Cập nhật công ty thành công");
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi cập nhật công ty");
        },
    });
};

// Xóa công ty
export const useDeleteCompanyMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await callDeleteCompany(id);
            if (res?.statusCode !== 200 && res?.statusCode !== "200")
                throw new Error(res?.message || "Không thể xóa công ty");
            return res;
        },
        onSuccess: (res) => {
            notify.deleted(res?.message || "Xóa công ty thành công");
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
        onError: (error: any) => {
            notify.error(error.message || "Lỗi khi xóa công ty");
        },
    });
};
