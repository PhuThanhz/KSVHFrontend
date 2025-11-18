// src/pages/admin/maintenance-report/sections/DeviceHistory.tsx

import { useState, useMemo } from "react";
import { Card, Table, Space, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import DeviceHistoryFilter from "../filters/DeviceHistoryFilter";
import ExportButton from "@/components/admin/maintenance-report/ExportButton";
import Access from "@/components/share/access";

import {
    useDeviceHistoryReportQuery,
} from "@/hooks/useMaintenanceReports";

import {
    callExportDeviceHistoryReport,
} from "@/config/api";

import { ALL_PERMISSIONS } from "@/config/permissions";

import type {
    IDeviceHistoryFilter,
    IDeviceMaintenanceHistory,
} from "@/types/backend";

const DeviceHistorySection = () => {
    const [filter, setFilter] = useState<IDeviceHistoryFilter>({});
    interface ITableParams {
        pagination: Partial<TablePaginationConfig>;
    }

    const [tableParams, setTableParams] = useState<ITableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
        },
    });


    const [exportLoading, setExportLoading] = useState(false);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.set("page", String((tableParams.pagination.current || 1) - 1));
        params.set("size", String(tableParams.pagination.pageSize || 10));
        return params.toString();
    }, [tableParams]);

    const { data, isLoading } = useDeviceHistoryReportQuery(filter, queryString);

    const pagination: TablePaginationConfig = {
        ...tableParams.pagination,
        total: data?.meta?.total ?? 0,
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({ pagination });
    };

    const handleFilterChange = (next: IDeviceHistoryFilter) => {
        setFilter(next);
        setTableParams((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const buildExportQuery = (f: IDeviceHistoryFilter) => {
        const params = new URLSearchParams();
        if (f.deviceCode) params.set("deviceCode", f.deviceCode);
        if (f.deviceName) params.set("deviceName", f.deviceName);
        if (f.companyName) params.set("companyName", f.companyName);
        if (f.departmentName) params.set("departmentName", f.departmentName);
        if (f.fromDate) params.set("fromDate", f.fromDate);
        if (f.toDate) params.set("toDate", f.toDate);
        return params.toString();
    };

    const handleExport = async () => {
        try {
            setExportLoading(true);
            const qs = buildExportQuery(filter);
            const res = await callExportDeviceHistoryReport(qs);

            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `lich_su_bao_tri_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            message.error("Xuất báo cáo thất bại");
        } finally {
            setExportLoading(false);
        }
    };

    const columns: ColumnsType<IDeviceMaintenanceHistory> = [
        { title: "Mã thiết bị", dataIndex: "deviceCode", key: "deviceCode", width: 140 },
        { title: "Tên thiết bị", dataIndex: "deviceName", key: "deviceName", width: 180 },
        { title: "Công ty", dataIndex: "companyName", key: "companyName", width: 180 },
        { title: "Phòng ban", dataIndex: "departmentName", key: "departmentName", width: 160 },
        { title: "Mô tả sự cố", dataIndex: "issueDescription", key: "issueDescription", width: 220, ellipsis: true },
        { title: "Nguyên nhân", dataIndex: "causeName", key: "causeName", width: 180 },
        { title: "Mức độ hư hỏng", dataIndex: "damageLevel", key: "damageLevel", width: 150 },
        { title: "Loại bảo trì", dataIndex: "maintenanceType", key: "maintenanceType", width: 140 },
        { title: "Phương án xử lý", dataIndex: "solutionMethod", key: "solutionMethod", width: 200, ellipsis: true },
        { title: "Ưu tiên", dataIndex: "priorityLevel", key: "priorityLevel", width: 120 },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            key: "createdDate",
            width: 130,
            render: (v: string | undefined) => (v ? dayjs(v).format("DD/MM/YYYY") : ""),
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            width: 130,
            render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : ""),
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            width: 130,
            render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : ""),
        },
        { title: "Người thực hiện", dataIndex: "executorName", key: "executorName", width: 150 },
        { title: "Trạng thái sau", dataIndex: "deviceStatusAfter", key: "deviceStatusAfter", width: 140 },
        { title: "Số lần bảo trì", dataIndex: "maintenanceCount", key: "maintenanceCount", width: 140 },
    ];

    return (
        <Card title="Báo cáo lịch sử bảo trì thiết bị" bodyStyle={{ paddingTop: 12 }}>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Access permission={ALL_PERMISSIONS.REPORT_EXPORT.DEVICE_HISTORY} hideChildren>
                    <ExportButton onExport={handleExport} loading={exportLoading} />
                </Access>

                <DeviceHistoryFilter
                    filter={filter}
                    onChange={handleFilterChange}
                    loading={isLoading}
                />

                <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.DEVICE_HISTORY}>
                    <Table<IDeviceMaintenanceHistory>
                        rowKey={(record) => record.deviceCode + record.startDate}
                        columns={columns}
                        dataSource={data?.result ?? []}
                        loading={isLoading}
                        pagination={pagination}
                        scroll={{ x: 1500 }}
                        onChange={handleTableChange}
                        size="middle"
                    />

                </Access>
            </Space>
        </Card>
    );
};

export default DeviceHistorySection;
