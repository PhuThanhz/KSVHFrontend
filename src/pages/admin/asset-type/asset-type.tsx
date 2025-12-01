import { useRef, useState } from "react";
import { Button, Popconfirm, Space } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import dayjs from "dayjs";
import queryString from "query-string";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";

import type { IAssetType } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import {
    useAssetTypesQuery,
    useDeleteAssetTypeMutation,
} from "@/hooks/useAssetTypes";
import ModalAssetType from "@/pages/admin/asset-type/modal.assettype";
import ViewDetailAssetType from "@/pages/admin/asset-type/view.assettype";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { sfLike } from "spring-filter-query-builder";

const AssetTypePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IAssetType | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedAssetTypeId, setSelectedAssetTypeId] = useState<number | null>(null);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useAssetTypesQuery(query);
    const deleteMutation = useDeleteAssetTypeMutation();

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const assetTypes = data?.result ?? [];

    /** Xử lý xóa loại tài sản */
    const handleDelete = async (id?: number | string) => {
        if (!id) return;
        await deleteMutation.mutateAsync(id, {
            onSuccess: () => reloadTable(),
        });
    };

    /** Reload lại bảng */
    const reloadTable = () => {
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
        );
    };

    /** Build query cho sort/pagination/filter */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            filter: "",
        };

        if (params.assetTypeCode)
            q.filter = sfLike("assetTypeCode", params.assetTypeCode);
        if (params.assetTypeName)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("assetTypeName", params.assetTypeName)}`
                : sfLike("assetTypeName", params.assetTypeName);

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q, { encode: false });

        let sortBy = "";
        if (sort?.assetTypeName)
            sortBy =
                sort.assetTypeName === "ascend"
                    ? "sort=assetTypeName,asc"
                    : "sort=assetTypeName,desc";
        else sortBy = `sort=${PAGINATION_CONFIG.DEFAULT_SORT}`;

        return `${temp}&${sortBy}`;
    };

    /** Cấu hình cột */
    const columns: ProColumns<IAssetType>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index +
                1 +
                ((meta.page || 1) - 1) *
                (meta.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE),
            hideInSearch: true,
        },
        {
            title: "Mã loại tài sản",
            dataIndex: "assetTypeCode",
            sorter: true,
        },
        {
            title: "Tên loại tài sản",
            dataIndex: "assetTypeName",
            sorter: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            hideInSearch: true,
            render: (_, record) =>
                record.createdAt
                    ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm")
                    : "-",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            hideInSearch: true,
            render: (_, record) =>
                record.updatedAt
                    ? dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm")
                    : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 120,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.ASSET_TYPE.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{
                                fontSize: 18,
                                color: "#1677ff",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setSelectedAssetTypeId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.ASSET_TYPE.UPDATE} hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 18,
                                color: "#fa8c16",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.ASSET_TYPE.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa loại tài sản"
                            description="Bạn có chắc chắn muốn xóa loại tài sản này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(entity.id!)}
                        >
                            <DeleteOutlined
                                style={{
                                    fontSize: 18,
                                    color: "#ff4d4f",
                                    cursor: "pointer",
                                }}
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    return (
        <PageContainer
            title="Quản lý loại tài sản"
            filter={
                <SearchFilter
                    searchPlaceholder="Tìm kiếm loại tài sản..."
                    addLabel="Thêm loại tài sản"
                    showFilterButton={false}
                    onSearch={(val) =>
                        setQuery(
                            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=(assetTypeCode~'${val}' or assetTypeName~'${val}')`
                        )
                    }
                    onReset={() => reloadTable()}
                    onAddClick={() => {
                        setDataInit(null);
                        setOpenModal(true);
                    }}
                />
            }
        >
            <Access permission={ALL_PERMISSIONS.ASSET_TYPE.GET_PAGINATE}>
                <DataTable<IAssetType>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={assetTypes}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: assetTypes || [],
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
                                loại tài sản
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            {/* Modal thêm/sửa */}
            <ModalAssetType
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            {/* Drawer xem chi tiết */}
            <ViewDetailAssetType
                onClose={setOpenViewDetail}
                open={openViewDetail}
                assetTypeId={selectedAssetTypeId}
            />
        </PageContainer>
    );
};

export default AssetTypePage;
