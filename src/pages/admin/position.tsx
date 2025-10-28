import DataTable from "@/components/admin/data-table";
import type { IPosition } from "@/types/backend";
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Popconfirm, Tag } from "antd";
import { useEffect, useState } from "react";
import queryString from "query-string";
import ModalPosition from "@/components/admin/position/modal.position";
import { usePositionsQuery, useDeletePositionMutation } from "@/hooks/usePositions";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";

const PositionPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IPosition | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<IPosition | null>(null);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );

    const { data, isFetching, refetch } = usePositionsQuery(query);
    const { mutate: deletePosition } = useDeletePositionMutation();

    const handleDelete = (id: string | number) => {
        deletePosition(id, {
            onSuccess: () => {
                refetch();
            },
        });
    };

    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (params.name) q.filter = sfLike("name", params.name);

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q, { encode: false });
        let sortBy = "sort=createdAt,desc";

        if (sort?.name) {
            sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        }

        return `${temp}&${sortBy}`;
    };

    const columns: ProColumns<IPosition>[] = [
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
            title: "Tên chức vụ",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Người tạo",
            dataIndex: "createdBy",
            hideInSearch: true,
            render: (text) => text || "-",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            hideInSearch: true,
            render: (text: any) =>
                text ? new Date(String(text)).toLocaleString() : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 160,
            align: "center",
            render: (_, entity) => (
                <Space>


                    <Access permission={ALL_PERMISSIONS.ROLES.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#ffa500", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.ROLES.DELETE} hideChildren>
                        <Popconfirm
                            title="Xóa chức vụ"
                            description="Bạn có chắc muốn xóa chức vụ này?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(entity.id!)}
                        >
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "red", cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}>
                <DataTable<IPosition>
                    headerTitle="Danh sách chức vụ"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={data?.result || []}
                    request={async (params, sort): Promise<any> => {
                        const newQuery = buildQuery(params, sort);
                        setQuery(newQuery);
                    }}
                    pagination={{
                        defaultPageSize: 10,
                        current: data?.meta?.page,
                        pageSize: data?.meta?.pageSize,
                        total: data?.meta?.total,
                        showSizeChanger: true,
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
                                chức vụ
                            </div>
                        ),
                    }}
                    rowSelection={false}
                    toolBarRender={() => [
                        <Access permission={ALL_PERMISSIONS.ROLES.CREATE} hideChildren>
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
                        </Access>,
                    ]}
                />
            </Access>

            {/* Modal thêm / sửa */}
            <ModalPosition
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    );
};

export default PositionPage;
