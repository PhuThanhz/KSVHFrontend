// src/pages/admin/maintenance-report/sections/MaintenanceRequest.tsx

import { useMemo, useState } from "react";
import { Card, Table, Space, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";

import MaintenanceRequestFilter from "../filters/MaintenanceRequestFilter";
import ExportButton from "@/components/admin/maintenance-report/ExportButton";
import Access from "@/components/share/access";

import {
    useMaintenanceRequestReportQuery,
} from "@/hooks/useMaintenanceReports";

import {
    callExportMaintenanceRequestReport,
} from "@/config/api";

import {
    ALL_PERMISSIONS,
} from "@/config/permissions";

import type {
    IRequestMaintenanceFilter,
    IMaintenanceRequestReport,
    IModelPaginate,
} from "@/types/backend";

interface TableParams {
    pagination: TablePaginationConfig;
}

const MaintenanceRequestSection = () => {
    const [filter, setFilter] = useState<IRequestMaintenanceFilter>({});
    const [tableParams, setTableParams] = useState<TableParams>({
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
        if (tableParams.pagination?.current) {
            params.set("page", String(tableParams.pagination.current - 1)); // backend thường 0-based
        }
        if (tableParams.pagination?.pageSize) {
            params.set("size", String(tableParams.pagination.pageSize));
        }
        return params.toString();
    }, [tableParams]);

    const { data, isLoading } = useMaintenanceRequestReportQuery(
        filter,
        queryString
    );

    const pagination: TablePaginationConfig = {
        ...tableParams.pagination,
        total: data?.meta?.total ?? 0,
    };

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        _sorter: SorterResult<IMaintenanceRequestReport> | SorterResult<IMaintenanceRequestReport>[]
    ) => {
        setTableParams({
            pagination,
        });
    };

    const handleFilterChange = (next: IRequestMaintenanceFilter) => {
        setFilter(next);
        setTableParams((prev) => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                current: 1, // reset về trang 1 khi đổi filter
            },
        }));
    };

    const buildExportQuery = (f: IRequestMaintenanceFilter) => {
        const params = new URLSearchParams();
        if (f.fromDate) params.set("fromDate", f.fromDate);
        if (f.toDate) params.set("toDate", f.toDate);
        if (f.companyName) params.set("companyName", f.companyName);
        if (f.departmentName) params.set("departmentName", f.departmentName);
        if (f.maintenanceType) params.set("maintenanceType", f.maintenanceType);
        if (f.status) params.set("status", f.status);
        if (f.priorityLevel) params.set("priorityLevel", f.priorityLevel);
        if (f.keyword) params.set("keyword", f.keyword);
        return params.toString();
    };

    const handleExport = async () => {
        try {
            setExportLoading(true);
            const qs = buildExportQuery(filter);
            const res = await callExportMaintenanceRequestReport(qs);

            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `bao_cao_yeu_cau_bao_tri_${dayjs().format(
                "YYYYMMDD_HHmmss"
            )}.xlsx`;
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

    const columns: ColumnsType<IMaintenanceRequestReport> = [
        {
            title: "Mã yêu cầu",
            dataIndex: "requestCode",
            key: "requestCode",
            fixed: "left",
            width: 140,
        },
        {
            title: "Thiết bị",
            dataIndex: "deviceName",
            key: "deviceName",
            width: 180,
        },
        {
            title: "Công ty",
            dataIndex: "companyName",
            key: "companyName",
            width: 180,
        },
        {
            title: "Phòng ban",
            dataIndex: "departmentName",
            key: "departmentName",
            width: 160,
        },
        {
            title: "Vấn đề",
            dataIndex: "issueDescription",
            key: "issueDescription",
            width: 220,
            ellipsis: true,
        },
        {
            title: "Nguyên nhân",
            dataIndex: "causeName",
            key: "causeName",
            width: 180,
        },
        {
            title: "Mức độ hư hỏng",
            dataIndex: "damageLevel",
            key: "damageLevel",
            width: 150,
        },
        {
            title: "Loại bảo trì",
            dataIndex: "maintenanceType",
            key: "maintenanceType",
            width: 140,
        },
        {
            title: "Giải pháp",
            dataIndex: "solutionMethod",
            key: "solutionMethod",
            width: 200,
            ellipsis: true,
        },
        {
            title: "Ưu tiên",
            dataIndex: "priorityLevel",
            key: "priorityLevel",
            width: 120,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 140,
        },
        {
            title: "Người tạo",
            dataIndex: "creatorName",
            key: "creatorName",
            width: 150,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            key: "createdDate",
            width: 130,
            render: (value: string | undefined) =>
                value ? dayjs(value).format("DD/MM/YYYY") : "",
        },
        {
            title: "Người khảo sát",
            dataIndex: "surveyorName",
            key: "surveyorName",
            width: 150,
        },
        {
            title: "Ngày khảo sát",
            dataIndex: "surveyDate",
            key: "surveyDate",
            width: 130,
            render: (value: string | undefined) =>
                value ? dayjs(value).format("DD/MM/YYYY") : "",
        },
        {
            title: "Người lập KH",
            dataIndex: "plannerName",
            key: "plannerName",
            width: 150,
        },
        {
            title: "Ngày lập KH",
            dataIndex: "planDate",
            key: "planDate",
            width: 130,
            render: (value: string | undefined) =>
                value ? dayjs(value).format("DD/MM/YYYY") : "",
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            width: 130,
            render: (value: string | undefined) =>
                value ? dayjs(value).format("DD/MM/YYYY") : "",
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            width: 130,
            render: (value: string | undefined) =>
                value ? dayjs(value).format("DD/MM/YYYY") : "",
        },
        {
            title: "Người thực hiện",
            dataIndex: "executorName",
            key: "executorName",
            width: 150,
        },
        {
            title: "Ngày nghiệm thu",
            dataIndex: "acceptanceDate",
            key: "acceptanceDate",
            width: 130,
            render: (value: string | undefined) =>
                value ? dayjs(value).format("DD/MM/YYYY") : "",
        },
        {
            title: "Người nghiệm thu",
            dataIndex: "acceptanceUserName",
            key: "acceptanceUserName",
            width: 150,
        },
        {
            title: "Lý do từ chối",
            dataIndex: "rejectReason",
            key: "rejectReason",
            width: 220,
            ellipsis: true,
        },
    ];

    return (
        <Card
            title="Báo cáo yêu cầu bảo trì"
            bodyStyle={{ paddingTop: 12 }}
        >
            <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
            >
                <Access
                    permission={ALL_PERMISSIONS.REPORT_EXPORT.MAINTENANCE_REQUEST}
                    hideChildren
                >
                    <ExportButton
                        onExport={handleExport}
                        loading={exportLoading}
                    />
                </Access>

                <MaintenanceRequestFilter
                    filter={filter}
                    onChange={handleFilterChange}
                    loading={isLoading}
                />

                <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.REQUEST_REPORT}>
                    <Table<IMaintenanceRequestReport>
                        rowKey={(record) => record.requestCode}
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

export default MaintenanceRequestSection;
