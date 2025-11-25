import { useMemo, useState } from "react";
import { Table, Space, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import WarrantyProductFilter from "../filters/WarrantyProductFilter";
import ExportExcelButton from "@/pages/admin/maintenance-report/export-excel/ExportExcelButton";
import Access from "@/components/share/access";

import { useWarrantyProductReportQuery } from "@/hooks/useMaintenanceReports";
import { callDownloadWarrantyProductReport } from "@/config/api";
import { ALL_PERMISSIONS } from "@/config/permissions";

import type { IWarrantyProductFilter, IWarrantyProductReport } from "@/types/backend";

interface TableParams {
    pagination: TablePaginationConfig;
}

const { Text } = Typography;

const WarrantyProductSection = () => {
    const [filter, setFilter] = useState<IWarrantyProductFilter>({});
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
        if (tableParams.pagination?.current)
            params.set("page", String(tableParams.pagination.current - 1));
        if (tableParams.pagination?.pageSize)
            params.set("size", String(tableParams.pagination.pageSize));
        return params.toString();
    }, [tableParams]);

    const { data, isLoading } = useWarrantyProductReportQuery(filter, queryString);

    const pagination: TablePaginationConfig = {
        ...tableParams.pagination,
        total: data?.meta?.total ?? 0,
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({ pagination });
    };

    const handleFilterChange = (next: IWarrantyProductFilter) => {
        setFilter(next);
        setTableParams((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const columns: ColumnsType<IWarrantyProductReport> = useMemo(
        () => [
            {
                title: "Mã KH",
                dataIndex: "customerCode",
                key: "customerCode",
                width: 140,
                fixed: "left",
            },
            {
                title: "Tên khách hàng",
                dataIndex: "customerName",
                key: "customerName",
                width: 200,
            },
            {
                title: "Số điện thoại",
                dataIndex: "phone",
                key: "phone",
                width: 140,
            },
            {
                title: "Địa chỉ",
                dataIndex: "address",
                key: "address",
                width: 250,
                ellipsis: true,
            },
            {
                title: "Mã thiết bị",
                dataIndex: "deviceCode",
                key: "deviceCode",
                width: 140,
            },
            {
                title: "Tên thiết bị",
                dataIndex: "deviceName",
                key: "deviceName",
                width: 200,
            },
            {
                title: "Loại thiết bị",
                dataIndex: "deviceType",
                key: "deviceType",
                width: 160,
            },
            {
                title: "Thương hiệu",
                dataIndex: "brand",
                key: "brand",
                width: 160,
            },
            {
                title: "Model",
                dataIndex: "model",
                key: "model",
                width: 160,
            },
            {
                title: "Ngày mua",
                dataIndex: "purchaseDate",
                key: "purchaseDate",
                width: 130,
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
            },
            {
                title: "Ngày hết hạn BH",
                dataIndex: "warrantyExpiryDate",
                key: "warrantyExpiryDate",
                width: 130,
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
            },
            {
                title: "Còn lại (ngày)",
                dataIndex: "warrantyRemainingDays",
                key: "warrantyRemainingDays",
                width: 140,
                align: "center",
                render: (v) => (v != null ? v.toLocaleString("vi-VN") : "-"),
            },
            {
                title: "Trạng thái bảo hành",
                dataIndex: "warrantyStatusText",
                key: "warrantyStatusText",
                width: 160,
                align: "center",
            },
            {
                title: "Vấn đề",
                dataIndex: "issue",
                key: "issue",
                width: 200,
                ellipsis: true,
            },
            {
                title: "Nguyên nhân gốc",
                dataIndex: "rootCause",
                key: "rootCause",
                width: 200,
                ellipsis: true,
            },
            {
                title: "Giải pháp",
                dataIndex: "solutionMethods",
                key: "solutionMethods",
                width: 220,
                render: (v) =>
                    Array.isArray(v) && v.length > 0 ? v.join(", ") : "-",
                ellipsis: true,
            },
            {
                title: "Kỹ thuật viên",
                dataIndex: "technicianName",
                key: "technicianName",
                width: 180,
            },
        ],
        []
    );

    return (
        <div>
            <WarrantyProductFilter
                value={filter}
                onChange={handleFilterChange}
                loading={isLoading}
            />

            <Space
                style={{
                    marginBottom: 16,
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text strong style={{ fontSize: 16 }}>
                    Báo cáo bảo hành sản phẩm
                </Text>

                <Access permission={ALL_PERMISSIONS.REPORT_EXPORT.WARRANTY_PRODUCT} hideChildren>
                    <ExportExcelButton
                        label="Xuất Excel"
                        apiFn={callDownloadWarrantyProductReport}
                        filter={filter}
                        fileName={`bao_cao_bao_hanh_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`}
                    />
                </Access>
            </Space>

            <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.WARRANTY_CUSTOMER_PRODUCTS}>
                <Table<IWarrantyProductReport>
                    rowKey={(r) => `${r.deviceCode}-${r.customerCode}`}
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

export default WarrantyProductSection;
