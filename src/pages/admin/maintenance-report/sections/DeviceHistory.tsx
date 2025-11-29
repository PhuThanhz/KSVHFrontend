import { useState, useMemo } from "react";
import { Space, Typography } from "antd";
import type { ProColumns } from "@ant-design/pro-components";
import queryString from "query-string";
import dayjs from "dayjs";

import DeviceHistoryFilter from "../filters/DeviceHistoryFilter";
import ExportExcelButton from "@/pages/admin/maintenance-report/export-excel/ExportExcelButton";
import DataTable from "@/components/common/data-table";
import Access from "@/components/share/access";

import { useDeviceHistoryReportQuery } from "@/hooks/useMaintenanceReports";
import { callDownloadDeviceHistoryReport } from "@/config/api";
import { ALL_PERMISSIONS } from "@/config/permissions";

import type {
    IDeviceHistoryFilter,
    IDeviceMaintenanceHistory,
} from "@/types/backend";

const { Text } = Typography;

const DeviceHistorySection = () => {
    const [filter, setFilter] = useState<IDeviceHistoryFilter>({});
    const [query, setQuery] = useState("page=0&size=10&sort=createdDate,desc");

    const { data, isFetching } = useDeviceHistoryReportQuery(filter, query);

    const meta = data?.meta ?? { page: 1, pageSize: 10, total: 0 };
    const items = data?.result ?? [];

    const buildQuery = (params: any, sorter: any) => {
        const q: any = {
            page: (params.current || 1) - 1,
            size: params.pageSize || 10,
        };

        const field = Object.keys(sorter || {})[0];

        const fieldMap: Record<string, string> = {
            createdDate: "createdAt",
            startDate: "startAt",
            endDate: "endAt",
        };

        if (field) {
            const backendField = fieldMap[field] || field;
            q.sort = `${backendField},${sorter[field] === "ascend" ? "asc" : "desc"}`;
        } else {
            q.sort = "createdAt,desc";
        }

        return queryString.stringify(q);
    };

    const columns: ProColumns<IDeviceMaintenanceHistory>[] = useMemo(
        () => [
            {
                title: "STT",
                dataIndex: "maintenanceCount",
                width: 80,
            },
            {
                title: "Mã thiết bị",
                dataIndex: "deviceCode",
                width: 120,
            },
            {
                title: "Tên thiết bị",
                dataIndex: "deviceName",
                width: 180,
            },
            {
                title: "Công ty",
                dataIndex: "companyName",
                width: 160,
            },
            {
                title: "Phòng ban",
                dataIndex: "departmentName",
                width: 160,
            },
            {
                title: "Vấn đề",
                dataIndex: "issueDescription",
                width: 220,
                ellipsis: true,
            },
            {
                title: "Nguyên nhân",
                dataIndex: "causeName",
                width: 200,
                ellipsis: true,
            },
            {
                title: "Mức độ hư hỏng",
                dataIndex: "damageLevel",
                width: 160,
            },
            {
                title: "Hình thức bảo trì",
                dataIndex: "maintenanceType",
                width: 160,
            },
            {
                title: "Mức ưu tiên",
                dataIndex: "priorityLevel",
                width: 140,
            },
            {
                title: "Ngày tạo",
                dataIndex: "createdDate",
                width: 140,
                render: (_, record) =>
                    record.createdDate ? dayjs(record.createdDate).format("DD/MM/YYYY") : "-",
            },
            {
                title: "Ngày bắt đầu",
                dataIndex: "startDate",
                width: 140,
                render: (_, record) =>
                    record.startDate ? dayjs(record.startDate).format("DD/MM/YYYY") : "-",
            },
            {
                title: "Ngày kết thúc",
                dataIndex: "endDate",
                width: 140,
                render: (_, record) =>
                    record.endDate ? dayjs(record.endDate).format("DD/MM/YYYY") : "-",
            },
            {
                title: "Người thực hiện",
                dataIndex: "executorName",
                width: 160,
            },
            {
                title: "Ngày nghiệm thu",
                dataIndex: "acceptanceDate",
                width: 140,
                render: (_, record) =>
                    record.acceptanceDate ? dayjs(record.acceptanceDate).format("DD/MM/YYYY") : "-",
            },
            {
                title: "Người nghiệm thu",
                dataIndex: "acceptanceUserName",
                width: 160,
            },
            {
                title: "Trạng thái sau BT",
                dataIndex: "deviceStatusAfter",
                width: 200,
            },
        ],
        []
    );

    return (
        <div>
            <DeviceHistoryFilter filter={filter} onChange={setFilter} />

            <Space
                style={{
                    marginBottom: 10,
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Text strong>Báo cáo lịch sử bảo trì thiết bị</Text>

                <Access permission={ALL_PERMISSIONS.REPORT_EXPORT.DEVICE_HISTORY} hideChildren>
                    <ExportExcelButton
                        label="Xuất Excel"
                        apiFn={callDownloadDeviceHistoryReport}
                        filter={filter}
                        fileName={`bao_cao_lich_su_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`}
                    />
                </Access>
            </Space>

            <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.DEVICE_HISTORY}>
                <DataTable<IDeviceMaintenanceHistory>
                    rowKey="maintenanceCount"
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

export default DeviceHistorySection;