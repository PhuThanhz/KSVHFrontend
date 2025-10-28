import DataTable from "@/components/admin/data-table";
import type { IUnit } from "@/types/backend";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { Button, Popconfirm, Space } from "antd";
import { useRef, useState } from "react";
import queryString from "query-string";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import {
    useUnitsQuery,
    useDeleteUnitMutation,
} from "@/hooks/useUnits";
import ModalUnit from "@/components/admin/unit/modal.unit";
import ViewDetailUnit from "@/components/admin/unit/view.unit";
import dayjs from "dayjs";

const UnitPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IUnit | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );
    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useUnitsQuery(query);
    const deleteMutation = useDeleteUnitMutation();

    const meta = data?.meta ?? { page: 1, pageSize: 10, total: 0 };
    const units = data?.result ?? [];

    const handleDelete = async (id?: number | string) => {
        if (!id) return;
        await deleteMutation.mutateAsync(id);
    };

    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
        };

        if (params.name) {
            q.filter = `name ~ '${params.name}'`;
        }

        let temp = queryString.stringify(q);

        if (sort?.name) {
            const dir = sort.name === "ascend" ? "asc" : "desc";
            temp += `&sort=name,${dir}`;
        } else {
            temp += "&sort=createdAt,desc";
        }

        return temp;
    };

    const columns: ProColumns<IUnit>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) + ((meta.page || 1) - 1) * (meta.pageSize || 10),
            hideInSearch: true,
        },
        {
            title: "Tên đơn vị",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            hideInSearch: true,
            render: (_, record) =>
                record.createdAt ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm") : "-",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            hideInSearch: true,
            render: (_, record) =>
                record.updatedAt ? dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm") : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 120,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.UNIT.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.UNIT.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#fa8c16", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.UNIT.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa đơn vị"
                            description="Bạn có chắc chắn muốn xóa đơn vị này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(entity.id!)}
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
        <div>
            <Access permission={ALL_PERMISSIONS.UNIT.GET_PAGINATE}>
                <DataTable<IUnit>
                    headerTitle="Danh sách đơn vị"
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={units}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: units || [],
                            success: true,
                            total: meta.total || 0,
                        });
                    }}
                    pagination={{
                        defaultPageSize: 10,
                        current: data?.meta?.page,
                        pageSize: data?.meta?.pageSize,
                        total: data?.meta?.total,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        showTotal: (total, range) => (
                            <div style={{ fontSize: 13, color: "#595959" }}>
                                <span style={{ fontWeight: 500, color: "#000" }}>
                                    {range[0]}–{range[1]}
                                </span>{" "}
                                trên{" "}
                                <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                    {total.toLocaleString()}
                                </span>{" "}
                                đơn vị
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
                        <Access key="create" permission={ALL_PERMISSIONS.UNIT.CREATE} hideChildren>
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

            {/* Modal thêm/sửa */}
            <ModalUnit
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            {/* Drawer xem chi tiết */}
            <ViewDetailUnit
                onClose={setOpenViewDetail}
                open={openViewDetail}
                unitId={selectedId}
            />
        </div>
    );
};

export default UnitPage;
