import { useEffect, useRef, useState } from "react";
import { Button, Space, Tag } from "antd";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import queryString from "query-string";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";

import { sfLike } from "spring-filter-query-builder";
import { formatDate } from "@/utils/format";
import { PAGINATION_CONFIG } from "@/config/pagination";

import {
    useMaintenanceSchedulesQuery,
    useGenerateDueRequestsMutation,
} from "@/hooks/useMaintenanceSchedules";

import type { IMaintenanceSchedule } from "@/types/backend";
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
    const [selectedId, setSelectedId] = useState<string>("");

    const [openGenerateModal, setOpenGenerateModal] = useState(false);
    const [generateId, setGenerateId] = useState<string>("");

    const [openGenerateAuto, setOpenGenerateAuto] = useState(false);

    const [searchValue, setSearchValue] = useState<string>("");
    const [scheduledDateFilter, setScheduledDateFilter] = useState<string | null>(null);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=scheduledDate,desc`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useMaintenanceSchedulesQuery(query);
    const { isPending: generatingAuto } = useGenerateDueRequestsMutation();

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const schedules = data?.result ?? [];

    // ==================================================================
    // Auto build query when filters change
    // ==================================================================
    useEffect(() => {
        const q: any = {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            sort: "scheduledDate,desc",
        };

        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(
                `(device.deviceCode~'${searchValue}' or requestCode~'${searchValue}')`
            );
        }

        if (scheduledDateFilter) filterParts.push(scheduledDateFilter);

        if (filterParts.length > 0) q.filter = filterParts.join(" and ");

        const built = queryString.stringify(q, { encode: false });
        setQuery(built);
    }, [searchValue, scheduledDateFilter]);

    // ==================================================================
    // Build query for pagination/sort
    // ==================================================================
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(
                `(device.deviceCode~'${searchValue}' or requestCode~'${searchValue}')`
            );
        }

        if (scheduledDateFilter) filterParts.push(scheduledDateFilter);

        if (filterParts.length > 0) q.filter = filterParts.join(" and ");

        let temp = queryString.stringify(q, { encode: false });
        const sortQuery =
            sort?.scheduledDate === "ascend"
                ? "sort=scheduledDate,asc"
                : "sort=scheduledDate,desc";

        return `${temp}&${sortQuery}`;
    };

    const reloadTable = () => {
        setSearchValue("");
        setScheduledDateFilter(null);
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=scheduledDate,desc`
        );
    };

    // ==================================================================
    // COLUMNS
    // ==================================================================
    const columns: ProColumns<IMaintenanceSchedule>[] = [
        {
            title: "STT",
            width: 60,
            align: "center",
            render: (_, __, index) =>
                index +
                1 +
                ((meta.page || 1) - 1) *
                (meta.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE),
            hideInSearch: true,
        },
        {
            title: "Mã thiết bị",
            dataIndex: "deviceCode",
            sorter: true,
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
            sorter: true,
        },
        {
            title: "Thao tác",
            width: 200,
            hideInSearch: true,
            align: "center",
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
        <PageContainer
            title="Quản lý lịch bảo trì thiết bị"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm theo mã thiết bị hoặc mã phiếu..."
                        addLabel="Sinh phiếu tự động"
                        showFilterButton={false}
                        onSearch={(val) => setSearchValue(val)}
                        onReset={reloadTable}
                        onAddClick={() => setOpenGenerateAuto(true)}
                    />

                    <div className="flex flex-wrap gap-3 items-center">
                        <DateRangeFilter
                            label="Ngày bảo trì"
                            fieldName="scheduledDate"
                            onChange={(filterStr) => setScheduledDateFilter(filterStr)}
                        />
                    </div>
                </div>
            }
        >
            <DataTable<IMaintenanceSchedule>
                actionRef={tableRef}
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={schedules}
                request={async (params, sort) => {
                    const q = buildQuery(params, sort);
                    setQuery(q);
                    return Promise.resolve({
                        data: schedules || [],
                        success: true,
                        total: meta.total || 0,
                    });
                }}
                pagination={{
                    defaultPageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
                    current: meta.page,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showQuickJumper: true,
                    showTotal: (total, range) => (
                        <div style={{ fontSize: 13 }}>
                            <span style={{ fontWeight: 500 }}>
                                {range[0]}–{range[1]}
                            </span>{" "}
                            trên{" "}
                            <span
                                style={{
                                    fontWeight: 600,
                                    color: "#1677ff",
                                }}
                            >
                                {total.toLocaleString()}
                            </span>{" "}
                            lịch bảo trì
                        </div>
                    ),
                }}
                rowSelection={false}
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
        </PageContainer>
    );
};

export default MaintenanceScheduleTable;
