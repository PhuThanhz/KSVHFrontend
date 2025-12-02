import { lazy, Suspense, useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Button, Space, Tag, } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import queryString from "query-string";
import type { ProColumns, ActionType } from "@ant-design/pro-components";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { useDevicesQuery } from "@/hooks/useDevices";
import { useDepartmentsQuery } from "@/hooks/useDepartments";
import { useCompaniesQuery } from "@/hooks/useCompanies";
import { useDeviceTypesQuery } from "@/hooks/useDeviceTypes";
import type { IDeviceList } from "@/types/backend";

// Lazy load modals
const DeviceModal = lazy(() => import("@/pages/admin/device/modal/DeviceModal"));
const ViewDevice = lazy(() => import("@/pages/admin/device/modal/view.device"));
const DevicePartModal = lazy(() => import("@/pages/admin/device/modal/DevicePartModal"));
const DeviceMaintenanceScheduleModal = lazy(() =>
    import("@/pages/admin/device/modal/DeviceMaintenanceScheduleModal")
);

const DevicePage = () => {
    // ===================== Modal states =====================
    const [openModal, setOpenModal] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openParts, setOpenParts] = useState(false);
    const [openSchedule, setOpenSchedule] = useState(false);

    const [dataInit, setDataInit] = useState<{ id?: string | number | null } | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [partsDeviceId, setPartsDeviceId] = useState<string | null>(null);
    const [scheduleDeviceId, setScheduleDeviceId] = useState<string | null>(null);

    // ===================== Filter states =====================
    const [searchValue, setSearchValue] = useState<string>("");
    const [ownershipTypeFilter, setOwnershipTypeFilter] = useState<string | null>(null);
    const [companyFilter, setCompanyFilter] = useState<string | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const [deviceTypeFilter, setDeviceTypeFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    // ===================== Query state =====================
    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
    );

    const tableRef = useRef<ActionType>(null);

    // ===================== Data fetching =====================
    const { data, isFetching } = useDevicesQuery(query);
    const { data: companiesData } = useCompaniesQuery("page=1&size=100");
    const { data: departmentsData } = useDepartmentsQuery("page=1&size=100");
    const { data: deviceTypesData } = useDeviceTypesQuery("page=1&size=100");

    // ===================== Options for filters =====================
    const ownershipTypeOptions = [
        { label: "Nội bộ", value: "INTERNAL", color: "green" },
        { label: "Khách hàng", value: "CUSTOMER", color: "orange" },
    ];

    const companyOptions = useMemo(
        () => companiesData?.result?.map((c) => ({
            label: c.name,
            value: c.name,
            color: "cyan"
        })) ?? [],
        [companiesData]
    );

    const departmentOptions = useMemo(
        () => departmentsData?.result?.map((d) => ({
            label: d.name,
            value: d.name,
            color: "purple"
        })) ?? [],
        [departmentsData]
    );

    const deviceTypeOptions = useMemo(
        () => deviceTypesData?.result?.map((dt) => ({
            label: dt.typeName,
            value: dt.typeName,
            color: "blue"
        })) ?? [],
        [deviceTypesData]
    );

    const statusOptions = [
        { label: "Thêm Mới", value: "NEW", color: "blue" },
        { label: "Đang sử dụng", value: "IN_USE", color: "green" },
        { label: "Trong kho", value: "IN_STORAGE", color: "gold" },
        { label: "Ngưng sử dụng", value: "NOT_IN_USE", color: "volcano" },
        { label: "Đã thanh lý", value: "LIQUIDATED", color: "red" },
    ];

    // ===================== Auto update query when filters change =====================
    useEffect(() => {
        const q: any = {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            sort: "createdAt,desc",
        };

        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(`(deviceName~'${searchValue}' or deviceCode~'${searchValue}')`);
        }
        if (ownershipTypeFilter) filterParts.push(`ownershipType='${ownershipTypeFilter}'`);
        if (companyFilter) filterParts.push(`company.name='${companyFilter}'`);
        if (departmentFilter) filterParts.push(`department.name='${departmentFilter}'`);
        if (deviceTypeFilter) filterParts.push(`deviceType.name='${deviceTypeFilter}'`);
        if (statusFilter) filterParts.push(`status='${statusFilter}'`);
        if (createdAtFilter) filterParts.push(createdAtFilter);

        if (filterParts.length > 0) {
            q.filter = filterParts.join(" and ");
        }

        const built = queryString.stringify(q, { encode: false });
        setQuery(built);
    }, [searchValue, ownershipTypeFilter, companyFilter, departmentFilter, deviceTypeFilter, statusFilter, createdAtFilter]);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const devices = data?.result ?? [];

    // ===================== Handlers =====================
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

    const handleViewSchedule = useCallback((deviceId: string) => {
        setScheduleDeviceId(deviceId);
        setOpenSchedule(true);
    }, []);

    const resetFilters = () => {
        setSearchValue("");
        setOwnershipTypeFilter(null);
        setCompanyFilter(null);
        setDepartmentFilter(null);
        setDeviceTypeFilter(null);
        setStatusFilter(null);
        setCreatedAtFilter(null);
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
        );
    };

    // ===================== Build query for sort/pagination =====================
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(`(deviceName~'${searchValue}' or deviceCode~'${searchValue}')`);
        }
        if (ownershipTypeFilter) filterParts.push(`ownershipType='${ownershipTypeFilter}'`);
        if (companyFilter) filterParts.push(`company.name='${companyFilter}'`);
        if (departmentFilter) filterParts.push(`department.name='${departmentFilter}'`);
        if (deviceTypeFilter) filterParts.push(`deviceType.name='${deviceTypeFilter}'`);
        if (statusFilter) filterParts.push(`status='${statusFilter}'`);
        if (createdAtFilter) filterParts.push(createdAtFilter);

        if (filterParts.length > 0) {
            q.filter = filterParts.join(" and ");
        }

        let temp = queryString.stringify(q, { encode: false });

        let sortBy = "sort=createdAt,desc";
        if (sort?.deviceName) {
            sortBy = `sort=deviceName,${sort.deviceName === "ascend" ? "asc" : "desc"}`;
        } else if (sort?.deviceCode) {
            sortBy = `sort=deviceCode,${sort.deviceCode === "ascend" ? "asc" : "desc"}`;
        }

        return `${temp}&${sortBy}`;
    };

    // ===================== Columns =====================
    const columns: ProColumns<IDeviceList>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index + 1 + ((meta.page || 1) - 1) * (meta.pageSize || 10),
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
            sorter: true,
        },
        {
            title: "Loại sở hữu",
            dataIndex: "ownershipType",
            hideInSearch: true,
            render: (value) => {
                return value === "INTERNAL" ? (
                    <Tag color="green">Nội bộ</Tag>
                ) : value === "CUSTOMER" ? (
                    <Tag color="orange">Khách hàng</Tag>
                ) : (
                    <Tag>-</Tag>
                );
            },
        },
        {
            title: "Loại thiết bị",
            dataIndex: "deviceTypeName",
            hideInSearch: true,
            render: (text) => text ? <Tag color="blue">{text}</Tag> : "-",
        },
        {
            title: "Phòng ban / Nhà hàng",
            dataIndex: "departmentName",
            hideInSearch: true,
            render: (text) => text ? <Tag color="purple">{text}</Tag> : "-",
        },
        {
            title: "Nhà cung cấp",
            dataIndex: "supplierName",
            hideInSearch: true,
            render: (text) => text ? <Tag color="geekblue">{text}</Tag> : "-",
        },
        {
            title: "Công ty",
            dataIndex: "companyName",
            hideInSearch: true,
            render: (text) => text ? <Tag color="cyan">{text}</Tag> : "-",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            hideInSearch: true,
            render: (value: any) => {
                const statusMap: Record<string, { text: string; color: string }> = {
                    NEW: { text: "Thêm Mới", color: "blue" },
                    IN_USE: { text: "Đang sử dụng", color: "green" },
                    IN_STORAGE: { text: "Trong kho", color: "gold" },
                    NOT_IN_USE: { text: "Ngưng sử dụng", color: "volcano" },
                    LIQUIDATED: { text: "Đã thanh lý", color: "red" },
                };
                const item = statusMap[value];
                return item ? (
                    <Tag color={item.color}>{item.text}</Tag>
                ) : (
                    <Tag>-</Tag>
                );
            },
        },

        {
            title: "Hành động",
            hideInSearch: true,
            width: 150,
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
    ];

    // ===================== Main Render =====================
    return (
        <PageContainer
            title="Quản lý thiết bị"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm theo tên hoặc mã thiết bị..."
                        addLabel="Thêm thiết bị"
                        showFilterButton={false}
                        onSearch={(val) => setSearchValue(val)}
                        onReset={resetFilters}
                        onAddClick={handleCreate}
                    />

                    <div className="flex flex-wrap gap-3 items-center">
                        <AdvancedFilterSelect
                            fields={[
                                {
                                    key: "ownershipType",
                                    label: "Loại sở hữu",
                                    options: ownershipTypeOptions,
                                },
                                {
                                    key: "company",
                                    label: "Công ty",
                                    options: companyOptions,
                                },
                                {
                                    key: "department",
                                    label: "Phòng ban",
                                    options: departmentOptions,
                                },
                                {
                                    key: "deviceType",
                                    label: "Loại thiết bị",
                                    options: deviceTypeOptions,
                                },
                                {
                                    key: "status",
                                    label: "Trạng thái",
                                    options: statusOptions,
                                },
                            ]}
                            onChange={(filters) => {
                                setOwnershipTypeFilter(filters.ownershipType || null);
                                setCompanyFilter(filters.company || null);
                                setDepartmentFilter(filters.department || null);
                                setDeviceTypeFilter(filters.deviceType || null);
                                setStatusFilter(filters.status || null);
                            }}
                        />

                        <DateRangeFilter
                            fieldName="createdAt"
                            onChange={(filter) => setCreatedAtFilter(filter)}
                        />
                    </div>
                </div>
            }
        >
            <Access permission={ALL_PERMISSIONS.DEVICE.GET_PAGINATE}>
                <DataTable<IDeviceList>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={devices}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: devices,
                            success: true,
                            total: meta.total,
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
                                <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                    {total.toLocaleString()}
                                </span>{" "}
                                thiết bị
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            {/* Modals */}
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
        </PageContainer>
    );
};

export default DevicePage;