import DataTable from "@/components/common/data-table";
import type { IInventoryItem } from "@/types/backend";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Select, Space, Tag } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";

import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import {
    useInventoryItemsQuery,
    useDeleteInventoryItemMutation,
} from "@/hooks/useInventoryItems";
import ModalInventoryItem from "@/pages/admin/inventory-item/modal.inventory-item";
import ViewInventoryItem from "@/pages/admin/inventory-item/view.inventory-item";
import { formatCurrency } from "@/utils/format";
import { useUnitsQuery } from "@/hooks/useUnits";
import { useDeviceTypesQuery } from "@/hooks/useDeviceTypes";
import { useWarehousesQuery } from "@/hooks/useWarehouses";
import { useMaterialSuppliersQuery } from "@/hooks/useMaterialSuppliers";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";

const InventoryItemPage = () => {
    /** ==================== STATE ==================== */
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IInventoryItem | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );
    // Bộ lọc nâng cao
    const [unitFilter, setUnitFilter] = useState<string | null>(null);
    const [deviceTypeFilter, setDeviceTypeFilter] = useState<string | null>(null);
    const [warehouseFilter, setWarehouseFilter] = useState<string | null>(null);
    const [supplierFilter, setSupplierFilter] = useState<string | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    /** ==================== HOOKS ==================== */
    const { data, isFetching } = useInventoryItemsQuery(query);
    const { mutate: deleteItem, isPending: isDeleting } = useDeleteInventoryItemMutation();

    const { data: unitsData } = useUnitsQuery("page=1&size=100");
    const { data: deviceTypesData } = useDeviceTypesQuery("page=1&size=100");
    const { data: warehousesData } = useWarehousesQuery("page=1&size=100");
    const { data: suppliersData } = useMaterialSuppliersQuery("page=1&size=100");

    /** ==================== MAP OPTIONS ==================== */
    const unitOptions =
        unitsData?.result?.map((u) => ({ label: u.name, value: u.name })) || [];
    const deviceTypeOptions =
        deviceTypesData?.result?.map((d) => ({ label: d.typeName, value: d.typeName })) || [];
    const warehouseOptions =
        warehousesData?.result?.map((w) => ({ label: w.warehouseName, value: w.warehouseName })) || [];
    const supplierOptions =
        suppliersData?.result?.map((s) => ({ label: s.supplierName, value: s.supplierName })) || [];

    /** ==================== BUILD QUERY ==================== */
    const buildQuery = (params: any, sort: any) => {
        const q: any = { page: params.current, size: params.pageSize, filter: "" };

        // Tên hoặc mã vật tư
        if (params.itemName)
            q.filter = sfLike("itemName", params.itemName);
        if (params.itemCode)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("itemCode", params.itemCode)}`
                : sfLike("itemCode", params.itemCode);

        // Bộ lọc nâng cao
        if (unitFilter)
            q.filter = q.filter
                ? `${q.filter} and unit.name='${unitFilter}'`
                : `unit.name='${unitFilter}'`;

        if (deviceTypeFilter)
            q.filter = q.filter
                ? `${q.filter} and deviceType.typeName='${deviceTypeFilter}'`
                : `deviceType.typeName='${deviceTypeFilter}'`;

        if (warehouseFilter)
            q.filter = q.filter
                ? `${q.filter} and warehouse.warehouseName='${warehouseFilter}'`
                : `warehouse.warehouseName='${warehouseFilter}'`;

        if (supplierFilter)
            q.filter = q.filter
                ? `${q.filter} and materialSupplier.supplierName='${supplierFilter}'`
                : `materialSupplier.supplierName='${supplierFilter}'`;

        if (createdAtFilter)
            q.filter = q.filter
                ? `${q.filter} and ${createdAtFilter}`
                : createdAtFilter;

        if (!q.filter) delete q.filter;

        // Sort
        let sortBy = "sort=createdAt,desc";
        if (sort?.itemName)
            sortBy = sort.itemName === "ascend" ? "sort=itemName,asc" : "sort=itemName,desc";
        else if (sort?.itemCode)
            sortBy = sort.itemCode === "ascend" ? "sort=itemCode,asc" : "sort=itemCode,desc";

        return `${queryString.stringify(q)}&${sortBy}`;
    };

    /** ==================== COLUMNS ==================== */
    const columns: ProColumns<IInventoryItem>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_, __, index) =>
                (index + 1) +
                ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            hideInSearch: true,
        },
        { title: "Mã vật tư", dataIndex: "itemCode", sorter: true },
        { title: "Tên vật tư", dataIndex: "itemName", sorter: true },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            align: "center",
            hideInSearch: true,
            render: (_, record) => <Tag color="blue">{record.quantity}</Tag>,
        },
        {
            title: "Đơn giá",
            dataIndex: "unitPrice",
            align: "right",
            hideInSearch: true,
            render: (_, record) => formatCurrency(record.unitPrice ?? 0),
        },
        {
            title: "Đơn vị",
            dataIndex: ["unit", "name"],
            hideInSearch: true,
        },
        {
            title: "Loại thiết bị",
            dataIndex: ["deviceType", "typeName"],
            hideInSearch: true,
        },
        {
            title: "Kho",
            dataIndex: ["warehouse", "warehouseName"],
            hideInSearch: true,
        },
        {
            title: "Nhà cung cấp",
            dataIndex: ["materialSupplier", "supplierName"],
            hideInSearch: true,
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 160,
            align: "center",
            render: (_, entity) => (
                <Space size="middle">
                    {/* Xem chi tiết */}
                    <Access permission={ALL_PERMISSIONS.INVENTORY_ITEM.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    {/* Sửa */}
                    <Access permission={ALL_PERMISSIONS.INVENTORY_ITEM.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#faad14", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    {/* Xóa */}
                    <Access permission={ALL_PERMISSIONS.INVENTORY_ITEM.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa vật tư?"
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading: isDeleting }}
                            onConfirm={() => {
                                if (entity.id) deleteItem(entity.id);
                            }}
                        >
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "#ff4d4f", cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    /** ==================== RENDER ==================== */
    return (
        <div>
            <Access permission={ALL_PERMISSIONS.INVENTORY_ITEM.GET_PAGINATE}>
                <DataTable<IInventoryItem>
                    headerTitle="Danh sách vật tư tồn kho"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={data?.result || []}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: data?.result || [],
                            success: true,
                            total: data?.meta?.total || 0,
                        });
                    }}
                    pagination={{
                        defaultPageSize: 10,
                        current: data?.meta?.page,
                        pageSize: data?.meta?.pageSize,
                        showSizeChanger: true,
                        total: data?.meta?.total,
                        showQuickJumper: true,
                        showTotal: (total, range) => (
                            <div style={{ fontSize: 13, color: "#595959" }}>
                                <span style={{ fontWeight: 500, color: "#000" }}>
                                    {range[0]}–{range[1]}
                                </span>{" "}
                                trên{" "}
                                <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                    {total.toLocaleString()}
                                </span>{" "}
                                vật tư
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
                                placeholder="Đơn vị"
                                allowClear
                                style={{ width: 160 }}
                                options={unitOptions}
                                onChange={(v) => setUnitFilter(v || null)}
                            />
                            <Select
                                placeholder="Loại thiết bị"
                                allowClear
                                style={{ width: 180 }}
                                options={deviceTypeOptions}
                                onChange={(v) => setDeviceTypeFilter(v || null)}
                            />
                            <Select
                                placeholder="Kho chứa"
                                allowClear
                                style={{ width: 180 }}
                                options={warehouseOptions}
                                onChange={(v) => setWarehouseFilter(v || null)}
                            />
                            <Select
                                placeholder="Nhà cung cấp"
                                allowClear
                                style={{ width: 200 }}
                                options={supplierOptions}
                                onChange={(v) => setSupplierFilter(v || null)}
                            />
                            <DateRangeFilter
                                label="Ngày tạo"
                                fieldName="createdAt"
                                width={300}
                                onChange={(filterStr) => setCreatedAtFilter(filterStr)}
                            />
                            <Access permission={ALL_PERMISSIONS.INVENTORY_ITEM.CREATE} hideChildren>
                                <Button
                                    icon={<PlusOutlined />}
                                    type="primary"
                                    onClick={() => {
                                        setDataInit(null);
                                        setOpenModal(true);
                                    }}
                                >
                                    Thêm mới
                                </Button>
                            </Access>
                        </Space>,
                    ]}
                />
            </Access>

            <ModalInventoryItem
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewInventoryItem
                onClose={setOpenViewDetail}
                open={openViewDetail}
                itemId={selectedId}
            />
        </div>
    );
};

export default InventoryItemPage;
