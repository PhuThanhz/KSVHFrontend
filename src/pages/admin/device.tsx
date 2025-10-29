import DataTable from "@/components/admin/data-table";
import type { IDevice } from "@/types/backend";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Tag } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";

import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import {
    useDevicesQuery,
    useDeleteDeviceMutation,
} from "@/hooks/useDevices";

import CreateDeviceModal from "@/components/admin/device/CreateDeviceModal";
import UpdateDeviceModal from "@/components/admin/device/UpdateDeviceModal";
import ViewDevice from "@/components/admin/device/view.device";

const DevicePage = () => {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [dataInit, setDataInit] = useState<IDevice | null>(null);
    const [openView, setOpenView] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [query, setQuery] = useState(() =>
        queryString.stringify(
            { page: 1, size: 10, sort: "createdAt,desc" },
            { encode: false }
        )
    );

    const { data, isFetching } = useDevicesQuery(query);
    const { mutate: deleteDevice, isPending: isDeleting } = useDeleteDeviceMutation();

    /** =================== BUILD QUERY =================== */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current || 1,
            size: 10,
            filter: "",
        };

        if (params.deviceName) q.filter = sfLike("deviceName", params.deviceName);
        if (params.deviceCode)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("deviceCode", params.deviceCode)}`
                : sfLike("deviceCode", params.deviceCode);

        if (!q.filter) delete q.filter;

        let sortBy = "sort=createdAt,desc";
        if (sort?.deviceName)
            sortBy = sort.deviceName === "ascend" ? "sort=deviceName,asc" : "sort=deviceName,desc";
        else if (sort?.deviceCode)
            sortBy = sort.deviceCode === "ascend" ? "sort=deviceCode,asc" : "sort=deviceCode,desc";

        return `${queryString.stringify(q)}&${sortBy}`;
    };

    /** =================== COLUMNS =================== */
    const columns: any[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_: any, __: any, index: number) =>
                (index + 1) + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
        },
        {
            title: "Mã thiết bị",
            dataIndex: "deviceCode",
            sorter: true,
        },
        {
            title: "Tên thiết bị",
            dataIndex: "deviceName",
            sorter: true,
        },
        {
            title: "Loại thiết bị",
            dataIndex: ["deviceType", "typeName"],
            render: (t: any) => (t ? <Tag color="blue">{t}</Tag> : "-"),
        },
        {
            title: "Phòng ban / Nhà hàng",
            dataIndex: ["department", "name"],
            render: (t: any) => (t ? <Tag color="purple">{t}</Tag> : "-"),
        },
        {
            title: "Nhà cung cấp",
            dataIndex: ["supplier", "supplierName"],
            render: (t: any) => (t ? <Tag color="geekblue">{t}</Tag> : "-"),
        },
        {
            title: "Công ty / Loại tài sản",
            render: (_: unknown, record: IDevice) => (
                <>
                    {record.company?.name && (
                        <Tag color="cyan">{record.company.name}</Tag>
                    )}
                    {record.ownershipType === "CUSTOMER" && (
                        <Tag color="orange">Khách hàng</Tag>
                    )}
                    {record.ownershipType === "INTERNAL" && (
                        <Tag color="green">Nội bộ</Tag>
                    )}
                    {!record.company?.name && !record.ownershipType && "-"}
                </>
            ),
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
            render: (_: any, entity: IDevice) => (
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
                                setDataInit(entity);
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
    ];

    /** =================== RENDER =================== */
    return (
        <div>
            <Access permission={ALL_PERMISSIONS.DEVICE.GET_PAGINATE}>
                <DataTable<IDevice>
                    headerTitle="Danh sách thiết bị"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={data?.result || []}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        if (q !== query) setQuery(q);
                        return Promise.resolve({
                            data: data?.result || [],
                            success: true,
                            total: data?.meta?.total || 0,
                        });
                    }}
                    pagination={{
                        defaultPageSize: 10,
                        current: data?.meta?.page,
                        total: data?.meta?.total,
                    }}
                    toolBarRender={() => [
                        <Access permission={ALL_PERMISSIONS.DEVICE.CREATE} hideChildren key="create">
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
                        </Access>,
                    ]}
                />
            </Access>

            <CreateDeviceModal openModal={openCreate} setOpenModal={setOpenCreate} />
            <UpdateDeviceModal
                openModal={openEdit}
                setOpenModal={setOpenEdit}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
            <ViewDevice open={openView} onClose={setOpenView} deviceId={selectedId} />
        </div>
    );
};

export default DevicePage;
