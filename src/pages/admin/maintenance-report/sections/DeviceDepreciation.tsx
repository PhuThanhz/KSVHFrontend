import { useState, useMemo } from "react";
import type { ProColumns } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import dayjs from "dayjs";

import DeviceDepreciationFilter from "../filters/DeviceDepreciationFilter";
import ExportButton from "@/components/admin/maintenance-report/ExportButton";
import DataTable from "@/components/admin/data-table";

import { useDeviceDepreciationReportQuery } from "@/hooks/useMaintenanceReports";
import { callExportDeviceDepreciationReport } from "@/config/api";

import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import { notify } from "@/components/common/notify";
import queryString from "query-string";

import type {
    IDeviceDepreciationFilter,
    IDeviceDepreciationReport,
} from "@/types/backend";

const { Text } = Typography;

const DeviceDepreciationSection = () => {
    const [filter, setFilter] = useState<IDeviceDepreciationFilter>({});
    const [query, setQuery] = useState("page=0&size=10&sort=startDate,desc");
    const [exportLoading, setExportLoading] = useState(false);

    const { data, isFetching } = useDeviceDepreciationReportQuery(filter, query);

    const meta = data?.meta ?? { page: 1, pageSize: 10, total: 0 };
    const items = data?.result ?? [];

    /* ==========================
     * BUILD TABLE QUERY
     * ========================== */
    const buildQuery = (params: any, sorter: any) => {
        const q: any = {
            page: (params.current || 1) - 1,
            size: params.pageSize || 10,
        };

        const field = Object.keys(sorter || {})[0];
        if (field) {
            q.sort = `${field},${sorter[field] === "ascend" ? "asc" : "desc"}`;
        } else {
            q.sort = "startDate,desc";
        }

        return queryString.stringify(q);
    };

    /* ==========================
     * BUILD EXPORT QUERY
     * ========================== */
    const buildExportQuery = (f: IDeviceDepreciationFilter) => {
        const q: any = {};
        if (f.companyId) q.companyId = f.companyId;
        if (f.departmentId) q.departmentId = f.departmentId;
        if (f.deviceTypeId) q.deviceTypeId = f.deviceTypeId;
        if (f.status) q.status = f.status;
        if (f.startDate) q.startDate = f.startDate;
        if (f.endDate) q.endDate = f.endDate;

        return queryString.stringify(q);
    };

    /* ==========================
     * EXPORT EXCEL
     * ========================== */
    const handleExport = async () => {
        try {
            setExportLoading(true);
            const qs = buildExportQuery(filter);

            const res = await callExportDeviceDepreciationReport(qs); // must be arraybuffer

            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `bao_cao_khau_hao_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            notify.error("Xuất báo cáo thất bại");
        } finally {
            setExportLoading(false);
        }
    };

    /* ==========================
     * TABLE COLUMNS
     * ========================== */
    const columns: ProColumns<IDeviceDepreciationReport>[] = useMemo(
        () => [
            { title: "Mã thiết bị", dataIndex: "deviceCode", width: 130 },
            { title: "Tên thiết bị", dataIndex: "deviceName", width: 180 },
            { title: "Công ty", dataIndex: "companyName", width: 180 },
            { title: "Phòng ban", dataIndex: "departmentName", width: 160 },
            { title: "Loại tài sản", dataIndex: "assetType", width: 140 },
            { title: "Loại thiết bị", dataIndex: "deviceTypeName", width: 160 },

            {
                title: "Giá gốc (₫)",
                dataIndex: "unitPrice",
                width: 150,
                render: (_, r) => r.unitPrice?.toLocaleString("vi-VN"),
            },

            { title: "Ngày bắt đầu", dataIndex: "startDate", width: 140 },
            { title: "Thời gian KH", dataIndex: "depreciationPeriod", width: 120 },
            { title: "Ngày hết KH", dataIndex: "depreciationEndDate", width: 140 },

            {
                title: "KH/tháng (₫)",
                dataIndex: "monthlyDepreciation",
                width: 140,
                render: (_, r) =>
                    r.monthlyDepreciation?.toLocaleString("vi-VN") ?? "-",
            },
            {
                title: "Đã khấu hao (₫)",
                dataIndex: "depreciationToDate",
                width: 150,
                render: (_, r) =>
                    r.depreciationToDate?.toLocaleString("vi-VN") ?? "-",
            },
            {
                title: "Giá trị còn lại (₫)",
                dataIndex: "remainingValue",
                width: 150,
                render: (_, r) =>
                    r.remainingValue?.toLocaleString("vi-VN") ?? "-",
            },

            { title: "Người quản lý", dataIndex: "managerName", width: 150 },
            { title: "Trạng thái", dataIndex: "status", width: 140 },
        ],
        []
    );

    return (
        <div>
            <DeviceDepreciationFilter value={filter} onChange={setFilter} />

            <Space
                style={{
                    marginBottom: 10,
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Text strong>Báo cáo khấu hao thiết bị</Text>

                <Access
                    permission={ALL_PERMISSIONS.REPORT_EXPORT.DEVICE_DEPRECIATION}
                    hideChildren
                >
                    <ExportButton onExport={handleExport} loading={exportLoading} />
                </Access>
            </Space>

            <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.DEVICE_DEPRECIATION}>
                <DataTable<IDeviceDepreciationReport>
                    rowKey="deviceCode"
                    loading={isFetching}
                    columns={columns}
                    dataSource={items}
                    scroll={{ x: 1200 }}
                    pagination={{
                        current: meta.page,
                        pageSize: meta.pageSize,
                        total: meta.total,
                        showSizeChanger: true,
                    }}
                    request={async (params, sorter) => {
                        const q = buildQuery(params, sorter);
                        setQuery(q);

                        return {
                            data: items,
                            success: true,
                            total: meta.total,
                        };
                    }}
                />
            </Access>
        </div>
    );
};

export default DeviceDepreciationSection;
