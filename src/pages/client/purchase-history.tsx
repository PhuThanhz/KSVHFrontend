import { useMyPurchaseHistoryQuery } from "@/hooks/useCustomerPurchaseHistory";
import { ProCard } from "@ant-design/pro-components";
import { Card, Row, Col, Tag, Typography, Spin, Empty, Image } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const PurchaseHistoryPage = () => {
    const { data, isLoading } = useMyPurchaseHistoryQuery();
    const purchases = data?.result || [];

    return (
        <div
            style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: "32px 24px",
            }}
        >
            <ProCard
                bordered
                title={
                    <Title level={3} style={{ margin: 0 }}>
                        Lịch sử mua hàng của bạn
                    </Title>
                }
                extra={<Tag color="blue">{purchases.length} thiết bị</Tag>}
                style={{
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    borderRadius: 12,
                    background: "#fff",
                }}
            >
                {isLoading ? (
                    <div style={{ textAlign: "center", marginTop: 50 }}>
                        <Spin size="large" />
                    </div>
                ) : purchases.length === 0 ? (
                    <Empty
                        description="Bạn chưa có lịch sử mua hàng nào"
                        style={{ marginTop: 40 }}
                    />
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {purchases.map((item) => {
                            const device = item.device;
                            const images = [device?.image1, device?.image2, device?.image3].filter(Boolean);
                            const formattedDate = dayjs(item.purchaseDate).format("DD/MM/YYYY");

                            return (
                                <Card
                                    key={item.id}
                                    hoverable
                                    bordered
                                    style={{
                                        borderRadius: 8,
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                        overflow: "hidden",
                                        border: "1px solid #e8e8e8",
                                    }}
                                    bodyStyle={{ padding: 16 }}
                                >
                                    <Row gutter={[12, 12]} align="middle">
                                        <Col xs={24} sm={6} md={5}>
                                            {images.length > 0 ? (
                                                <Image
                                                    src={
                                                        images[0]?.startsWith("http")
                                                            ? images[0]
                                                            : `${import.meta.env.VITE_BACKEND_URL}/storage/device/${images[0] ?? ""}`
                                                    }
                                                    alt={device?.deviceName || "Ảnh thiết bị"}
                                                    width="100%"
                                                    height={120}
                                                    style={{
                                                        borderRadius: 6,
                                                        objectFit: "cover",
                                                        border: "1px solid #e8e8e8",
                                                    }}
                                                    preview={{
                                                        mask: "Xem ảnh",
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: 120,
                                                        borderRadius: 6,
                                                        background: "#f5f5f5",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "#bbb",
                                                        fontSize: 12,
                                                        border: "1px solid #e8e8e8",
                                                    }}
                                                >
                                                    Không có ảnh
                                                </div>
                                            )}
                                        </Col>

                                        {/* THÔNG TIN THIẾT BỊ */}
                                        <Col xs={24} sm={18} md={19}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "flex-start",
                                                    flexWrap: "wrap",
                                                    gap: 12,
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <Text strong style={{ fontSize: 15 }}>
                                                        {device?.deviceName || "Thiết bị không xác định"}
                                                    </Text>
                                                    <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6 }}>
                                                        <p style={{ margin: "4px 0" }}>
                                                            <Text type="secondary">Mã: </Text>
                                                            <Text strong>{device?.deviceCode || "-"}</Text>
                                                        </p>
                                                        <p style={{ margin: "4px 0" }}>
                                                            <Text type="secondary">Thương hiệu: </Text>
                                                            {device?.brand || "-"}
                                                        </p>
                                                        <p style={{ margin: "4px 0" }}>
                                                            <Text type="secondary">Nhà cung cấp: </Text>
                                                            {device?.supplierName || "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div style={{ textAlign: "right", minWidth: 160 }}>
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: 12, marginRight: 4 }}>
                                                            Ngày mua:
                                                        </Text>
                                                        <Tag color="blue" style={{ fontSize: 12, marginTop: 2 }}>
                                                            {formattedDate}
                                                        </Tag>
                                                    </div>

                                                    {device?.warrantyExpiryDate && (
                                                        <div style={{ marginTop: 6 }}>
                                                            <Text type="secondary" style={{ fontSize: 12, marginRight: 4 }}>
                                                                Ngày hết hạn bảo hành:
                                                            </Text>
                                                            <Tag
                                                                color={
                                                                    dayjs(device.warrantyExpiryDate).isBefore(dayjs())
                                                                        ? "red"
                                                                        : "green"
                                                                }
                                                                style={{ fontSize: 11 }}
                                                            >
                                                                {dayjs(device.warrantyExpiryDate).format("DD/MM/YYYY")}
                                                            </Tag>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </ProCard>
        </div>
    );
};

export default PurchaseHistoryPage;