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
import { useMaintenanceSurveysInProgressQuery } from "@/hooks/useMaintenanceSurveys";
import ModalCreateSurvey from "./modal.create.survey";
import queryString from "query-string";
import dayjs from "dayjs";
import ViewMaintenanceSurvey from "./view.survey"

const { Text, Title } = Typography;

/** Trang: Danh sách phiếu đang xử lý để khảo sát */
const MaintenanceSurveyPage = () => {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
    // Tạo query string mặc định
    const [query] = useState<string>(() =>
        queryString.stringify({
            page: 1,
            size: 20,
            sort: "createdAt,desc",
        })
    );

    const { data, isFetching } = useMaintenanceSurveysInProgressQuery(query);
    const surveys = data?.result || [];

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    return (
        <div style={{ padding: "24px 36px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
                Danh sách phiếu đang xử lý để khảo sát
            </h2>

            {isFetching && <p>Đang tải dữ liệu...</p>}

            {(!surveys || surveys.length === 0) && !isFetching ? (
                <Empty description="Không có phiếu nào đang chờ khảo sát" />
            ) : (
                <Space direction="vertical" size={20} style={{ width: "100%" }}>
                    {surveys.map((item) => {
                        const { requestInfo } = item;
                        const device = requestInfo.device || {};

                        // Ảnh thiết bị
                        const deviceImages = [device.image1, device.image2, device.image3].filter(Boolean);
                        // Ảnh phiếu bảo trì
                        const requestImages = [
                            requestInfo.attachment1,
                            requestInfo.attachment2,
                            requestInfo.attachment3,
                        ].filter(Boolean);

                        return (
                            <Card
                                key={requestInfo.requestId}
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
                                    {/* Cột ảnh minh chứng + ảnh thiết bị */}
                                    <Col xs={24} md={8} lg={7}>
                                        <Title level={5} style={{ textAlign: "center", marginBottom: 12 }}>
                                            Ảnh phiếu bảo trì
                                        </Title>

                                        {requestImages.length > 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 10,
                                                    justifyContent: "center",
                                                    marginBottom: 16,
                                                }}
                                            >
                                                {requestImages.map((img, idx) => (
                                                    <Image
                                                        key={idx}
                                                        width={120}
                                                        height={120}
                                                        src={`${backendURL}/storage/maintenance_request/${img}`}
                                                        alt={`maintenance-${idx + 1}`}
                                                        style={{
                                                            borderRadius: 8,
                                                            objectFit: "cover",
                                                            border: "1px solid #f0f0f0",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: "center", color: "#999", marginBottom: 16 }}>
                                                Không có hình ảnh phiếu
                                            </div>
                                        )}

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
                                                <Tag color="blue">{requestInfo.requestCode}</Tag>
                                                <Tag color="orange">{requestInfo.maintenanceType}</Tag>
                                                <Tag color="gold">{requestInfo.priorityLevel}</Tag>
                                                <Tag color="geekblue">{requestInfo.status}</Tag>
                                            </Space>

                                            <h3 style={{ fontWeight: 600, marginTop: 6 }}>
                                                {requestInfo.issueName || "Chưa có tên vấn đề"}
                                            </h3>

                                            <Row gutter={[8, 8]}>
                                                <Col span={12}>
                                                    <Text strong>Người tạo:</Text> {requestInfo.fullName}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Vị trí:</Text> {requestInfo.locationDetail ?? "-"}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Ngày tạo phiếu:</Text>{" "}
                                                    {dayjs(requestInfo.createdAt).format("DD-MM-YYYY HH:mm")}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Trạng thái:</Text> {requestInfo.status}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Loại bảo trì:</Text> {requestInfo.maintenanceType}
                                                </Col>
                                            </Row>

                                            <Divider style={{ margin: "10px 0" }} />

                                            <div>
                                                <Title level={5}>Thông tin thiết bị</Title>
                                                <Row gutter={[8, 4]}>
                                                    <Col span={12}>
                                                        <Text>Mã thiết bị:</Text> <b>{device.deviceCode}</b>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text>Tên thiết bị:</Text> <b>{device.deviceName}</b>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text>Công ty:</Text> {device.companyName}
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text>Bộ phận:</Text> {device.departmentName}
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text>Loại sở hữu:</Text>{" "}
                                                        {device.ownershipType === "CUSTOMER" ? (
                                                            <Tag color="magenta">Thiết bị khách hàng</Tag>
                                                        ) : (
                                                            <Tag color="green">Thiết bị nội bộ</Tag>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </div>

                                            <Divider style={{ margin: "10px 0" }} />

                                            {/* Nút thao tác */}
                                            <Space>
                                                <Button
                                                    icon={<FileAddOutlined />}
                                                    type="primary"
                                                    onClick={() => {
                                                        setSelectedRequestId(requestInfo.requestId!);
                                                        setOpenCreateModal(true);
                                                    }}
                                                >
                                                    Tạo khảo sát
                                                </Button>
                                                <Button
                                                    icon={<EyeOutlined />}
                                                    onClick={() => {
                                                        setSelectedSurveyId(requestInfo.requestId!);
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

            <ModalCreateSurvey
                openModal={openCreateModal}
                setOpenModal={setOpenCreateModal}
                maintenanceRequestId={selectedRequestId}
            />
            <ViewMaintenanceSurvey
                open={openViewModal}
                onClose={setOpenViewModal}
                surveyId={selectedSurveyId}
            />
        </div>
    );
};

export default MaintenanceSurveyPage;
