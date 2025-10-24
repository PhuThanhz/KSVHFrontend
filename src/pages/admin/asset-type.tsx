import DataTable from "@/components/admin/data-table";
import type { IAssetType } from "@/types/backend";
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Popconfirm } from "antd";
import { useState } from "react";
import queryString from "query-string";
import ModalAssetType from "@/components/admin/asset-type/modal.assettype";
import ViewDetailAssetType from "@/components/admin/asset-type/view.assettype";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import { useAssetTypesQuery, useDeleteAssetTypeMutation } from "@/hooks/useAssetTypes";
import DateRangeFilter from "@/components/common/DateRangeFilter";

const AssetTypePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IAssetType | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedAssetTypeId, setSelectedAssetTypeId] = useState<number | null>(null);

    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    const [query, setQuery] = useState<string>(() => {
        return queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        });
    });

    const { data, isFetching } = useAssetTypesQuery(query);
    const { mutate: deleteAssetType } = useDeleteAssetTypeMutation();

    // Build query string
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (params.assetTypeCode)
            q.filter = sfLike("assetTypeCode", params.assetTypeCode);
        if (params.assetTypeName)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("assetTypeName", params.assetTypeName)}`
                : sfLike("assetTypeName", params.assetTypeName);

        if (createdAtFilter) {
            q.filter = q.filter ? `${q.filter} and ${createdAtFilter}` : createdAtFilter;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        // Sort
        let sortBy = "";
        if (sort?.assetTypeCode)
            sortBy = sort.assetTypeCode === "ascend" ? "sort=assetTypeCode,asc" : "sort=assetTypeCode,desc";
        else if (sort?.assetTypeName)
            sortBy = sort.assetTypeName === "ascend" ? "sort=assetTypeName,asc" : "sort=assetTypeName,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    const columns: ProColumns<IAssetType>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) +
                ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
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
                            style={{
                                fontSize: 18,
                                color: "#ffa500",
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
                            title="Xác nhận xóa loại tài sản này?"
                            onConfirm={() => {
                                if (entity.id) deleteAssetType(Number(entity.id));
                            }}
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
        <div>
            <Access permission={ALL_PERMISSIONS.ASSET_TYPE.GET_PAGINATE}>
                <DataTable<IAssetType>
                    headerTitle="Danh sách loại tài sản"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={data?.result || []}
                    request={async (params, sort): Promise<any> => {
                        const newQuery = buildQuery(params, sort);
                        setQuery(newQuery);
                    }}
                    pagination={{
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
                                loại tài sản
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
                            <Access permission={ALL_PERMISSIONS.ASSET_TYPE.CREATE}>
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
        </div>
    );
};

export default AssetTypePage;
