import { useMyMaintenanceRequestsQuery } from "@/hooks/useCustomerPurchaseHistory";
import { ProCard } from "@ant-design/pro-components";
import { Card, Row, Col, Tag, Typography, Spin, Empty, Image } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const MyMaintenanceRequestsPage = () => {
    // Gọi API lấy danh sách phiếu bảo trì của khách hàng
    const { data, isLoading } = useMyMaintenanceRequestsQuery("page=1&pageSize=20");
    const requests = data?.result || [];

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
                        Phiếu bảo trì của bạn
                    </Title>
                }
                extra={<Tag color="blue">{requests.length} phiếu</Tag>}
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
                ) : requests.length === 0 ? (
                    <Empty
                        description="Bạn chưa có phiếu bảo trì nào"
                        style={{ marginTop: 40 }}
                    />
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {requests.map((item) => {
                            const info = item.requestInfo;
                            const attachments = [
                                info.attachment1,
                                info.attachment2,
                                info.attachment3,
                            ].filter(Boolean);
                            const createdAt = dayjs(info.createdAt).format("DD/MM/YYYY HH:mm");

                            return (
                                <Card
                                    key={info.requestId}
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
                                            {attachments.length > 0 ? (
                                                <Image
                                                    src={
                                                        attachments[0]?.startsWith("http")
                                                            ? attachments[0]
                                                            : `${import.meta.env.VITE_BACKEND_URL}/storage/maintenance/${attachments[0]}`
                                                    }
                                                    alt={info.deviceName || "Ảnh minh họa"}
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

                                        {/* THÔNG TIN PHIẾU */}
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
                                                        {info.deviceName || "Thiết bị không xác định"}
                                                    </Text>

                                                    <div
                                                        style={{
                                                            marginTop: 6,
                                                            fontSize: 13,
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        <p style={{ margin: "4px 0" }}>
                                                            <Text type="secondary">Mã phiếu: </Text>
                                                            <Text strong>{info.requestCode}</Text>
                                                        </p>
                                                        <p style={{ margin: "4px 0" }}>
                                                            <Text type="secondary">Thiết bị: </Text>
                                                            {info.deviceCode || "-"}
                                                        </p>
                                                        <p style={{ margin: "4px 0" }}>
                                                            <Text type="secondary">Mức độ ưu tiên: </Text>
                                                            <Tag
                                                                color={
                                                                    info.priorityLevel === "KHAN_CAP"
                                                                        ? "red"
                                                                        : info.priorityLevel === "CAO"
                                                                            ? "volcano"
                                                                            : info.priorityLevel === "TRUNG_BINH"
                                                                                ? "blue"
                                                                                : "default"
                                                                }
                                                                style={{ fontSize: 12 }}
                                                            >
                                                                {info.priorityLevel}
                                                            </Tag>
                                                        </p>
                                                        <p style={{ margin: "4px 0" }}>
                                                            <Text type="secondary">Loại bảo trì: </Text>
                                                            <Tag color="blue" style={{ fontSize: 12 }}>
                                                                {info.maintenanceType}
                                                            </Tag>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* TRẠNG THÁI & NGÀY TẠO */}
                                                <div style={{ textAlign: "right", minWidth: 180 }}>
                                                    <div>
                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                fontSize: 12,
                                                                marginRight: 4,
                                                            }}
                                                        >
                                                            Ngày tạo:
                                                        </Text>
                                                        <Tag color="blue" style={{ fontSize: 12 }}>
                                                            {createdAt}
                                                        </Tag>
                                                    </div>

                                                    <div style={{ marginTop: 6 }}>
                                                        <Text
                                                            type="secondary"
                                                            style={{ fontSize: 12, marginRight: 4 }}
                                                        >
                                                            Trạng thái:
                                                        </Text>
                                                        <Tag color="gold" style={{ fontSize: 12 }}>
                                                            {info.status}
                                                        </Tag>
                                                    </div>

                                                    {info.locationDetail && (
                                                        <div style={{ marginTop: 6 }}>
                                                            <Text
                                                                type="secondary"
                                                                style={{ fontSize: 12, marginRight: 4 }}
                                                            >
                                                                Địa điểm:
                                                            </Text>
                                                            <Text>{info.locationDetail}</Text>
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

export default MyMaintenanceRequestsPage;
