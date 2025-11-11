import {
    Modal,
    Descriptions,
    Typography,
    Divider,
    Image,
    Spin,
    Empty,
    Row,
    Col,
    Tag,
} from "antd";
import dayjs from "dayjs";
import { useSurveyedRequestDetailQuery } from "@/hooks/useMaintenancePlans";

const { Title } = Typography;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId?: string | null;
}

/** ===================== Modal Xem Chi Tiết Phiếu Đã Khảo Sát ===================== */
const ViewPlanDetail = ({ open, onClose, requestId }: IProps) => {
    const { data, isLoading, isError } = useSurveyedRequestDetailQuery(requestId || undefined);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const device = data?.device || {};
    const survey = data?.surveyInfo;
    const assignment = data?.assignmentInfo;

    const deviceImages = [device.image1, device.image2, device.image3].filter(Boolean);
    const attachments = [
        survey?.attachment1,
        survey?.attachment2,
        survey?.attachment3,
    ].filter(Boolean);

    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            title={<Title level={4}>Chi tiết phiếu đã khảo sát</Title>}
            width={1000}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !data ? (
                <Empty description="Không tìm thấy thông tin phiếu" />
            ) : (
                <>
                    <Descriptions bordered column={2} layout="vertical" size="small">
                        <Descriptions.Item label="Mã phiếu">{data?.requestCode}</Descriptions.Item>
                        <Descriptions.Item label="Tên sự cố">{data?.issueName}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{data?.issueDescription}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color="blue">{data?.status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mức độ hư hỏng">
                            {data?.damageLevel}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại bảo trì">{data?.maintenanceType}</Descriptions.Item>
                        <Descriptions.Item label="Mức độ ưu tiên">{data?.priorityLevel}</Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Title level={5}>Thông tin kỹ thuật viên</Title>
                    {assignment ? (
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Mã kỹ thuật viên">
                                {assignment.technicianCode}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tên kỹ thuật viên">
                                {assignment.technicianName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Điện thoại">
                                {assignment.technicianPhone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày phân công">
                                {dayjs(assignment.assignedAt).format("DD-MM-YYYY HH:mm")}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <Empty description="Không có thông tin kỹ thuật viên" />
                    )}

                    <Divider />

                    <Title level={5}>Thông tin khảo sát</Title>
                    {survey ? (
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Tình trạng thực tế">
                                {survey.actualIssueDescription}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nguyên nhân">
                                {survey.causeName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mức độ hư hỏng">
                                {survey.damageLevel}
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại bảo trì thực tế">
                                {survey.maintenanceTypeActual}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày khảo sát">
                                {dayjs(survey.surveyDate).format("DD-MM-YYYY HH:mm")}
                            </Descriptions.Item>
                            <Descriptions.Item label="Người khảo sát">
                                {survey.technicianName}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <Empty description="Không có thông tin khảo sát" />
                    )}

                    <Divider />

                    <Row gutter={16}>
                        <Col span={12}>
                            <Title level={5}>Ảnh khảo sát</Title>
                            {attachments.length > 0 ? (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                    {attachments.map((img, idx) => (
                                        <Image
                                            key={idx}
                                            width={120}
                                            height={120}
                                            src={`${backendURL}/storage/MAINTENANCE_REQUEST/${img}`}
                                            alt={`attachment-${idx + 1}`}
                                            style={{
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                border: "1px solid #f0f0f0",
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <Empty description="Không có hình ảnh khảo sát" />
                            )}
                        </Col>
                        <Col span={12}>
                            <Title level={5}>Ảnh thiết bị</Title>
                            {deviceImages.length > 0 ? (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
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

export default ViewPlanDetail;
