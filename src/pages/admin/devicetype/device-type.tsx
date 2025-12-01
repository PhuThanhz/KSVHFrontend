import { useEffect, useRef, useState } from "react";
import { Button, Space, Tag, Popconfirm } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import queryString from "query-string";
import dayjs from "dayjs";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";

import type { IDeviceType } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { sfLike } from "spring-filter-query-builder";

import { useDeviceTypesQuery, useDeleteDeviceTypeMutation } from "@/hooks/useDeviceTypes";
import { callFetchAssetType } from "@/config/api";

import ModalDeviceType from "@/pages/admin/devicetype/modal.device-type";
import ViewDetailDeviceType from "@/pages/admin/devicetype/view.device-type";

const DeviceTypePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IDeviceType | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [searchValue, setSearchValue] = useState<string>("");
    const [assetTypeFilter, setAssetTypeFilter] = useState<string | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    const [assetTypeOptions, setAssetTypeOptions] = useState<{ label: string; value: string }[]>([]);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useDeviceTypesQuery(query);
    const { mutateAsync: deleteDeviceType, isPending: isDeleting } = useDeleteDeviceTypeMutation();

    // ==================================================================
    // FETCH ASSET TYPE OPTIONS
    // ==================================================================
    useEffect(() => {
        const fetchAssetTypes = async () => {
            try {
                const res = await callFetchAssetType("page=1&size=100");
                if (res?.data?.result) {
                    const list = res.data.result.map((a: any) => ({
                        label: a.assetTypeName,
                        value: a.assetTypeName,
                    }));
                    setAssetTypeOptions(list);
                }
            } catch (error) {
                console.error("Failed to fetch asset types:", error);
            }
        };
        fetchAssetTypes();
    }, []);

    // ==================================================================
    // AUTO BUILD QUERY WHEN FILTERS CHANGE
    // ==================================================================
    useEffect(() => {
        const q: any = {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            sort: "createdAt,desc",
        };

        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(`(typeName~'${searchValue}' or deviceTypeCode~'${searchValue}')`);
        }

        if (assetTypeFilter) {
            filterParts.push(`assetType.assetTypeName='${assetTypeFilter}'`);
        }

        if (createdAtFilter) {
            filterParts.push(createdAtFilter);
        }

        if (filterParts.length > 0) q.filter = filterParts.join(" and ");

        setQuery(queryString.stringify(q, { encode: false }));
    }, [searchValue, assetTypeFilter, createdAtFilter]);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const deviceTypes = data?.result ?? [];

    // ==================================================================
    // BUILD QUERY (FOR SORT & PAGINATION)
    // ==================================================================
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        const parts: string[] = [];

        if (searchValue)
            parts.push(`(typeName~'${searchValue}' or deviceTypeCode~'${searchValue}')`);
        if (assetTypeFilter) parts.push(`assetType.assetTypeName='${assetTypeFilter}'`);
        if (createdAtFilter) parts.push(createdAtFilter);

        if (parts.length > 0) q.filter = parts.join(" and ");

        let temp = queryString.stringify(q, { encode: false });

        let sortBy = "";
        if (sort?.typeName)
            sortBy = sort.typeName === "ascend" ? "sort=typeName,asc" : "sort=typeName,desc";
        else if (sort?.deviceTypeCode)
            sortBy =
                sort.deviceTypeCode === "ascend"
                    ? "sort=deviceTypeCode,asc"
                    : "sort=deviceTypeCode,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    // ==================================================================
    // RELOAD FILTERS
    // ==================================================================
    const reloadTable = () => {
        setSearchValue("");
        setAssetTypeFilter(null);
        setCreatedAtFilter(null);
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
        );
    };

    // ==================================================================
    // COLUMNS
    // ==================================================================
    const columns: ProColumns<IDeviceType>[] = [
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
            title: "Mã loại thiết bị",
            dataIndex: "deviceTypeCode",
            sorter: true,
        },
        {
            title: "Tên loại thiết bị",
            dataIndex: "typeName",
            sorter: true,
        },
        {
            title: "Loại tài sản",
            dataIndex: ["assetType", "assetTypeName"],
            render: (_, record) =>
                record.assetType?.assetTypeName ? (
                    <Tag color="blue">{record.assetType.assetTypeName}</Tag>
                ) : (
                    <Tag color="default">Chưa có</Tag>
                ),
            hideInSearch: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            sorter: true,
            hideInSearch: true,
            render: (text: any) => (text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "-"),
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 160,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.DEVICE_TYPES.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.DEVICE_TYPES.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#fa8c16", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.DEVICE_TYPES.DELETE} hideChildren>
                        <Popconfirm
                            title="Xóa loại thiết bị?"
                            description="Bạn có chắc muốn xóa loại thiết bị này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading: isDeleting }}
                            onConfirm={() => entity.id && deleteDeviceType(entity.id)}
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
            title="Quản lý loại thiết bị"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm theo mã hoặc tên loại thiết bị..."
                        addLabel="Thêm loại thiết bị"
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
                                    key: "assetType",
                                    label: "Loại tài sản",
                                    options: assetTypeOptions,
                                },
                            ]}
                            onChange={(filters) => {
                                setAssetTypeFilter(filters.assetType || null);
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
            <Access permission={ALL_PERMISSIONS.DEVICE_TYPES.GET_PAGINATE}>
                <DataTable<IDeviceType>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching || isDeleting}
                    columns={columns}
                    dataSource={deviceTypes}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: deviceTypes,
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
                                loại thiết bị
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            <ModalDeviceType
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailDeviceType
                onClose={setOpenViewDetail}
                open={openViewDetail}
                deviceTypeId={selectedId}
            />
        </PageContainer>
    );
};

export default DeviceTypePage;
