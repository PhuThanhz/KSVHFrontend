import { useState } from "react";
import { Button, Space, Tag } from "antd";
import type { ProColumns } from "@ant-design/pro-components";
import queryString from "query-string";

import DataTable from "@/components/common/data-table";
import DateRangeFilter from "@/components/common/filter/DateRangeFilter";
import { sfLike } from "spring-filter-query-builder";

import {
    useMaintenanceSchedulesQuery,
    useGenerateDueRequestsMutation,
} from "@/hooks/useMaintenanceSchedules";

import type { IMaintenanceSchedule } from "@/types/backend";
import { formatDate } from "@/utils/format";

import MaintenanceScheduleDetailModal from "./modal.maintenance-schedule.detail";
import GenerateRequestModal from "./modal.maintenance-schedule.generate";
import GenerateAutoRequestModal from "./modal.maintenance-schedule.generate-auto";


// ==================================================================
// COLOR MAP
// ==================================================================
const statusColor: Record<string, string> = {
    CHUA_THUC_HIEN: "orange",
    DA_TAO_PHIEU: "green",
    HOAN_THANH: "blue",
};


// ==================================================================
// MAIN COMPONENT
// ==================================================================
const MaintenanceScheduleTable = () => {
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedId, setSelectedId] = useState("");

    const [openGenerateModal, setOpenGenerateModal] = useState(false);
    const [generateId, setGenerateId] = useState("");

    const [openGenerateAuto, setOpenGenerateAuto] = useState(false);

    const [scheduledDateFilter, setScheduledDateFilter] = useState<string | null>(null);

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


    // ==================================================================
    // BUILD QUERY (SEARCH & SORT)
    // ==================================================================
    const buildQuery = (params: any, sort: any) => {
        let filter = "";

        if (params.deviceCode)
            filter = sfLike("device.deviceCode", params.deviceCode).toString();

        if (params.deviceName)
            filter = filter
                ? `${filter} and ${sfLike("device.deviceName", params.deviceName).toString()}`
                : sfLike("device.deviceName", params.deviceName).toString();

        if (params.status)
            filter = filter
                ? `${filter} and status='${params.status}'`
                : `status='${params.status}'`;

        if (scheduledDateFilter)
            filter = filter ? `${filter} and ${scheduledDateFilter}` : scheduledDateFilter;

        const q = {
            page: params.current,
            size: params.pageSize,
            ...(filter && { filter }),
        };

        const sortQuery =
            sort?.scheduledDate === "ascend"
                ? "sort=scheduledDate,asc"
                : "sort=scheduledDate,desc";

        return `${queryString.stringify(q, { encode: false })}&${sortQuery}`;
    };



    // ==================================================================
    // TABLE COLUMNS
    // ==================================================================
    const columns: ProColumns<IMaintenanceSchedule>[] = [
        {
            title: "STT",
            width: 60,
            align: "center",
            render: (_, __, index) =>
                index + 1 + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            hideInSearch: true,
        },
        {
            title: "Mã thiết bị",
            dataIndex: "deviceCode",
        },
        {
            title: "Tên thiết bị",
            dataIndex: "deviceName",
            hideInSearch: true,
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
                row.underWarranty ? (
                    <Tag color="green">Còn BH</Tag>
                ) : (
                    <Tag color="default">Tự túc</Tag>
                ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (_, row) => (
                <Tag color={statusColor[row.status]}>{row.status}</Tag>
            ),
        },
        {
            title: "Mã phiếu",
            dataIndex: "requestCode",
            hideInSearch: true,
            ellipsis: true,
        },
        {
            title: "Thao tác",
            width: 200,
            hideInSearch: true,
            render: (_, row) => (
                <Space>
                    <Button
                        type="primary"
                        ghost
                        onClick={() => {
                            setSelectedId(row.id);
                            setOpenDetailModal(true);
                        }}
                    >
                        Xem chi tiết
                    </Button>

                    {row.status === "CHUA_THUC_HIEN" && (
                        <Button
                            type="primary"
                            ghost
                            danger
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


    // ==================================================================
    // RENDER
    // ==================================================================
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
                    return { data: [], success: true };
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
                    <Space key="tools" size={12}>
                        <DateRangeFilter
                            label="Ngày bảo trì"
                            fieldName="scheduledDate"
                            onChange={(filterStr) => setScheduledDateFilter(filterStr)}
                        />

                        <Button
                            type="primary"
                            loading={generatingAuto}
                            onClick={() => setOpenGenerateAuto(true)}
                        >
                            Sinh phiếu tự động
                        </Button>
                    </Space>,
                ]}
            />

            {/* MODALS */}
            <MaintenanceScheduleDetailModal
                id={selectedId}
                open={openDetailModal}
                onClose={() => setOpenDetailModal(false)}
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
