import { useQuery } from "@tanstack/react-query";

import {
    callFetchMaintenanceRequestReport,
    callFetchDeviceHistoryReport,
    callFetchMaterialUsageReport,
    callFetchTechnicianActivityReport,
    callFetchDeviceDepreciationReport,
    callFetchWarrantyProductReport,
} from "@/config/api";

import type {
    IRequestMaintenanceFilter,
    IDeviceHistoryFilter,
    IMaterialUsageFilter,
    ITechnicianActivityFilter,
    IDeviceDepreciationFilter,
    IWarrantyProductFilter,

    IMaintenanceRequestReport,
    IDeviceMaintenanceHistory,
    IMaterialUsageReport,
    ITechnicianActivityReport,
    IDeviceDepreciationReport,
    IWarrantyProductReport,
    IModelPaginate,
} from "@/types/backend";

/* ============================================================
 * 1) Báo cáo YÊU CẦU BẢO TRÌ
 * ============================================================ */
export const useMaintenanceRequestReportQuery = (
    filter: IRequestMaintenanceFilter,
    query: string
) => {
    return useQuery({
        queryKey: ["maintenance-request-report", filter, query],
        queryFn: async () => {
            const res = await callFetchMaintenanceRequestReport(filter, query);
            if (!res?.data)
                throw new Error("Không thể lấy báo cáo yêu cầu bảo trì");
            return res.data as IModelPaginate<IMaintenanceRequestReport>;
        },
    });
};

/* ============================================================
 * 2) Báo cáo LỊCH SỬ BẢO TRÌ
 * ============================================================ */
export const useDeviceHistoryReportQuery = (
    filter: IDeviceHistoryFilter,
    query: string
) => {
    return useQuery({
        queryKey: ["device-history-report", filter, query],
        queryFn: async () => {
            const res = await callFetchDeviceHistoryReport(filter, query);
            if (!res?.data)
                throw new Error("Không thể lấy báo cáo lịch sử bảo trì thiết bị");
            return res.data as IModelPaginate<IDeviceMaintenanceHistory>;
        },
    });
};

/* ============================================================
 * 3) Báo cáo VẬT TƯ
 * ============================================================ */
export const useMaterialUsageReportQuery = (
    filter: IMaterialUsageFilter,
    query: string
) => {
    return useQuery({
        queryKey: ["material-usage-report", filter, query],
        queryFn: async () => {
            const res = await callFetchMaterialUsageReport(filter, query);
            if (!res?.data) throw new Error("Không thể lấy báo cáo vật tư");
            return res.data as IModelPaginate<IMaterialUsageReport>;
        },
    });
};

/* ============================================================
 * 4) Báo cáo HOẠT ĐỘNG KỸ THUẬT VIÊN
 * ============================================================ */
export const useTechnicianActivityReportQuery = (
    filter: ITechnicianActivityFilter,
    query: string
) => {
    return useQuery({
        queryKey: ["technician-activity-report", filter, query],
        queryFn: async () => {
            const res = await callFetchTechnicianActivityReport(filter, query);
            if (!res?.data)
                throw new Error("Không thể lấy báo cáo hoạt động kỹ thuật viên");
            return res.data as IModelPaginate<ITechnicianActivityReport>;
        },
    });
};

/* ============================================================
 * 5) Báo cáo KHẤU HAO THIẾT BỊ
 * ============================================================ */
export const useDeviceDepreciationReportQuery = (
    filter: IDeviceDepreciationFilter,
    query: string
) => {
    return useQuery({
        queryKey: ["device-depreciation-report", filter, query],
        queryFn: async () => {
            const res = await callFetchDeviceDepreciationReport(filter, query);
            if (!res?.data) throw new Error("Không thể lấy báo cáo khấu hao thiết bị");
            return res.data as IModelPaginate<IDeviceDepreciationReport>;
        },
    });
};


/* ============================================================
 * 7) Báo cáo BẢO HÀNH SẢN PHẨM
 * ============================================================ */
export const useWarrantyProductReportQuery = (
    filter: IWarrantyProductFilter,
    query: string
) => {
    return useQuery({
        queryKey: ["warranty-product-report", filter, query],
        queryFn: async () => {
            const res = await callFetchWarrantyProductReport(filter, query);
            if (!res?.data)
                throw new Error("Không thể lấy báo cáo bảo hành sản phẩm");
            return res.data as IModelPaginate<IWarrantyProductReport>;
        },
    });
};
