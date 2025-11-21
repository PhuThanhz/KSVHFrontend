import { useParams, useNavigate } from "react-router-dom";
import { useDeviceByCodeQuery } from "@/hooks/useDevices";
import { Spin, Alert, Tag, Divider, Card, Row, Col, Typography, Image, Empty, Space } from "antd";
import { UserOutlined, CalendarOutlined, HomeOutlined, TagOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { formatCurrency } from "@/config/format";

const { Title, Text } = Typography;

const ScanResult = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, error } = useDeviceByCodeQuery(code ?? "");

    const imgUrl = (fileName?: string | null) => {
        if (!fileName) return null;
        if (fileName.startsWith("http")) return fileName;
        if (fileName.startsWith("/storage/"))
            return `${import.meta.env.VITE_BACKEND_URL}${fileName}`;
        return `${import.meta.env.VITE_BACKEND_URL}/storage/device/${fileName}`;
    };

    if (isLoading) {
        return (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <Spin size="large" tip="Đang tải thông tin thiết bị..." />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
                <Alert
                    message="Không tìm thấy thiết bị"
                    description="Mã thiết bị bạn quét không tồn tại hoặc đã bị xóa."
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    const d = data;

    const getStatusColor = (status: string) => {
        const map: any = {
            "HOẠT ĐỘNG": "success",
            "HỎNG": "error",
            "BẢO TRÌ": "warning",
            "NGỪNG SỬ DỤNG": "default",
            "MẤT": "danger",
        };
        return map[status?.toUpperCase()] || "blue";
    };

    return (
        <div style={{ padding: "24px 16px", maxWidth: 1100, margin: "0 auto", background: "#f9f9fc", minHeight: "100vh" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 32, color: "#1a1a1a" }}>
                Thông tin thiết bị
            </Title>

            {/* Mã vạch & QR Code */}
            <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <Title level={4} style={{ marginBottom: 24 }}>
                    Mã vạch & QR Code
                </Title>
                <Row gutter={[32, 32]} justify="center" align="middle">
                    <Col xs={24} sm={12} style={{ textAlign: "center" }}>
                        {d.barcodeBase64 ? (
                            <Space direction="vertical">
                                <div style={{
                                    padding: 16,
                                    background: "#fff",
                                    borderRadius: 12,
                                    display: "inline-block",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                }}>
                                    <img
                                        src={`data:image/png;base64,${d.barcodeBase64}`}
                                        alt="Mã vạch"
                                        style={{ height: 100, width: "auto" }}
                                    />
                                </div>
                                <Text strong style={{ fontSize: 18, color: "#1890ff" }}>
                                    {d.deviceCode}
                                </Text>
                            </Space>
                        ) : (
                            <Empty description="Không có mã vạch" />
                        )}
                    </Col>

                    <Col xs={24} sm={12} style={{ textAlign: "center" }}>
                        {d.qrCodeBase64 ? (
                            <div style={{
                                padding: 20,
                                background: "#fff",
                                borderRadius: 16,
                                display: "inline-block",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
                            }}>
                                <img
                                    src={`data:image/png;base64,${d.qrCodeBase64}`}
                                    alt="QR Code"
                                    style={{ width: 180, height: 180 }}
                                />
                            </div>
                        ) : (
                            <Empty description="Không có QR Code" />
                        )}
                    </Col>
                </Row>
            </Card>

            {/* Thông tin cơ bản */}
            <Card title="Thông tin cơ bản" style={{ marginBottom: 24, borderRadius: 12 }} headStyle={{ background: "#f0f5ff", borderRadius: "12px 12px 0 0" }}>
                <Row gutter={[16, 20]}>
                    <Col xs={24} md={12}>
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            <div><Text strong>Mã thiết bị:</Text> <Tag color="blue">{d.deviceCode}</Tag></div>
                            <div><Text strong>Tên thiết bị:</Text> <Text>{d.deviceName}</Text></div>
                            <div><Text strong>Loại thiết bị:</Text> <Text type="secondary">{d.deviceType?.typeName || "-"}</Text></div>
                            <div><Text strong>Công ty:</Text> <Text>{d.company?.name || "-"}</Text></div>
                            <div><Text strong>Phòng ban:</Text> <Text>{d.department?.name || "-"}</Text></div>
                        </Space>
                    </Col>
                    <Col xs={24} md={12}>
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            <div><Text strong>Người phụ trách:</Text> <Text><UserOutlined /> {d.manager?.name || "-"}</Text></div>
                            <div><Text strong>Nhà cung cấp:</Text> <Text>{d.supplier?.supplierName || "-"}</Text></div>
                            <div><Text strong>Loại sở hữu:</Text> <Tag color={d.ownershipType === "CUSTOMER" ? "orange" : "green"}>
                                {d.ownershipType === "CUSTOMER" ? "Thiết bị khách hàng" : "Thiết bị nội bộ"}
                            </Tag></div>
                            <Tag color={getStatusColor(d.status ?? "")}>{d.status || "Chưa xác định"}</Tag>                            {d.customer && (
                                <>
                                    <div><Text strong>Khách hàng:</Text> <Text type="danger">{d.customer.name}</Text></div>
                                    <div><Text strong>Mã khách hàng:</Text> <Text code>{d.customer.customerCode}</Text></div>
                                </>
                            )}
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Thông tin kỹ thuật */}
            <Card title="Thông tin kỹ thuật" style={{ marginBottom: 24, borderRadius: 12 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8} md={6}>
                        <Text strong>Thương hiệu:</Text><br />
                        <Text type="secondary">{d.brand || "-"}</Text>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                        <Text strong>Model:</Text><br />
                        <Text type="secondary">{d.modelDesc || "-"}</Text>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                        <Text strong>Công suất:</Text><br />
                        <Text type="secondary">{d.powerCapacity || "-"}</Text>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                        <Text strong>Đơn giá:</Text><br />
                        <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                            {formatCurrency(Number(d.unitPrice || 0))}
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* Hình ảnh */}
            {[d.image1, d.image2, d.image3].filter(Boolean).length > 0 && (
                <Card title="Hình ảnh thiết bị" style={{ marginBottom: 24, borderRadius: 12 }}>
                    <Image.PreviewGroup>
                        <Row gutter={[16, 16]}>
                            {[d.image1, d.image2, d.image3].filter(Boolean).map((img, idx) => (
                                <Col key={idx} xs={24} sm={12} md={8}>
                                    <Image
                                        src={imgUrl(img)!}
                                        alt={`Hình ảnh ${idx + 1}`}
                                        style={{
                                            width: "100%",
                                            height: 220,
                                            objectFit: "cover",
                                            borderRadius: 12,
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                        }}
                                        placeholder={<Image preview={false} src="/placeholder.png" style={{ height: 220, borderRadius: 12 }} />}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Image.PreviewGroup>
                </Card>
            )}

            {/* Ghi chú */}
            {d.note && (
                <Card title="Ghi chú" style={{ marginBottom: 24, borderRadius: 12 }}>
                    <Text style={{ whiteSpace: "pre-line", fontSize: 15, lineHeight: 1.8 }}>
                        {d.note}
                    </Text>
                </Card>
            )}

            {/* Thông tin hệ thống */}
            <Card title={<span><CalendarOutlined /> Thông tin hệ thống</span>} style={{ borderRadius: 12 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={12} md={6}>
                        <Text strong>Người tạo:</Text><br />
                        <Text type="secondary">{d.createdBy || "-"}</Text>
                    </Col>
                    <Col xs={12} md={6}>
                        <Text strong>Ngày tạo:</Text><br />
                        <Text type="secondary">{d.createdAt ? dayjs(d.createdAt).format("DD/MM/YYYY HH:mm") : "-"}</Text>
                    </Col>
                    <Col xs={12} md={6}>
                        <Text strong>Người cập nhật:</Text><br />
                        <Text type="secondary">{d.updatedBy || "-"}</Text>
                    </Col>
                    <Col xs={12} md={6}>
                        <Text strong>Cập nhật lúc:</Text><br />
                        <Text type="secondary">{d.updatedAt ? dayjs(d.updatedAt).format("DD/MM/YYYY HH:mm") : "-"}</Text>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ScanResult;