import { useMemo, useState } from "react";
import { Table, Space, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";

import MaintenanceRequestFilter from "../filters/MaintenanceRequestFilter";
import ExportExcelButton from "@/pages/admin/maintenance-report/export-excel/ExportExcelButton";
import Access from "@/components/share/access";

import { useMaintenanceRequestReportQuery } from "@/hooks/useMaintenanceReports";
import { callDownloadMaintenanceRequestReport } from "@/config/api";
import { ALL_PERMISSIONS } from "@/config/permissions";

import type {
    IRequestMaintenanceFilter,
    IMaintenanceRequestReport,
} from "@/types/backend";

interface TableParams {
    pagination: TablePaginationConfig;
}

const { Text } = Typography;

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

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        if (tableParams.pagination?.current) {
            params.set("page", String(tableParams.pagination.current - 1));
        }
        if (tableParams.pagination?.pageSize) {
            params.set("size", String(tableParams.pagination.pageSize));
        }
        return params.toString();
    }, [tableParams]);

    const { data, isLoading } = useMaintenanceRequestReportQuery(filter, queryString);

    const pagination: TablePaginationConfig = {
        ...tableParams.pagination,
        total: data?.meta?.total ?? 0,
    };

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        _sorter: SorterResult<IMaintenanceRequestReport> | SorterResult<IMaintenanceRequestReport>[]
    ) => {
        setTableParams({ pagination });
    };

    const handleFilterChange = (next: IRequestMaintenanceFilter) => {
        setFilter(next);
        setTableParams((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const columns: ColumnsType<IMaintenanceRequestReport> = useMemo(
        () => [
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
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
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
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
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
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
            },
            {
                title: "Ngày bắt đầu",
                dataIndex: "startDate",
                key: "startDate",
                width: 130,
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
            },
            {
                title: "Ngày kết thúc",
                dataIndex: "endDate",
                key: "endDate",
                width: 130,
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
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
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
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
        ],
        []
    );

    return (
        <div>
            <MaintenanceRequestFilter value={filter} onChange={handleFilterChange} />

            <Space
                style={{
                    marginBottom: 16,
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text strong style={{ fontSize: 16 }}>
                    Báo cáo yêu cầu bảo trì
                </Text>

                <Access permission={ALL_PERMISSIONS.REPORT_EXPORT.MAINTENANCE_REQUEST} hideChildren>
                    <ExportExcelButton
                        label="Xuất Excel"
                        apiFn={callDownloadMaintenanceRequestReport}
                        filter={filter}
                        fileName={`bao_cao_yeu_cau_bao_tri_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`}
                    />
                </Access>
            </Space>

            <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.REQUEST_REPORT}>
                <Table<IMaintenanceRequestReport>
                    rowKey={(record) => record.requestCode}
                    columns={columns}
                    dataSource={data?.result ?? []}
                    loading={isLoading}
                    pagination={pagination}
                    scroll={{ x: "max-content" }}
                    onChange={handleTableChange}
                    size="middle"
                />
            </Access>
        </div>
    );
};

export default MaintenanceRequestSection;