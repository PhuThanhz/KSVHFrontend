import DataTable from "@/components/admin/data-table";
import type { IMaintenanceSchedule } from "@/types/backend";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag } from "antd";
import { useState } from "react";
import queryString from "query-string";
import {
    useMaintenanceSchedulesQuery,
    useGenerateDueRequestsMutation,
} from "@/hooks/useMaintenanceSchedules";
import { formatDate } from "@/config/format";

import MaintenanceScheduleDetailDrawer from "./drawer.maintenance-schedule.detail";
import GenerateRequestModal from "./modal.maintenance-schedule.generate";
import GenerateAutoRequestModal from "./modal.maintenance-schedule.generate-auto";

import { sfLike } from "spring-filter-query-builder";
import DateRangeFilter from "@/components/common/DateRangeFilter";

const statusColor = {
    CHUA_THUC_HIEN: "orange",
    DA_TAO_PHIEU: "green",
    HOAN_THANH: "blue",
};

const MaintenanceScheduleTable = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerId, setDrawerId] = useState("");

    const [openGenerateModal, setOpenGenerateModal] = useState(false);
    const [generateId, setGenerateId] = useState("");

    const [openGenerateAuto, setOpenGenerateAuto] = useState(false);

    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    const [query, setQuery] = useState(() =>
        queryString.stringify(
            {
                page: 1,
                size: 10,
                sort: "scheduledDate,desc",
            },
            { encode: false }
        )
    );

    const { data, isFetching } = useMaintenanceSchedulesQuery(query);
    const { isPending: generatingAuto } = useGenerateDueRequestsMutation();

    // ============================================================
    // BUILD QUERY (Giống DepartmentPage)
    // ============================================================
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (params.deviceCode)
            q.filter = sfLike("device.deviceCode", params.deviceCode);

        if (params.deviceName)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("device.deviceName", params.deviceName)}`
                : sfLike("device.deviceName", params.deviceName);

        if (params.status)
            q.filter = q.filter
                ? `${q.filter} and status='${params.status}'`
                : `status='${params.status}'`;

        if (createdAtFilter)
            q.filter = q.filter ? `${q.filter} and ${createdAtFilter}` : createdAtFilter;

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q, { encode: false });

        // SORT
        let sortBy = "sort=scheduledDate,desc";

        if (sort?.scheduledDate)
            sortBy =
                sort.scheduledDate === "ascend"
                    ? "sort=scheduledDate,asc"
                    : "sort=scheduledDate,desc";

        return `${temp}&${sortBy}`;
    };

    // ============================================================
    // COLUMNS
    // ============================================================
    const columns: ProColumns<IMaintenanceSchedule>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            hideInSearch: true,
            render: (_, __, index) =>
                index + 1 + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
        },
        {
            title: "Mã thiết bị",
            dataIndex: "deviceCode",
            sorter: true,
        },
        {
            title: "Thiết bị",
            dataIndex: "deviceName",
            sorter: false,
        },
        {
            title: "Ngày bảo trì",
            dataIndex: "scheduledDate",
            sorter: true,
            hideInSearch: true,
            render: (_, row) => formatDate(row.scheduledDate),
        },
        {
            title: "Bảo hành",
            dataIndex: "underWarranty",
            hideInSearch: true,
            render: (_, row) =>
                row.underWarranty ? <Tag color="green">Còn BH</Tag> : <Tag>Tự túc</Tag>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            sorter: true,
            render: (_, row) => <Tag color={statusColor[row.status]}>{row.status}</Tag>,
        },
        {
            title: "Mã phiếu",
            dataIndex: "requestCode",
            width: 140,
            hideInSearch: true,
            ellipsis: true,
        },
        {
            title: "Thao tác",
            hideInSearch: true,
            width: 180,
            render: (_, row) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => {
                            setDrawerId(row.id);
                            setOpenDrawer(true);
                        }}
                    >
                        Xem
                    </Button>

                    {row.status === "CHUA_THUC_HIEN" && (
                        <Button
                            type="link"
                            onClick={() => {
                                setGenerateId(row.id);
                                setOpenGenerateModal(true);
                            }}
                        >
                            Tạo phiếu
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <>
            <DataTable<IMaintenanceSchedule>
                headerTitle="Danh sách lịch bảo trì"
                rowKey="id"
                loading={isFetching}
                dataSource={data?.result || []}
                columns={columns}
                request={async (params, sort) => {
                    const newQuery = buildQuery(params, sort);
                    setQuery(newQuery);

                    return {
                        data: [],
                        success: true,
                    };
                }}
                pagination={{
                    defaultPageSize: 10,
                    current: data?.meta?.page,
                    pageSize: data?.meta?.pageSize,
                    total: data?.meta?.total,
                    showQuickJumper: true,
                    showSizeChanger: true,
                }}
                toolBarRender={() => [
                    <Space key="toolbar" size={12} align="center" wrap>
                        <DateRangeFilter
                            label="Ngày bảo trì"
                            fieldName="scheduledDate"
                            onChange={(filterStr) => setCreatedAtFilter(filterStr)}
                        />

                        <Button type="primary" loading={generatingAuto} onClick={() => setOpenGenerateAuto(true)}>
                            Sinh phiếu tự động
                        </Button>
                    </Space>,
                ]}
            />

            <MaintenanceScheduleDetailDrawer
                id={drawerId}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            />

            <GenerateRequestModal
                id={generateId}
                open={openGenerateModal}
                onClose={() => setOpenGenerateModal(false)}
            />

            <GenerateAutoRequestModal
                open={openGenerateAuto}
                onClose={() => setOpenGenerateAuto(false)}
            />
        </>
    );
};

export default MaintenanceScheduleTable;
