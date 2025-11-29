import { useState, useMemo } from "react";
import { Space, Typography } from "antd";
import type { ProColumns } from "@ant-design/pro-components";
import queryString from "query-string";
import dayjs from "dayjs";

import DeviceDepreciationFilter from "../filters/DeviceDepreciationFilter";
import ExportExcelButton from "@/pages/admin/maintenance-report/export-excel/ExportExcelButton";
import DataTable from "@/components/common/data-table";
import Access from "@/components/share/access";

import { useDeviceDepreciationReportQuery } from "@/hooks/useMaintenanceReports";
import { callDownloadDeviceDepreciationReport } from "@/config/api";
import { ALL_PERMISSIONS } from "@/config/permissions";

import type {
    IDeviceDepreciationFilter,
    IDeviceDepreciationReport,
} from "@/types/backend";

const { Text } = Typography;

const DeviceDepreciationSection = () => {
    const [filter, setFilter] = useState<IDeviceDepreciationFilter>({});
    const [query, setQuery] = useState("page=0&size=10&sort=commissioningDate,desc");

    const { data, isFetching } = useDeviceDepreciationReportQuery(filter, query);

    const meta = data?.meta ?? { page: 1, pageSize: 10, total: 0 };
    const items = data?.result ?? [];

    const buildQuery = (params: any, sorter: any) => {
        const q: any = {
            page: (params.current || 1) - 1,
            size: params.pageSize || 10,
        };

        const field = Object.keys(sorter || {})[0];
        if (field) {
            q.sort = `${field},${sorter[field] === "ascend" ? "asc" : "desc"}`;
        } else {
            q.sort = "commissioningDate,desc";
        }

        return queryString.stringify(q);
    };

    const columns: ProColumns<IDeviceDepreciationReport>[] = useMemo(
        () => [
            {
                title: "Mã thiết bị",
                dataIndex: "deviceCode",
                width: 140,
            },
            {
                title: "Tên thiết bị",
                dataIndex: "deviceName",
                width: 200,
            },
            {
                title: "Công ty",
                dataIndex: "companyName",
                width: 180,
            },
            {
                title: "Phòng ban",
                dataIndex: "departmentName",
                width: 180,
            },
            {
                title: "Loại tài sản",
                dataIndex: "assetType",
                width: 160,
            },
            {
                title: "Loại thiết bị",
                dataIndex: "deviceTypeName",
                width: 160,
            },
            {
                title: "Giá gốc (₫)",
                dataIndex: "unitPrice",
                width: 150,
                render: (_, record) =>
                    record.unitPrice ? record.unitPrice.toLocaleString("vi-VN") : "-",
            },
            {
                title: "Ngày đưa vào sử dụng",
                dataIndex: "commissioningDate",
                width: 160,
            },
            {
                title: "Thời gian KH",
                dataIndex: "depreciationPeriod",
                width: 140,
            },
            {
                title: "Ngày hết KH",
                dataIndex: "depreciationEndDate",
                width: 160,
            },
            {
                title: "KH/tháng (₫)",
                dataIndex: "monthlyDepreciation",
                width: 160,
                render: (_, record) =>
                    record.monthlyDepreciation ? record.monthlyDepreciation.toLocaleString("vi-VN") : "-",
            },
            {
                title: "Đã khấu hao (₫)",
                dataIndex: "depreciationToDate",
                width: 160,
                render: (_, record) =>
                    record.depreciationToDate ? record.depreciationToDate.toLocaleString("vi-VN") : "-",
            },
            {
                title: "Giá trị còn lại (₫)",
                dataIndex: "remainingValue",
                width: 160,
                render: (_, record) =>
                    record.remainingValue ? record.remainingValue.toLocaleString("vi-VN") : "-",
            },
            {
                title: "Người quản lý",
                dataIndex: "managerName",
                width: 180,
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                width: 150,
            },
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
                    <ExportExcelButton
                        label="Xuất Excel"
                        apiFn={callDownloadDeviceDepreciationReport}
                        filter={filter}
                        fileName={`bao_cao_khau_hao_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`}
                    />
                </Access>
            </Space>

            <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.DEVICE_DEPRECIATION}>
                <DataTable<IDeviceDepreciationReport>
                    rowKey="deviceCode"
                    loading={isFetching}
                    columns={columns}
                    dataSource={items}
                    search={false}
                    scroll={{ x: "max-content" }}
                    pagination={{
                        current: meta.page,
                        pageSize: meta.pageSize,
                        total: meta.total,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50, 100],
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