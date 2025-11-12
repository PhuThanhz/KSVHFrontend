import { Modal, Descriptions, Typography, Badge, Divider, Image, Spin, Empty, Row, Col } from "antd";
import { useMaintenanceSurveyByIdQuery } from "@/hooks/maintenance/useMaintenanceSurveys";
import dayjs from "dayjs";

const { Title } = Typography;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    surveyId?: string | null;
}

const ViewMaintenanceSurvey = ({ open, onClose, surveyId }: IProps) => {
    const { data: survey, isLoading, isError } = useMaintenanceSurveyByIdQuery(surveyId || undefined);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const requestInfo = survey?.requestInfo;
    const device = requestInfo?.device || {};
    const deviceImages = [device.image1, device.image2, device.image3].filter(Boolean);
    const requestImages = [
        requestInfo?.attachment1,
        requestInfo?.attachment2,
        requestInfo?.attachment3,
    ].filter(Boolean);

    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            title={<Title level={4}>Chi tiết phiếu đang xử lý để khảo sát</Title>}
            width={1000}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !survey ? (
                <Empty description="Không tìm thấy thông tin phiếu" />
            ) : (
                <>
                    <Descriptions bordered column={2} layout="vertical" size="small">
                        <Descriptions.Item label="Mã phiếu">{requestInfo?.requestCode}</Descriptions.Item>
                        <Descriptions.Item label="Người tạo">{requestInfo?.fullName}</Descriptions.Item>
                        <Descriptions.Item label="Vấn đề">{requestInfo?.issueName}</Descriptions.Item>
                        <Descriptions.Item label="Mức độ ưu tiên">
                            <Badge color="orange" text={requestInfo?.priorityLevel} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại bảo trì">
                            {requestInfo?.maintenanceType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo phiếu">
                            {dayjs(requestInfo?.createdAt).format("DD-MM-YYYY HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái phiếu">
                            <Badge status="processing" text={requestInfo?.status} />
                        </Descriptions.Item>
                        {survey.assignedBy && (
                            <Descriptions.Item label="Người phân công">{survey.assignedBy}</Descriptions.Item>
                        )}
                        {survey.assignedAt && (
                            <Descriptions.Item label="Thời gian phân công">
                                {dayjs(survey.assignedAt).format("DD-MM-YYYY HH:mm")}
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    <Divider />

                    {device && (
                        <>
                            <Title level={5} style={{ marginTop: 10 }}>
                                Thông tin thiết bị
                            </Title>
                            <Descriptions bordered column={2} size="small">
                                <Descriptions.Item label="Mã thiết bị">{device.deviceCode}</Descriptions.Item>
                                <Descriptions.Item label="Tên thiết bị">{device.deviceName}</Descriptions.Item>
                                <Descriptions.Item label="Công ty">{device.companyName}</Descriptions.Item>
                                <Descriptions.Item label="Bộ phận">{device.departmentName}</Descriptions.Item>
                                <Descriptions.Item label="Loại sở hữu">
                                    {device.ownershipType === "CUSTOMER"
                                        ? "Thiết bị khách hàng"
                                        : "Thiết bị nội bộ"}
                                </Descriptions.Item>
                            </Descriptions>
                        </>
                    )}

                    <Divider />

                    <Row gutter={16}>
                        <Col span={12}>
                            <Title level={5}>Ảnh phiếu bảo trì</Title>
                            {requestImages.length > 0 ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 10,
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
                                <Empty description="Không có hình ảnh phiếu" />
                            )}
                        </Col>

                        <Col span={12}>
                            <Title level={5}>Ảnh thiết bị</Title>
                            {deviceImages.length > 0 ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 10,
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
                                <Empty description="Không có hình ảnh thiết bị" />
                            )}
                        </Col>
                    </Row>
                </>
            )}
        </Modal>
    );
};

export default ViewMaintenanceSurvey;
