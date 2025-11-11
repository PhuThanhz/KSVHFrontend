import { useState } from "react";
import {
    Card,
    Row,
    Col,
    Space,
    Tag,
    Button,
    Typography,
    Divider,
    Image,
    Empty,
} from "antd";
import { FileAddOutlined, EyeOutlined } from "@ant-design/icons";
import queryString from "query-string";
import dayjs from "dayjs";
import { useSurveyedRequestsQuery } from "@/hooks/useMaintenancePlans";
import ModalCreateMaintenancePlan from "./modal.create.plan";
import ViewPlanDetail from "./view.plan.detail";

const { Text, Title } = Typography;

/** ===================== Trang: Danh sách phiếu đã khảo sát để lập kế hoạch ===================== */
const HomePlan = () => {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedViewId, setSelectedViewId] = useState<string | null>(null);

    // Tạo query string mặc định
    const [query] = useState<string>(() =>
        queryString.stringify({
            page: 1,
            size: 20,
            sort: "createdAt,desc",
        })
    );

    const { data, isFetching } = useSurveyedRequestsQuery(query);
    const requests = data?.result || [];
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    return (
        <div style={{ padding: "24px 36px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
                Danh sách phiếu đã khảo sát để lập kế hoạch
            </h2>

            {isFetching && <p>Đang tải dữ liệu...</p>}

            {(!requests || requests.length === 0) && !isFetching ? (
                <Empty description="Không có phiếu khảo sát nào để lập kế hoạch" />
            ) : (
                <Space direction="vertical" size={20} style={{ width: "100%" }}>
                    {requests.map((item) => {
                        const device = item.device || {};
                        const deviceImages = [device.image1, device.image2, device.image3].filter(Boolean);

                        return (
                            <Card
                                key={item.requestId}
                                bordered
                                hoverable
                                style={{
                                    borderRadius: 12,
                                    padding: 16,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                }}
                                bodyStyle={{ padding: 0 }}
                            >
                                <Row gutter={24} align="top">
                                    {/* Cột ảnh thiết bị */}
                                    <Col xs={24} md={8} lg={7}>
                                        <Title level={5} style={{ textAlign: "center", marginBottom: 12 }}>
                                            Ảnh thiết bị
                                        </Title>
                                        {deviceImages.length > 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 10,
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {deviceImages.map((img, idx) => (
                                                    <Image
                                                        key={idx}
                                                        width={120}
                                                        height={120}
                                                        src={`${backendURL}/storage/DEVICE/${img}`}
                                                        alt={`device-${idx + 1}`}
                                                        style={{
                                                            borderRadius: 8,
                                                            objectFit: "cover",
                                                            border: "1px solid #f0f0f0",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: "center", color: "#999" }}>
                                                Không có hình ảnh thiết bị
                                            </div>
                                        )}
                                    </Col>

                                    {/* Cột thông tin chi tiết */}
                                    <Col xs={24} md={16} lg={17}>
                                        <div style={{ padding: "10px 0" }}>
                                            <Space size="small" wrap>
                                                <Tag color="blue">{item.requestCode}</Tag>
                                                <Tag color="orange">{item.status}</Tag>
                                                <Tag color="gold">{item.priorityLevel}</Tag>
                                                {item.maintenanceTypeActual && (
                                                    <Tag color="green">{item.maintenanceTypeActual}</Tag>
                                                )}
                                            </Space>

                                            <h3 style={{ fontWeight: 600, marginTop: 6 }}>
                                                {item.actualIssueDescription || "Chưa có mô tả thực tế"}
                                            </h3>

                                            <Row gutter={[8, 8]}>
                                                <Col span={12}>
                                                    <Text strong>Mức độ hư hỏng:</Text>{" "}
                                                    {item.damageLevel || "-"}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Mã thiết bị:</Text>{" "}
                                                    {device.deviceCode || "-"}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Tên thiết bị:</Text>{" "}
                                                    {device.deviceName || "-"}
                                                </Col>
                                            </Row>

                                            <Divider style={{ margin: "10px 0" }} />

                                            <Space>
                                                <Button
                                                    icon={<FileAddOutlined />}
                                                    type="primary"
                                                    onClick={() => {
                                                        setSelectedRequestId(item.requestId!);
                                                        setOpenCreateModal(true);
                                                    }}
                                                >
                                                    Lập kế hoạch
                                                </Button>
                                                <Button
                                                    icon={<EyeOutlined />}
                                                    onClick={() => {
                                                        setSelectedViewId(item.requestId!);
                                                        setOpenViewModal(true);
                                                    }}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </Space>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })}
                </Space>
            )}

            {/* Modal Lập Kế Hoạch */}
            <ModalCreateMaintenancePlan
                openModal={openCreateModal}
                setOpenModal={setOpenCreateModal}
                maintenanceRequestId={selectedRequestId}
            />

            {/* Modal Xem Chi Tiết Phiếu */}
            <ViewPlanDetail
                open={openViewModal}
                onClose={setOpenViewModal}
                requestId={selectedViewId}
            />
        </div>
    );
};

export default HomePlan;
