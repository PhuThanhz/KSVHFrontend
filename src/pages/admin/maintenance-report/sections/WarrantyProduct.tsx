// src/pages/admin/maintenance-report/sections/WarrantyProduct.tsx

import { useState, useMemo } from "react";
import { Card, Table, Space, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import WarrantyProductFilter from "../filters/WarrantyProductFilter";
import ExportButton from "@/components/admin/maintenance-report/ExportButton";
import Access from "@/components/share/access";

import { useWarrantyProductReportQuery } from "@/hooks/useMaintenanceReports";

import { callExportWarrantyProductReport } from "@/config/api";

import { ALL_PERMISSIONS } from "@/config/permissions";

import type {
    IWarrantyProductFilter,
    IWarrantyProductReport,
} from "@/types/backend";

interface ITableParams {
    pagination: Partial<TablePaginationConfig>;
}

const WarrantyProductSection = () => {
    const [filter, setFilter] = useState<IWarrantyProductFilter>({});
    const [tableParams, setTableParams] = useState<ITableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
        },
    });

    const [exportLoading, setExportLoading] = useState(false);

    /* ---------------------- Build Query String ---------------------- */
    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.set("page", String((tableParams.pagination.current ?? 1) - 1));
        params.set("size", String(tableParams.pagination.pageSize ?? 10));
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
            pagination: {
                ...prev.pagination!,
                current: 1,
            },
        }));
    };

    /* ---------------------- EXPORT EXCEL ---------------------- */
    const buildExportQuery = (f: IWarrantyProductFilter) => {
        const params = new URLSearchParams();


        if (f.customerName) params.set("customerName", f.customerName);


        return params.toString();
    };

    const handleExport = async () => {
        try {
            setExportLoading(true);
            const qs = buildExportQuery(filter);
            const res = await callExportWarrantyProductReport(qs);

            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `bao_hanh_san_pham_${dayjs().format(
                "YYYYMMDD_HHmmss"
            )}.xlsx`;

            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            message.error("Xuất báo cáo thất bại");
        } finally {
            setExportLoading(false);
        }
    };

    /* ---------------------- TABLE COLUMNS ---------------------- */
    const columns: ColumnsType<IWarrantyProductReport> = [
        {
            title: "Mã thiết bị",
            dataIndex: "deviceCode",
            key: "deviceCode",
            width: 140,
            fixed: "left",
        },
        {
            title: "Tên thiết bị",
            dataIndex: "deviceName",
            key: "deviceName",
            width: 200,
        },
        {
            title: "Khách hàng",
            dataIndex: "customerName",
            key: "customerName",
            width: 180,
        },
        {
            title: "Ngày mua",
            dataIndex: "purchaseDate",
            key: "purchaseDate",
            width: 130,
            render: (v: string | undefined) =>
                v ? dayjs(v).format("DD/MM/YYYY") : "",
        },
        {
            title: "Ngày hết hạn BH",
            dataIndex: "warrantyEndDate",
            key: "warrantyEndDate",
            width: 130,
            render: (v: string | undefined) =>
                v ? dayjs(v).format("DD/MM/YYYY") : "",
        },
        {
            title: "Trạng thái bảo hành",
            dataIndex: "warrantyStatus",
            key: "warrantyStatus",
            width: 160,
        },
        {
            title: "Ghi chú",
            dataIndex: "notes",
            key: "notes",
            width: 220,
            ellipsis: true,
        },
    ];

    return (
        <Card title="Báo cáo bảo hành sản phẩm" bodyStyle={{ paddingTop: 12 }}>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">

                <Access permission={ALL_PERMISSIONS.REPORT_EXPORT.WARRANTY_PRODUCT} hideChildren>
                    <ExportButton onExport={handleExport} loading={exportLoading} />
                </Access>

                <WarrantyProductFilter
                    filter={filter}
                    onChange={handleFilterChange}
                    loading={isLoading}
                />

                <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.WARRANTY_CUSTOMER_PRODUCTS}>
                    <Table<IWarrantyProductReport>
                        rowKey={(r) => r.deviceCode + r.customerName}
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

export default WarrantyProductSection;
