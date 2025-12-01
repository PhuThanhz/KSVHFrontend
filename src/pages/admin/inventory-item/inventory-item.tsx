import { useEffect, useRef, useState } from "react";
import { Button, Space, Tag, Popconfirm } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import dayjs from "dayjs";
import queryString from "query-string";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";

import type { IInventoryItem } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { sfLike } from "spring-filter-query-builder";

import {
    useInventoryItemsQuery,
    useDeleteInventoryItemMutation,
} from "@/hooks/useInventoryItems";
import { useUnitsQuery } from "@/hooks/useUnits";
import { useDeviceTypesQuery } from "@/hooks/useDeviceTypes";
import { useWarehousesQuery } from "@/hooks/useWarehouses";
import { useMaterialSuppliersQuery } from "@/hooks/useMaterialSuppliers";

import ModalInventoryItem from "@/pages/admin/inventory-item/modal.inventory-item";
import ViewInventoryItem from "@/pages/admin/inventory-item/view.inventory-item";
import { formatCurrency } from "@/utils/format";

const InventoryItemPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IInventoryItem | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // FILTER STATES
    const [unitFilter, setUnitFilter] = useState<string | null>(null);
    const [deviceTypeFilter, setDeviceTypeFilter] = useState<string | null>(null);
    const [warehouseFilter, setWarehouseFilter] = useState<string | null>(null);
    const [supplierFilter, setSupplierFilter] = useState<string | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useInventoryItemsQuery(query);
    const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteInventoryItemMutation();

    const { data: unitsData } = useUnitsQuery("page=1&size=100");
    const { data: deviceTypesData } = useDeviceTypesQuery("page=1&size=100");
    const { data: warehousesData } = useWarehousesQuery("page=1&size=100");
    const { data: suppliersData } = useMaterialSuppliersQuery("page=1&size=100");

    // MAP OPTIONS
    const unitOptions =
        unitsData?.result?.map((u) => ({ label: u.name, value: u.name })) || [];
    const deviceTypeOptions =
        deviceTypesData?.result?.map((d) => ({ label: d.typeName, value: d.typeName })) || [];
    const warehouseOptions =
        warehousesData?.result?.map((w) => ({ label: w.warehouseName, value: w.warehouseName })) || [];
    const supplierOptions =
        suppliersData?.result?.map((s) => ({ label: s.supplierName, value: s.supplierName })) || [];

    // ==================================================================
    // Auto rebuild query when filters change
    // ==================================================================
    useEffect(() => {
        const q: any = {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            sort: "createdAt,desc",
        };

        const filters: string[] = [];

        if (searchValue) {
            filters.push(`(itemName~'${searchValue}' or itemCode~'${searchValue}')`);
        }
        if (unitFilter) filters.push(`unit.name='${unitFilter}'`);
        if (deviceTypeFilter) filters.push(`deviceType.typeName='${deviceTypeFilter}'`);
        if (warehouseFilter) filters.push(`warehouse.warehouseName='${warehouseFilter}'`);
        if (supplierFilter) filters.push(`materialSupplier.supplierName='${supplierFilter}'`);
        if (createdAtFilter) filters.push(createdAtFilter);

        if (filters.length > 0) q.filter = filters.join(" and ");

        const built = queryString.stringify(q, { encode: false });
        setQuery(built);
    }, [searchValue, unitFilter, deviceTypeFilter, warehouseFilter, supplierFilter, createdAtFilter]);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const items = data?.result ?? [];

    /** Xây dựng query filter cho DataTable sort/pagination */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            filter: "",
        };

        const parts: string[] = [];

        if (searchValue)
            parts.push(`(itemName~'${searchValue}' or itemCode~'${searchValue}')`);
        if (unitFilter) parts.push(`unit.name='${unitFilter}'`);
        if (deviceTypeFilter) parts.push(`deviceType.typeName='${deviceTypeFilter}'`);
        if (warehouseFilter) parts.push(`warehouse.warehouseName='${warehouseFilter}'`);
        if (supplierFilter) parts.push(`materialSupplier.supplierName='${supplierFilter}'`);
        if (createdAtFilter) parts.push(createdAtFilter);

        if (parts.length > 0) q.filter = parts.join(" and ");

        let temp = queryString.stringify(q, { encode: false });

        let sortBy = "";
        if (sort?.itemName)
            sortBy = sort.itemName === "ascend" ? "sort=itemName,asc" : "sort=itemName,desc";
        else if (sort?.itemCode)
            sortBy = sort.itemCode === "ascend" ? "sort=itemCode,asc" : "sort=itemCode,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    const reloadTable = () => {
        setSearchValue("");
        setUnitFilter(null);
        setDeviceTypeFilter(null);
        setWarehouseFilter(null);
        setSupplierFilter(null);
        setCreatedAtFilter(null);
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
        );
    };

    // ==================================================================
    // COLUMNS
    // ==================================================================
    const columns: ProColumns<IInventoryItem>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index + 1 + ((meta.page || 1) - 1) * (meta.pageSize || 10),
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
        { title: "Đơn vị", dataIndex: ["unit", "name"], hideInSearch: true },
        { title: "Loại thiết bị", dataIndex: ["deviceType", "typeName"], hideInSearch: true },
        { title: "Kho chứa", dataIndex: ["warehouse", "warehouseName"], hideInSearch: true },
        { title: "Nhà cung cấp", dataIndex: ["materialSupplier", "supplierName"], hideInSearch: true },
        {
            title: "Hành động",
            hideInSearch: true,
            align: "center",
            width: 140,
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.INVENTORY_ITEM.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.INVENTORY_ITEM.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#fa8c16", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.INVENTORY_ITEM.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa vật tư"
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading: isDeleting }}
                            onConfirm={() => entity.id && deleteItem(entity.id)}
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

    // ==================================================================
    // RENDER
    // ==================================================================
    return (
        <PageContainer
            title="Quản lý vật tư tồn kho"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm theo mã hoặc tên vật tư..."
                        addLabel="Thêm vật tư"
                        showFilterButton={false}
                        onSearch={(val) => setSearchValue(val)}
                        onReset={reloadTable}
                        onAddClick={() => {
                            setDataInit(null);
                            setOpenModal(true);
                        }}
                    />
                    <div className="flex flex-wrap gap-3 items-center">
                        <AdvancedFilterSelect
                            fields={[
                                {
                                    key: "unit",
                                    label: "Đơn vị",
                                    options: unitOptions,
                                },
                                {
                                    key: "deviceType",
                                    label: "Loại thiết bị",
                                    options: deviceTypeOptions,
                                },
                                {
                                    key: "warehouse",
                                    label: "Kho chứa",
                                    options: warehouseOptions,
                                },
                                {
                                    key: "supplier",
                                    label: "Nhà cung cấp",
                                    options: supplierOptions,
                                },
                            ]}
                            onChange={(filters) => {
                                setUnitFilter(filters.unit || null);
                                setDeviceTypeFilter(filters.deviceType || null);
                                setWarehouseFilter(filters.warehouse || null);
                                setSupplierFilter(filters.supplier || null);
                            }}
                        />
                        <DateRangeFilter
                            label="Ngày tạo"
                            fieldName="createdAt"
                            onChange={(filter) => setCreatedAtFilter(filter)}
                        />
                    </div>
                </div>
            }
        >
            <Access permission={ALL_PERMISSIONS.INVENTORY_ITEM.GET_PAGINATE}>
                <DataTable<IInventoryItem>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={items}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: items,
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
                                vật tư
                            </div>
                        ),
                    }}
                    rowSelection={false}
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
        </PageContainer>
    );
};

export default InventoryItemPage;
