import DataTable from "@/components/common/data-table";
import type { IAssetType } from "@/types/backend";
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Popconfirm } from "antd";
import { useState } from "react";
import queryString from "query-string";
import ModalAssetType from "@/pages/admin/asset-type/modal.assettype";
import ViewDetailAssetType from "@/pages/admin/asset-type/view.assettype";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import { useAssetTypesQuery, useDeleteAssetTypeMutation } from "@/hooks/useAssetTypes";
import DateRangeFilter from "@/components/common/filter/DateRangeFilter";
import dayjs from "dayjs";

const AssetTypePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IAssetType | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedAssetTypeId, setSelectedAssetTypeId] = useState<number | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );

    const { data, isFetching } = useAssetTypesQuery(query);
    const { mutate: deleteAssetType } = useDeleteAssetTypeMutation();

    // Hàm build query
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (params.assetTypeCode) q.filter = sfLike("assetTypeCode", params.assetTypeCode);
        if (params.assetTypeName)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("assetTypeName", params.assetTypeName)}`
                : sfLike("assetTypeName", params.assetTypeName);

        if (createdAtFilter) q.filter = q.filter ? `${q.filter} and ${createdAtFilter}` : createdAtFilter;
        if (!q.filter) delete q.filter;

        const temp = queryString.stringify(q, { encode: false });

        let sortBy = "sort=createdAt,desc";
        if (sort?.assetTypeName)
            sortBy = sort.assetTypeName === "ascend" ? "sort=assetTypeName,asc" : "sort=assetTypeName,desc";

        return `${temp}&${sortBy}`;
    };

    const columns: ProColumns<IAssetType>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_, __, index) =>
                (index + 1) + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
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
            sorter: true,
            render: (_, record) =>
                record.createdAt ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm") : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 130,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.ASSET_TYPE.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedAssetTypeId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.ASSET_TYPE.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#ffa500", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.ASSET_TYPE.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa loại tài sản này?"
                            onConfirm={() => entity.id && deleteAssetType(Number(entity.id))}
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

    return (
        <Access permission={ALL_PERMISSIONS.ASSET_TYPE.GET_PAGINATE}>
            <DataTable<IAssetType>
                headerTitle="Danh sách loại tài sản"
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={data?.result || []}
                onChange={(params, sort) => {
                    const newQuery = buildQuery(params, sort);
                    if (newQuery !== query) setQuery(newQuery);
                }}
                pagination={{
                    defaultPageSize: 10,
                    current: data?.meta?.page,
                    pageSize: data?.meta?.pageSize,
                    total: data?.meta?.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
                rowSelection={false}
                toolBarRender={() => [
                    <Space key="toolbar" size={12} align="center" wrap>
                        <DateRangeFilter
                            label="Ngày tạo"
                            fieldName="createdAt"
                            size="middle"
                            width={320}
                            onChange={(filterStr) => setCreatedAtFilter(filterStr)}
                        />
                        <Access permission={ALL_PERMISSIONS.ASSET_TYPE.CREATE} hideChildren>
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

            <ModalAssetType
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailAssetType
                onClose={setOpenViewDetail}
                open={openViewDetail}
                assetTypeId={selectedAssetTypeId}
            />
        </Access>
    );
};

export default AssetTypePage;
