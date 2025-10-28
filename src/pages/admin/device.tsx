import DataTable from "@/components/admin/data-table";
import type { IDevice } from "@/types/backend";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Tag, Image, Tooltip } from "antd";
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

// === THAY ĐỔI Ở ĐÂY ===
import CreateDeviceModal from "@/components/admin/device/CreateDeviceModal";
import UpdateDeviceModal from "@/components/admin/device/UpdateDeviceModal";
import ViewDevice from "@/components/admin/device/view.device";
import { formatCurrency, truncateText } from "@/config/format";

const DevicePage = () => {
    // === THAY ĐỔI Ở ĐÂY ===
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [dataInit, setDataInit] = useState<IDevice | null>(null);
    const [openView, setOpenView] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
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
        { title: "Mã thiết bị", dataIndex: "deviceCode", sorter: true },
        { title: "Tên thiết bị", dataIndex: "deviceName", sorter: true },
        {
            title: "Hình ảnh",
            key: "images",
            align: "center",
            render: (_: unknown, record: IDevice) => {
                const imgs = [record.image1, record.image2, record.image3].filter(
                    (x): x is string => Boolean(x)
                );

                if (imgs.length === 0) return "-";

                const fullUrl = (img: string): string => {
                    const safe = img.trim();
                    if (safe.startsWith("http")) return safe;
                    if (safe.startsWith("/storage/"))
                        return `${import.meta.env.VITE_BACKEND_URL}${safe}`;
                    return `${import.meta.env.VITE_BACKEND_URL}/storage/device/${safe}`;
                };

                return (
                    <Space>
                        {imgs.map((img, idx) => (
                            <Image
                                key={idx}
                                width={60}
                                height={60}
                                src={fullUrl(img)}
                                alt={`device-${record.deviceCode}-${idx}`}
                                style={{
                                    borderRadius: 6,
                                    border: "1px solid #f0f0f0",
                                    objectFit: "cover",
                                }}
                                fallback="https://via.placeholder.com/60x60?text=No+Img"
                            />
                        ))}
                    </Space>
                );
            },

        },
        {
            title: "Loại thiết bị",
            dataIndex: ["deviceType", "typeName"],
            render: (t: any) => (t ? <Tag color="blue">{t}</Tag> : "-"),
        },
        {
            title: "Công ty",
            dataIndex: ["company", "name"],
            render: (t: any) => (t ? <Tag color="cyan">{t}</Tag> : "-"),
        },
        {
            title: "Phòng ban / Nhà hàng",
            dataIndex: ["department", "name"],
            render: (t: any) => (t ? <Tag color="purple">{t}</Tag> : "-"),
        },
        {
            title: "Người phụ trách",
            dataIndex: ["manager", "name"],
            render: (t: any) => t || "-",
        },
        {
            title: "Nhà cung cấp",
            dataIndex: ["supplier", "supplierName"],
            render: (t: any) => t || "-",
        },
        {
            title: "Giá trị (VNĐ)",
            dataIndex: "unitPrice",
            align: "right",
            render: (val: number) => formatCurrency(val || 0),
        },
        {
            title: "Loại sở hữu",
            dataIndex: "ownershipType",
            render: (v: any) =>
                v === "INTERNAL"
                    ? <Tag color="green">Nội bộ</Tag>
                    : v === "CUSTOMER"
                        ? <Tag color="orange">Khách hàng</Tag>
                        : "-",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (v: any) => {
                const color =
                    v === "NEW" ? "blue" :
                        v === "IN_USE" ? "green" :
                            v === "IN_STORAGE" ? "gold" :
                                v === "NOT_IN_USE" ? "volcano" :
                                    "red";
                return v ? <Tag color={color}>{v}</Tag> : "-";
            },
        },
        {
            title: "Ngày sử dụng",
            dataIndex: "startDate",
            render: (t: any) => (t ? dayjs(t).format("DD/MM/YYYY") : "-"),
        },
        {
            title: "Hết bảo hành",
            dataIndex: "warrantyExpiryDate",
            render: (t: any) => (t ? dayjs(t).format("DD/MM/YYYY") : "-"),
        },
        {
            title: "Khấu hao",
            render: (_: unknown, r: IDevice) => (
                r.depreciationPeriodValue
                    ? `${r.depreciationPeriodValue} ${r.depreciationPeriodUnit === "MONTH"
                        ? "tháng"
                        : r.depreciationPeriodUnit === "QUARTER"
                            ? "quý"
                            : "năm"
                    }`
                    : "-"
            ),

        },
        {
            title: "Tần suất bảo dưỡng",
            render: (_: unknown, r: IDevice) => (
                r.maintenanceFrequencyValue
                    ? `${r.maintenanceFrequencyValue} ${r.maintenanceFrequencyUnit === "DAY"
                        ? "ngày"
                        : r.maintenanceFrequencyUnit === "WEEK"
                            ? "tuần"
                            : r.maintenanceFrequencyUnit === "MONTH"
                                ? "tháng"
                                : "năm"
                    } / lần`
                    : "-"
            ),

        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            render: (t: any) => (
                <Tooltip title={t}>{truncateText(t, 40) || "-"}</Tooltip>
            ),
        },

        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            render: (t: any) =>
                t ? dayjs(t).format("DD/MM/YYYY HH:mm") : "-",
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
                                setSelectedId(Number(entity.id));
                                setOpenView(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.DEVICE.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#faad14", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenEdit(true); // <== thay openModal bằng openEdit
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
                        pageSize: 10,
                        showSizeChanger: false,
                        total: data?.meta?.total,
                        showQuickJumper: true,
                        showTotal: (total, range) => (
                            <div style={{ fontSize: 13 }}>
                                {range[0]}–{range[1]} trên <b>{total.toLocaleString()}</b> thiết bị
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
