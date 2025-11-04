import { lazy, Suspense, useCallback, useMemo, useReducer, useState } from "react";
import { Button, Popconfirm, Select, Space, Tag, Tabs } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";

import DataTable from "@/components/admin/data-table";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useDevicesQuery, useDeleteDeviceMutation } from "@/hooks/useDevices";
import { useDepartmentsQuery } from "@/hooks/useDepartments";
import { useCompaniesQuery } from "@/hooks/useCompanies";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import type { IDevice, IDeviceList } from "@/types/backend";
import type { ProColumns } from "@ant-design/pro-components";

// Lazy load modals
const CreateDeviceModal = lazy(() => import("@/components/admin/device/CreateDeviceModal"));
const UpdateDeviceModal = lazy(() => import("@/components/admin/device/UpdateDeviceModal"));
const ViewDevice = lazy(() => import("@/components/admin/device/view.device"));

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
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [dataInit, setDataInit] = useState<IDevice | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"INTERNAL" | "CUSTOMER">("INTERNAL");

    /** ===================== Filters & query cho từng tab ===================== */
    const [internalFilters, dispatchInternalFilters] = useReducer(filterReducer, {});
    const [customerFilters, dispatchCustomerFilters] = useReducer(filterReducer, {});

    const [internalQuery, setInternalQuery] = useState(() =>
        queryString.stringify({ page: 1, size: 10, sort: "createdAt,desc", filter: "ownershipType='INTERNAL'" }, { encode: false })
    );
    const [customerQuery, setCustomerQuery] = useState(() =>
        queryString.stringify({ page: 1, size: 10, sort: "createdAt,desc", filter: "ownershipType='CUSTOMER'" }, { encode: false })
    );

    /** ===================== Hooks ===================== */
    const { data: internalData, isFetching: isInternalFetching } = useDevicesQuery(internalQuery);
    const { data: customerData, isFetching: isCustomerFetching } = useDevicesQuery(customerQuery);
    const { mutate: deleteDevice, isPending: isDeleting } = useDeleteDeviceMutation();
    const { data: companiesData } = useCompaniesQuery("page=1&size=100");
    const { data: departmentsData } = useDepartmentsQuery("page=1&size=100");

    /** ===================== Select options ===================== */
    const companyOptions = useMemo(
        () => companiesData?.result?.map((c) => ({ label: c.name, value: c.name })) ?? [],
        [companiesData]
    );

    const departmentOptions = useMemo(
        () => departmentsData?.result?.map((d) => ({ label: d.name, value: d.name })) ?? [],
        [departmentsData]
    );

    /** ===================== Build Query ===================== */
    const buildQuery = useCallback(
        (params: any, sort: any, ownershipType: "INTERNAL" | "CUSTOMER", filters: FilterState) => {
            const q: any = { page: params.current || 1, size: 10 };
            let filter = `ownershipType='${ownershipType}'`;

            if (params.deviceName)
                filter += ` and ${sfLike("deviceName", params.deviceName)}`;

            if (params.deviceCode)
                filter += ` and ${sfLike("deviceCode", params.deviceCode)}`;

            if (filters.company)
                filter += ` and company.name='${filters.company}'`;

            if (filters.department)
                filter += ` and department.name='${filters.department}'`;

            if (filters.status)
                filter += ` and status='${filters.status}'`;

            if (filters.createdAt)
                filter += ` and ${filters.createdAt}`;

            q.filter = filter;

            // sort
            let sortBy = "sort=createdAt,desc";
            if (sort?.deviceName)
                sortBy = `sort=deviceName,${sort.deviceName === "ascend" ? "asc" : "desc"}`;
            else if (sort?.deviceCode)
                sortBy = `sort=deviceCode,${sort.deviceCode === "ascend" ? "asc" : "desc"}`;

            return `${queryString.stringify(q, { encode: false })}&${sortBy}`;
        },
        []
    );

    /** ===================== Table columns ===================== */
    const getColumns = useCallback((data: any): ProColumns<IDeviceList>[] => [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_: any, __: any, index: number) =>
                index + 1 + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
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
                const map: Record<string, { text: string; color: string }> = {
                    NEW: { text: "Thêm Mới", color: "blue" },
                    IN_USE: { text: "Đang sử dụng", color: "green" },
                    IN_STORAGE: { text: "Trong kho", color: "gold" },
                    NOT_IN_USE: { text: "Ngưng sử dụng", color: "volcano" },
                    LIQUIDATED: { text: "Đã thanh lý", color: "red" },
                };
                const item = map[v];
                return item ? <Tag color={item.color}>{item.text}</Tag> : <Tag>-</Tag>;
            },
        },
        {
            title: "Hành động",
            width: 150,
            align: "center",
            render: (_: any, entity: IDeviceList) => (
                <Space size="middle">
                    <Access permission={ALL_PERMISSIONS.DEVICE.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(String(entity.id));
                                setOpenView(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.DEVICE.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#faad14", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity as IDevice);
                                setOpenEdit(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.DEVICE.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa thiết bị?"
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading: isDeleting }}
                            onConfirm={() => entity.id && deleteDevice(entity.id)}
                        >
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "#ff4d4f", cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ], [deleteDevice, isDeleting]);

    /** ===================== Render Device Table ===================== */
    const renderDeviceTable = (
        ownershipType: "INTERNAL" | "CUSTOMER",
        data: any,
        isFetching: boolean,
        filters: FilterState,
        dispatchFilters: React.Dispatch<Partial<FilterState>>,
        query: string,
        setQuery: (q: string) => void
    ) => {
        const title = ownershipType === "INTERNAL" ? "Thiết bị nội bộ" : "Thiết bị khách hàng";
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
                    showSizeChanger: true,
                    total: data?.meta?.total,
                    showQuickJumper: true,
                    size: "default",
                    showTotal: (total, range) => (
                        <div style={{ fontSize: 13, color: "#595959" }}>
                            <span style={{ fontWeight: 500, color: "#000" }}>
                                {range[0]}–{range[1]}
                            </span>{" "}
                            trên{" "}
                            <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                {total.toLocaleString()}
                            </span>{" "}
                            thiết bị
                        </div>
                    ),
                    style: {
                        marginTop: 16,
                        padding: "12px 24px",
                        background: "#fff",
                        borderRadius: 8,
                        borderTop: "1px solid #f0f0f0",
                        display: "flex",
                        justifyContent: "flex-end",
                    },
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
                            onChange={(v) => dispatchFilters({ department: v || null })}
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
                            onChange={(filterStr) => dispatchFilters({ createdAt: filterStr })}
                        />
                        <Access permission={ALL_PERMISSIONS.DEVICE.CREATE} hideChildren>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => {
                                    setDataInit(null);
                                    setOpenCreate(true);
                                }}
                            >
                                Thêm mới
                            </Button>
                        </Access>
                    </Space>,
                ]}
            />
        );
    };

    /** ===================== Main Render ===================== */
    return (
        <div>
            <Access permission={ALL_PERMISSIONS.DEVICE.GET_PAGINATE}>
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key as "INTERNAL" | "CUSTOMER")}
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
                    style={{ background: "#fff", padding: "0 24px", borderRadius: 8 }}
                />
            </Access>

            <Suspense fallback={null}>
                <CreateDeviceModal openModal={openCreate} setOpenModal={setOpenCreate} />
                <UpdateDeviceModal
                    openModal={openEdit}
                    setOpenModal={setOpenEdit}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                />
                <ViewDevice open={openView} onClose={setOpenView} deviceId={selectedId} />
            </Suspense>
        </div>
    );
};

export default DevicePage;