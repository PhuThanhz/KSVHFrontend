import DataTable from "@/components/admin/data-table";
import type { IDevicePart } from "@/types/backend";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";
import { useDevicePartsQuery, useDeleteDevicePartMutation } from "@/hooks/useDeviceParts";
import ModalDevicePart from "@/components/admin/device-part/modal.device.part";
import ViewDetailDevicePart from "@/components/admin/device-part/view.device.part";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import dayjs from "dayjs";

const DevicePartPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IDevicePart | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedPartId, setSelectedPartId] = useState<number | null>(null);

    const [query, setQuery] = useState<string>(
        "page=1&size=10&sort=createdAt,desc"
    );

    const { data, isFetching } = useDevicePartsQuery(query);
    const deleteMutation = useDeleteDevicePartMutation();

    const meta = data?.meta ?? { page: 1, pageSize: 10, total: 0 };
    const parts = data?.result ?? [];

    const handleDelete = async (id?: string | number) => {
        if (!id) return;
        await deleteMutation.mutateAsync(id, {
            onSuccess: () => {
                setQuery("page=1&size=10&sort=createdAt,desc");
            },
        });
    };

    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (params.partCode) q.filter = sfLike("partCode", params.partCode);
        if (params.partName)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("partName", params.partName)}`
                : sfLike("partName", params.partName);

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort?.partCode)
            sortBy = sort.partCode === "ascend" ? "sort=partCode,asc" : "sort=partCode,desc";
        else if (sort?.partName)
            sortBy = sort.partName === "ascend" ? "sort=partName,asc" : "sort=partName,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    const columns: ProColumns<IDevicePart>[] = [
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
            title: "Mã linh kiện",
            dataIndex: "partCode",
            sorter: true,
        },
        {
            title: "Tên linh kiện",
            dataIndex: "partName",
            sorter: true,
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            sorter: true,
            render: (_, record) => <Tag color="blue">{record.quantity}</Tag>,
        },
        {
            title: "Thiết bị",
            dataIndex: ["device", "name"],
            sorter: true,
            hideInSearch: true,
            render: (_, record) =>
                record.device?.name ? (
                    <Tag color="purple">{record.device.name}</Tag>
                ) : (
                    <Tag color="default">Chưa có</Tag>
                ),
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
                    <Access permission={ALL_PERMISSIONS.DEVICE_PART.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedPartId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.DEVICE_PART.UPDATE} hideChildren>
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

                    <Access permission={ALL_PERMISSIONS.DEVICE_PART.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa"
                            description="Bạn có chắc chắn muốn xóa linh kiện này?"
                            onConfirm={() => handleDelete(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
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
            <Access permission={ALL_PERMISSIONS.DEVICE_PART.GET_PAGINATE}>
                <DataTable<IDevicePart>
                    headerTitle="Danh sách linh kiện"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={parts}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: parts || [],
                            success: true,
                            total: meta.total || 0,
                        });
                    }}
                    pagination={{
                        current: meta.page,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showQuickJumper: true,
                        size: "default",
                    }}
                    rowSelection={false}
                    toolBarRender={() => [
                        <Access permission={ALL_PERMISSIONS.DEVICE_PART.CREATE} key="create">
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

            <ModalDevicePart
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailDevicePart
                onClose={setOpenViewDetail}
                open={openViewDetail}
                partId={selectedPartId}
            />
        </div>
    );
};

export default DevicePartPage;
