import { Drawer, Descriptions, Divider, Tag, Table, Spin, Row, Col, Card, Image } from "antd";
import { useDeviceByIdQuery } from "@/hooks/useDevices";
import { useDevicePartsQuery } from "@/hooks/useDeviceParts";
import { formatCurrency } from "@/utils/format";
import dayjs from "dayjs";
import React from "react";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    deviceId?: string | null;
}

const ViewDevice: React.FC<IProps> = ({ open, onClose, deviceId }) => {
    const { data, isFetching } = useDeviceByIdQuery(deviceId ?? "");
    const { data: parts, isFetching: partsLoading } = useDevicePartsQuery(deviceId ?? "");

    const renderDate = (v?: string | null) =>
        v ? dayjs(v).format("DD/MM/YYYY") : "-";

    const renderMoney = (v?: string | number | null) =>
        v != null && v !== "" ? formatCurrency(Number(v)) : "-";

    const renderTag = (value?: string | null) =>
        value ? <Tag color="blue">{value}</Tag> : <Tag>-</Tag>;

    const getStatusTag = (status?: string) => {
        switch (status) {
            case "WORKING":
                return <Tag color="green">Đang hoạt động</Tag>;
            case "BROKEN":
                return <Tag color="red">Hư hỏng</Tag>;
            case "REPLACED":
                return <Tag color="blue">Đã thay mới</Tag>;
            case "REMOVED":
                return <Tag color="orange">Đã tháo</Tag>;
            default:
                return <Tag>-</Tag>;
        }
    };

    const renderImages = () => {
        const images = [data?.image1, data?.image2, data?.image3].filter(Boolean);
        if (images.length === 0) return <div style={{ color: "#999" }}>Không có hình ảnh</div>;

        return (
            <Image.PreviewGroup>
                <Row gutter={[12, 12]}>
                    {images.map((fileName, idx) => {
                        const safeName = String(fileName);
                        const fullUrl = safeName.startsWith("http")
                            ? safeName
                            : safeName.startsWith("/storage/")
                                ? `${import.meta.env.VITE_BACKEND_URL}${safeName}`
                                : `${import.meta.env.VITE_BACKEND_URL}/storage/device/${safeName}`;

                        return (
                            <Col key={idx}>
                                <Image
                                    src={fullUrl}
                                    alt={`device-${idx + 1}`}
                                    width={160}
                                    height={120}
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: 6,
                                        border: "1px solid #f0f0f0",
                                    }}
                                    fallback="https://via.placeholder.com/160x120?text=No+Image"
                                />
                            </Col>
                        );
                    })}
                </Row>
            </Image.PreviewGroup>
        );
    };

    if (isFetching) {
        return (
            <Drawer
                title="Chi tiết thiết bị / công cụ dụng cụ"
                width={900}
                onClose={() => onClose(false)}
                open={open}
                destroyOnClose
            >
                <div style={{ textAlign: "center", padding: "100px 0" }}>
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                </div>
            </Drawer>
        );
    }

    if (!data) {
        return (
            <Drawer
                title="Chi tiết thiết bị / công cụ dụng cụ"
                width={900}
                onClose={() => onClose(false)}
                open={open}
                destroyOnClose
            >
                <div style={{ textAlign: "center", padding: "50px 0", color: "#999" }}>
                    Không có dữ liệu thiết bị
                </div>
            </Drawer>
        );
    }

    return (
        <Drawer
            title="Chi tiết thiết bị / công cụ dụng cụ"
            width={900}
            onClose={() => onClose(false)}
            open={open}
            destroyOnClose
        >
            {/* MÃ VẠCH & QR CODE */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={24} justify="center" align="middle">
                    <Col>
                        {data.barcodeBase64 ? (
                            <div style={{ textAlign: "center" }}>
                                <img
                                    src={`data:image/png;base64,${data.barcodeBase64}`}
                                    alt="barcode"
                                    style={{
                                        width: 240,
                                        height: 80,
                                        objectFit: "contain",
                                        border: "1px solid #e8e8e8",
                                        padding: 8,
                                        background: "#fafafa",
                                        borderRadius: 4,
                                    }}
                                />
                                <div style={{ marginTop: 6, fontWeight: 600, fontSize: 14 }}>
                                    {data.deviceCode}
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: "#999" }}>Không có mã vạch</div>
                        )}
                    </Col>
                    <Col>
                        {data.qrCodeBase64 ? (
                            <img
                                src={`data:image/png;base64,${data.qrCodeBase64}`}
                                alt="qrcode"
                                style={{
                                    width: 120,
                                    height: 120,
                                    objectFit: "contain",
                                    border: "1px solid #e8e8e8",
                                    padding: 8,
                                    background: "#fafafa",
                                    borderRadius: 4,
                                }}
                            />
                        ) : (
                            <div style={{ color: "#999" }}>Không có QR Code</div>
                        )}
                    </Col>
                </Row>
            </Card>

            {/* THÔNG TIN CƠ BẢN */}
            <Divider orientation="left" style={{ margin: "16px 0 12px" }}>
                Thông tin cơ bản
            </Divider>
            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Mã thiết bị">{data.deviceCode}</Descriptions.Item>
                <Descriptions.Item label="Mã kế toán">{data.accountingCode || "-"}</Descriptions.Item>
                <Descriptions.Item label="Tên thiết bị" span={2}>{data.deviceName}</Descriptions.Item>
                <Descriptions.Item label="Loại thiết bị">{data.deviceType?.typeName || "-"}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{renderTag(data.status)}</Descriptions.Item>
                <Descriptions.Item label="Công ty">{data.company?.name || "-"}</Descriptions.Item>
                <Descriptions.Item label="Phòng ban">{data.department?.name || "-"}</Descriptions.Item>
                <Descriptions.Item label="Người phụ trách">{data.manager?.name || "-"}</Descriptions.Item>
                <Descriptions.Item label="Nhà cung cấp">{data.supplier?.supplierName || "-"}</Descriptions.Item>
                <Descriptions.Item label="Đơn vị">{data.unit?.name || "-"}</Descriptions.Item>
                <Descriptions.Item label="Loại sở hữu">
                    {data.ownershipType === "INTERNAL"
                        ? "Thiết bị nội bộ"
                        : data.ownershipType === "CUSTOMER"
                            ? "Thiết bị thuộc khách hàng"
                            : "-"}
                </Descriptions.Item>
                {data.ownershipType === "CUSTOMER" && data.customer && (
                    <>
                        <Descriptions.Item label="Khách hàng">{data.customer.name || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Mã khách hàng">{data.customer.customerCode || "-"}</Descriptions.Item>
                    </>
                )}
            </Descriptions>

            {/* THÔNG TIN KỸ THUẬT */}
            <Divider orientation="left" style={{ margin: "16px 0 12px" }}>
                Thông tin kỹ thuật
            </Divider>
            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Thương hiệu">{data.brand || "-"}</Descriptions.Item>
                <Descriptions.Item label="Model">{data.modelDesc || "-"}</Descriptions.Item>
                <Descriptions.Item label="Công suất">{data.powerCapacity || "-"}</Descriptions.Item>
                <Descriptions.Item label="Đơn giá">{renderMoney(data.unitPrice)}</Descriptions.Item>
                <Descriptions.Item label="Kích thước" span={2}>
                    {data.length || data.width || data.height
                        ? `${data.length ?? "-"} x ${data.width ?? "-"} x ${data.height ?? "-"} cm`
                        : "-"}
                </Descriptions.Item>
            </Descriptions>

            {/* THÔNG TIN SỬ DỤNG & BẢO TRÌ */}
            <Divider orientation="left" style={{ margin: "16px 0 12px" }}>
                Sử dụng & bảo trì
            </Divider>
            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Ngày đưa vào SD">{renderDate(data.startDate)}</Descriptions.Item>
                <Descriptions.Item label="Hết hạn BH">{renderDate(data.warrantyExpiryDate)}</Descriptions.Item>
                <Descriptions.Item label="Chu kỳ khấu hao">
                    {data.depreciationPeriodValue
                        ? `${data.depreciationPeriodValue} ${data.depreciationPeriodUnit === "MONTH" ? "tháng" :
                            data.depreciationPeriodUnit === "QUARTER" ? "quý" : "năm"
                        }`
                        : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Tần suất bảo dưỡng">
                    {data.maintenanceFrequencyValue
                        ? `Mỗi ${data.maintenanceFrequencyValue} ${data.maintenanceFrequencyUnit === "DAY" ? "ngày" :
                            data.maintenanceFrequencyUnit === "WEEK" ? "tuần" :
                                data.maintenanceFrequencyUnit === "MONTH" ? "tháng" : "năm"
                        }`
                        : "-"}
                </Descriptions.Item>
            </Descriptions>

            {/* GHI CHÚ */}
            {data.note && (
                <>
                    <Divider orientation="left" style={{ margin: "16px 0 12px" }}>
                        Ghi chú
                    </Divider>
                    <Card size="small" style={{ marginBottom: 16 }}>
                        <div style={{ whiteSpace: "pre-line", fontSize: 13 }}>
                            {data.note}
                        </div>
                    </Card>
                </>
            )}

            {/* HÌNH ẢNH */}
            <Divider orientation="left" style={{ margin: "16px 0 12px" }}>
                Hình ảnh
            </Divider>
            {renderImages()}

            {/* DANH SÁCH LINH KIỆN */}
            <Divider orientation="left" style={{ margin: "16px 0 12px" }}>
                Danh sách linh kiện
            </Divider>
            {partsLoading ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <Spin tip="Đang tải linh kiện..." />
                </div>
            ) : (
                <Table
                    size="small"
                    bordered
                    dataSource={parts || []}
                    pagination={false}
                    rowKey={(r) => r.id}
                    locale={{ emptyText: "Không có linh kiện" }}
                    columns={[
                        { title: "Mã linh kiện", dataIndex: "partCode", width: 120 },
                        { title: "Tên linh kiện", dataIndex: "partName" },
                        {
                            title: "SL",
                            dataIndex: "quantity",
                            align: "center",
                            width: 60,
                        },
                        {
                            title: "Trạng thái",
                            dataIndex: "status",
                            align: "center",
                            width: 130,
                            render: getStatusTag,
                        },
                    ]}
                />
            )}

            {/* THÔNG TIN HỆ THỐNG */}
            <Divider orientation="left" style={{ margin: "16px 0 12px" }}>
                Thông tin hệ thống
            </Divider>
            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Người tạo">{data.createdBy || "-"}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                    {data.createdAt ? dayjs(data.createdAt).format("DD/MM/YYYY HH:mm") : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Người cập nhật">{data.updatedBy || "-"}</Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                    {data.updatedAt ? dayjs(data.updatedAt).format("DD/MM/YYYY HH:mm") : "-"}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default ViewDevice;