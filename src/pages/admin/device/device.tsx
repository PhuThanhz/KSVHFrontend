import { lazy, Suspense, useCallback, useMemo, useReducer, useState } from "react";
import { Button, Select, Space, Tag, Tabs } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";

import DataTable from "@/components/common/data-table";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import { useDevicesQuery } from "@/hooks/useDevices";
import { useDepartmentsQuery } from "@/hooks/useDepartments";
import { useCompaniesQuery } from "@/hooks/useCompanies";
import DateRangeFilter from "@/components/common/filter/DateRangeFilter";
import type { IDeviceList } from "@/types/backend";
import type { ProColumns } from "@ant-design/pro-components";
const DeviceMaintenanceScheduleModal = lazy(() =>
    import("@/pages/admin/device/DeviceMaintenanceScheduleModal")
);

// Lazy load modals
const DeviceModal = lazy(() => import("@/pages/admin/device/DeviceModal"));
const ViewDevice = lazy(() => import("@/pages/admin/device/view.device"));
const DevicePartModal = lazy(() =>
    import("@/pages/admin/device/DevicePartModal")
);

/* ===================== State reducer cho filters ===================== */
type FilterState = {
    company?: string | null;
    department?: string | null;
    supplier?: string | null;
    status?: string | null;
    createdAt?: string | null;
};

function filterReducer(state: FilterState, action: Partial<FilterState>) {
    return { ...state, ...action };
}

const DevicePage = () => {
    /** ===================== Modal & Tab state ===================== */
    const [openModal, setOpenModal] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openParts, setOpenParts] = useState(false);

    const [dataInit, setDataInit] = useState<{ id?: string | number | null } | null>(
        null
    );
    const [openSchedule, setOpenSchedule] = useState(false);
    const [scheduleDeviceId, setScheduleDeviceId] = useState<string | null>(null);


    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [partsDeviceId, setPartsDeviceId] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<"INTERNAL" | "CUSTOMER">("INTERNAL");

    /** ===================== Filters & queries ===================== */
    const [internalFilters, dispatchInternalFilters] = useReducer(filterReducer, {});
    const [customerFilters, dispatchCustomerFilters] = useReducer(filterReducer, {});
    const handleViewSchedule = useCallback((deviceId: string) => {
        setScheduleDeviceId(deviceId);
        setOpenSchedule(true);
    }, []);
    const [internalQuery, setInternalQuery] = useState(() =>
        queryString.stringify(
            {
                page: 1,
                size: 10,
                sort: "createdAt,desc",
                filter: "ownershipType='INTERNAL'",
            },
            { encode: false }
        )
    );

    const [customerQuery, setCustomerQuery] = useState(() =>
        queryString.stringify(
            {
                page: 1,
                size: 10,
                sort: "createdAt,desc",
                filter: "ownershipType='CUSTOMER'",
            },
            { encode: false }
        )
    );

    /** ===================== Hooks ===================== */
    const { data: internalData, isFetching: isInternalFetching } =
        useDevicesQuery(internalQuery);

    const { data: customerData, isFetching: isCustomerFetching } =
        useDevicesQuery(customerQuery);

    const { data: companiesData } = useCompaniesQuery("page=1&size=100");
    const { data: departmentsData } = useDepartmentsQuery("page=1&size=100");

    /** ===================== Select options ===================== */
    const companyOptions = useMemo(
        () =>
            companiesData?.result?.map((c) => ({ label: c.name, value: c.name })) ??
            [],
        [companiesData]
    );

    const departmentOptions = useMemo(
        () =>
            departmentsData?.result?.map((d) => ({ label: d.name, value: d.name })) ??
            [],
        [departmentsData]
    );

    /** ===================== Handlers ===================== */
    const handleCreate = useCallback(() => {
        setDataInit(null);
        setOpenModal(true);
    }, []);

    const handleEdit = useCallback((device: IDeviceList) => {
        setDataInit({ id: device.id });
        setOpenModal(true);
    }, []);

    const handleView = useCallback((deviceId: string) => {
        setSelectedId(deviceId);
        setOpenView(true);
    }, []);

    const handleManageParts = useCallback((deviceId: string) => {
        setPartsDeviceId(deviceId);
        setOpenParts(true);
    }, []);

    /** ===================== Build query ===================== */
    const buildQuery = useCallback(
        (
            params: any,
            sort: any,
            ownershipType: "INTERNAL" | "CUSTOMER",
            filters: FilterState
        ) => {
            const q: any = { page: params.current || 1, size: 10 };
            let filter = `ownershipType='${ownershipType}'`;

            if (params.deviceName)
                filter += ` and ${sfLike("deviceName", params.deviceName)}`;
            if (params.deviceCode)
                filter += ` and ${sfLike("deviceCode", params.deviceCode)}`;
            if (filters.company) filter += ` and company.name='${filters.company}'`;
            if (filters.department)
                filter += ` and department.name='${filters.department}'`;
            if (filters.status) filter += ` and status='${filters.status}'`;
            if (filters.createdAt) filter += ` and ${filters.createdAt}`;

            q.filter = filter;

            let sortBy = "sort=createdAt,desc";
            if (sort?.deviceName)
                sortBy = `sort=deviceName,${sort.deviceName === "ascend" ? "asc" : "desc"
                    }`;
            else if (sort?.deviceCode)
                sortBy = `sort=deviceCode,${sort.deviceCode === "ascend" ? "asc" : "desc"
                    }`;

            return `${queryString.stringify(q, { encode: false })}&${sortBy}`;
        },
        []
    );

    /** ===================== Table columns ===================== */
    const getColumns = useCallback(
        (data: any): ProColumns<IDeviceList>[] => [
            {
                title: "STT",
                key: "index",
                width: 60,
                align: "center",
                render: (_: any, __: any, index: number) =>
                    index +
                    1 +
                    ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            },
            { title: "Mã thiết bị", dataIndex: "deviceCode", sorter: true },
            { title: "Tên thiết bị", dataIndex: "deviceName", sorter: true },
            {
                title: "Loại thiết bị",
                dataIndex: "deviceTypeName",
                render: (t: any) => (t ? <Tag color="blue">{t}</Tag> : "-"),
            },
            {
                title: "Phòng ban / Nhà hàng",
                dataIndex: "departmentName",
                render: (t: any) => (t ? <Tag color="purple">{t}</Tag> : "-"),
            },
            {
                title: "Nhà cung cấp",
                dataIndex: "supplierName",
                render: (t: any) => (t ? <Tag color="geekblue">{t}</Tag> : "-"),
            },
            {
                title: "Công ty",
                dataIndex: "companyName",
                render: (t: any) => (t ? <Tag color="cyan">{t}</Tag> : "-"),
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                render: (v: any) => {
                    const map: Record<
                        string,
                        { text: string; color: string }
                    > = {
                        NEW: { text: "Thêm Mới", color: "blue" },
                        IN_USE: { text: "Đang sử dụng", color: "green" },
                        IN_STORAGE: { text: "Trong kho", color: "gold" },
                        NOT_IN_USE: { text: "Ngưng sử dụng", color: "volcano" },
                        LIQUIDATED: { text: "Đã thanh lý", color: "red" },
                    };
                    const item = map[v];
                    return item ? (
                        <Tag color={item.color}>{item.text}</Tag>
                    ) : (
                        <Tag>-</Tag>
                    );
                },
            },
            {
                title: "Hành động",
                width: 280,
                align: "center",
                render: (_: any, entity: IDeviceList) => (
                    <Space>

                        <Access permission={ALL_PERMISSIONS.DEVICE.GET_BY_ID} hideChildren>
                            <Button
                                type="default"
                                onClick={() => handleView(String(entity.id))}
                                icon={<EyeOutlined />}
                            >
                                Xem
                            </Button>
                        </Access>

                        <Access permission={ALL_PERMISSIONS.DEVICE.UPDATE} hideChildren>
                            <Button
                                type="primary"
                                onClick={() => handleEdit(entity)}
                                icon={<EditOutlined />}
                            >
                                Sửa
                            </Button>
                        </Access>

                        <Access permission={ALL_PERMISSIONS.DEVICE_PART.GET_BY_DEVICE} hideChildren>
                            <Button
                                type="dashed"
                                onClick={() => handleManageParts(String(entity.id))}
                                icon={<ToolOutlined />}
                            >
                                Quản lý Linh kiện
                            </Button>
                        </Access>
                        <Access permission={ALL_PERMISSIONS.MAINTENANCE_SCHEDULE.GET_BY_DEVICE} hideChildren>
                            <Button
                                type="default"
                                onClick={() => handleViewSchedule(String(entity.id))}
                                icon={<ToolOutlined />}
                            >
                                Lịch bảo trì
                            </Button>
                        </Access>

                    </Space>
                ),
            },

        ],
        [handleView, handleEdit, handleManageParts]
    );

    /** ===================== Render table ===================== */
    const renderDeviceTable = (
        ownershipType: "INTERNAL" | "CUSTOMER",
        data: any,
        isFetching: boolean,
        filters: FilterState,
        dispatchFilters: React.Dispatch<Partial<FilterState>>,
        query: string,
        setQuery: (q: string) => void
    ) => {
        const title =
            ownershipType === "INTERNAL" ? "Thiết bị nội bộ" : "Thiết bị khách hàng";

        const columns = getColumns(data);

        return (
            <DataTable<IDeviceList>
                headerTitle={title}
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={data?.result || []}
                request={async (params, sort) => {
                    const q = buildQuery(params, sort, ownershipType, filters);
                    if (q !== query) setQuery(q);
                    return {
                        data: data?.result || [],
                        success: true,
                        total: data?.meta?.total || 0,
                    };
                }}
                pagination={{
                    defaultPageSize: 10,
                    current: data?.meta?.page,
                    pageSize: data?.meta?.pageSize,
                    showTotal: (total, range) => (
                        <div style={{ fontSize: 13, color: "#595959" }}>
                            <span style={{ fontWeight: 500, color: "#000" }}>
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
                            thiết bị
                        </div>
                    ),
                }}
                toolBarRender={() => [
                    <Space key="filters" size={12} align="center" wrap>
                        <Select
                            placeholder="Công ty"
                            allowClear
                            style={{ width: 180 }}
                            options={companyOptions}
                            value={filters.company}
                            onChange={(v) => dispatchFilters({ company: v || null })}
                        />
                        <Select
                            placeholder="Phòng ban"
                            allowClear
                            style={{ width: 180 }}
                            options={departmentOptions}
                            value={filters.department}
                            onChange={(v) =>
                                dispatchFilters({ department: v || null })
                            }
                        />
                        <Select
                            placeholder="Trạng thái"
                            allowClear
                            style={{ width: 160 }}
                            value={filters.status}
                            options={[
                                { label: "Thêm Mới", value: "NEW" },
                                { label: "Đang sử dụng", value: "IN_USE" },
                                { label: "Trong kho", value: "IN_STORAGE" },
                                { label: "Ngưng sử dụng", value: "NOT_IN_USE" },
                                { label: "Đã thanh lý", value: "LIQUIDATED" },
                            ]}
                            onChange={(v) => dispatchFilters({ status: v || null })}
                        />
                        <DateRangeFilter
                            label="Ngày tạo"
                            fieldName="createdAt"
                            size="middle"
                            width={320}
                            onChange={(filterStr) =>
                                dispatchFilters({ createdAt: filterStr })
                            }
                        />

                        <Access permission={ALL_PERMISSIONS.DEVICE.CREATE} hideChildren>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={handleCreate}
                            >
                                Thêm mới
                            </Button>
                        </Access>

                    </Space>,
                ]}
            />
        );
    };

    /** ===================== Main render ===================== */
    return (
        <div>
            <Tabs
                activeKey={activeTab}
                onChange={(key) =>
                    setActiveTab(key as "INTERNAL" | "CUSTOMER")
                }
                items={[
                    {
                        key: "INTERNAL",
                        label: (
                            <span style={{ fontSize: 15, fontWeight: 500 }}>
                                Thiết bị nội bộ
                                {internalData?.meta?.total !== undefined && (
                                    <Tag color="green" style={{ marginLeft: 8 }}>
                                        {internalData.meta.total}
                                    </Tag>
                                )}
                            </span>
                        ),
                        children: renderDeviceTable(
                            "INTERNAL",
                            internalData,
                            isInternalFetching,
                            internalFilters,
                            dispatchInternalFilters,
                            internalQuery,
                            setInternalQuery
                        ),
                    },
                    {
                        key: "CUSTOMER",
                        label: (
                            <span style={{ fontSize: 15, fontWeight: 500 }}>
                                Thiết bị khách hàng
                                {customerData?.meta?.total !== undefined && (
                                    <Tag color="orange" style={{ marginLeft: 8 }}>
                                        {customerData.meta.total}
                                    </Tag>
                                )}
                            </span>
                        ),
                        children: renderDeviceTable(
                            "CUSTOMER",
                            customerData,
                            isCustomerFetching,
                            customerFilters,
                            dispatchCustomerFilters,
                            customerQuery,
                            setCustomerQuery
                        ),
                    },
                ]}
                size="large"
                style={{
                    background: "#fff",
                    padding: "0 24px",
                    borderRadius: 8,
                }}
            />

            <Suspense fallback={null}>
                <DeviceModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                />

                <ViewDevice
                    open={openView}
                    onClose={setOpenView}
                    deviceId={selectedId}
                />
                {openParts && partsDeviceId && (
                    <DevicePartModal
                        open={openParts}
                        onClose={() => setOpenParts(false)}
                        deviceId={partsDeviceId}
                    />
                )}
                {openSchedule && scheduleDeviceId && (
                    <DeviceMaintenanceScheduleModal
                        open={openSchedule}
                        onClose={() => setOpenSchedule(false)}
                        deviceId={scheduleDeviceId}
                    />
                )}

            </Suspense>
        </div>
    );
};

export default DevicePage;
