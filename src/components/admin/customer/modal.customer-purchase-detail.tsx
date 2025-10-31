import { Modal, Descriptions, Typography, Tag, Table, Image } from "antd";
import dayjs from "dayjs";
import type { ICustomerPurchaseHistoryAdmin } from "@/types/backend";

const { Text, Title } = Typography;

interface IProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    data: (ICustomerPurchaseHistoryAdmin & { devices?: any[] }) | null;
}

const ModalPurchaseDetail = ({ open, setOpen, data }: IProps) => {
    if (!data) return null;

    const { customer, devices = [] } = data;

    /** ========================= COLUMNS ========================= */
    const columns = [
        {
            title: "Hình ảnh",
            dataIndex: "images",
            key: "images",
            width: 180,
            render: (_: any, record: any) => {
                const images = [record.image1, record.image2, record.image3].filter(Boolean);
                if (images.length === 0) return <Tag color="default">Không có ảnh</Tag>;

                return (
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        {images.map((img: string, idx: number) => (
                            <Image
                                key={idx}
                                src={
                                    img.startsWith("http")
                                        ? img
                                        : `${import.meta.env.VITE_BACKEND_URL}/storage/device/${img}`
                                }
                                alt={`device-${idx}`}
                                width={70}
                                height={70}
                                style={{
                                    borderRadius: 8,
                                    objectFit: "cover",
                                    border: "1px solid #eee",
                                }}
                                preview={{
                                    mask: "Xem ảnh",
                                }}
                            />
                        ))}
                    </div>
                );
            },
        },
        { title: "Tên thiết bị", dataIndex: "deviceName", key: "deviceName", width: 180 },
        {
            title: "Mã thiết bị",
            dataIndex: "deviceCode",
            key: "deviceCode",
            width: 130,
            render: (text: string) => <Text code>{text || "-"}</Text>,
        },
        { title: "Thương hiệu", dataIndex: "brand", key: "brand", width: 120 },
        { title: "Mô tả model", dataIndex: "modelDesc", key: "modelDesc", width: 200 },
        {
            title: "Ngày mua",
            dataIndex: "purchaseDate",
            key: "purchaseDate",
            width: 120,
            render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
        },
        {
            title: "Hạn bảo hành",
            dataIndex: "warrantyExpiryDate",
            key: "warrantyExpiryDate",
            width: 140,
            render: (value: string) => {
                if (!value) return <Tag color="default">Không có</Tag>;
                const expired = dayjs(value).isBefore(dayjs());
                return (
                    <Tag color={expired ? "red" : "green"}>
                        {dayjs(value).format("DD/MM/YYYY")}
                    </Tag>
                );
            },
        },
        {
            title: "Số tháng bảo hành",
            dataIndex: "warrantyMonths",
            key: "warrantyMonths",
            width: 140,
            render: (v: number | null | undefined) =>
                v !== null && v !== undefined ? <Text strong>{v} tháng</Text> : "-",
        },
        { title: "Nhà cung cấp", dataIndex: "supplierName", key: "supplierName", width: 160 },
        { title: "Công ty", dataIndex: "companyName", key: "companyName", width: 160 },
        { title: "Phòng ban", dataIndex: "departmentName", key: "departmentName", width: 160 },
        { title: "Loại thiết bị", dataIndex: "deviceTypeName", key: "deviceTypeName", width: 160 },
    ];

    return (
        <Modal
            open={open}
            title={<Title level={5}>Chi tiết lịch sử mua hàng của khách hàng</Title>}
            onCancel={() => setOpen(false)}
            footer={null}
            width={1300}
            style={{ top: 20 }}
            destroyOnClose
        >
            {/* ============ THÔNG TIN KHÁCH HÀNG ============ */}
            <Descriptions bordered column={2} title="Thông tin khách hàng" style={{ marginBottom: 16 }}>
                <Descriptions.Item label="Mã khách hàng">
                    {customer?.customerCode ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Tên khách hàng">
                    {customer?.name ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {customer?.email ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {customer?.phone ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                    {customer?.address ?? "-"}
                </Descriptions.Item>
            </Descriptions>

            {/* ============ DANH SÁCH THIẾT BỊ ============ */}
            <Title level={5} style={{ marginTop: 16 }}>
                Danh sách thiết bị đã mua ({devices.length})
            </Title>

            <div style={{ overflowX: "auto", maxHeight: "60vh" }}>
                <Table
                    rowKey={(record) =>
                        record.deviceCode || record.deviceName || Math.random().toString()
                    }
                    dataSource={devices}
                    columns={columns}
                    pagination={false}
                    size="middle"
                    bordered
                    scroll={{ x: 1700 }}
                />
            </div>
        </Modal>
    );
};

export default ModalPurchaseDetail;
