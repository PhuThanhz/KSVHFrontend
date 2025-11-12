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
import { useSurveyedRequestDetailQuery } from "@/hooks/maintenance/useMaintenancePlans";

const { Title } = Typography;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId?: string | null;
}

/** ===================== Modal Xem Chi Tiết Phiếu Đã Khảo Sát ===================== */
const ViewPlanDetail = ({ open, onClose, requestId }: IProps) => {
    const { data, isLoading, isError } = useSurveyedRequestDetailQuery(
        requestId || undefined
    );
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const device = data?.device || {};
    const survey = data?.surveyInfo;
    const assignment = data?.assignmentInfo;

    const deviceImages = [device.image1, device.image2, device.image3].filter(Boolean);
    const attachments = [survey?.attachment1, survey?.attachment2, survey?.attachment3]
        .filter((f): f is string => Boolean(f));


    /** ===================== Helper ===================== */
    const isImage = (file: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
    const isVideo = (file: string) => /\.(mp4|mov|avi|mkv|webm)$/i.test(file);

    const renderDamageLevel = (v?: string) => {
        switch (v) {
            case "NHE":
                return "Nhẹ";
            case "TRUNG_BINH":
                return "Trung bình";
            case "NANG":
                return "Nặng";
            case "RAT_NANG":
                return "Rất nặng";
            default:
                return "-";
        }
    };

    const renderMaintenanceType = (v?: string) => {
        switch (v) {
            case "DOT_XUAT":
                return "Đột xuất";
            case "DINH_KY":
                return "Định kỳ";
            case "SUA_CHUA":
                return "Sửa chữa";
            default:
                return "-";
        }
    };

    const renderPriority = (v?: string) => {
        switch (v) {
            case "KHAN_CAP":
                return "Khẩn cấp";
            case "CAO":
                return "Cao";
            case "TRUNG_BINH":
                return "Trung bình";
            case "THAP":
                return "Thấp";
            default:
                return "-";
        }
    };

    const renderStatus = (v?: string) => {
        const map: Record<string, string> = {
            CHO_PHAN_CONG: "Chờ phân công",
            DANG_PHAN_CONG: "Đang phân công",
            DA_XAC_NHAN: "Đã xác nhận",
            DA_KHAO_SAT: "Đã khảo sát",
            DA_LAP_KE_HOACH: "Đã lập kế hoạch",
            TU_CHOI_PHE_DUYET: "Từ chối phê duyệt",
            DA_PHE_DUYET: "Đã phê duyệt",
            DANG_BAO_TRI: "Đang bảo trì",
            CHO_NGHIEM_THU: "Chờ nghiệm thu",
            TU_CHOI_NGHIEM_THU: "Từ chối nghiệm thu",
            HOAN_THANH: "Hoàn thành",
            HUY: "Hủy",
        };
        return map[v || ""] || "-";
    };

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
                    {/* ===== Thông tin phiếu ===== */}
                    <Descriptions bordered column={2} layout="vertical" size="small">
                        <Descriptions.Item label="Mã phiếu">{data?.requestCode}</Descriptions.Item>
                        <Descriptions.Item label="Tên sự cố">{data?.issueName}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{data?.issueDescription}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color="blue">{renderStatus(data?.status)}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mức độ hư hỏng">
                            {renderDamageLevel(data?.damageLevel || undefined)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại bảo trì">
                            {renderMaintenanceType(data?.maintenanceType)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mức độ ưu tiên">
                            {renderPriority(data?.priorityLevel)}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* ===== Thông tin kỹ thuật viên ===== */}
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

                    {/* ===== Thông tin khảo sát ===== */}
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
                                {renderDamageLevel(survey.damageLevel)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại bảo trì thực tế">
                                {renderMaintenanceType(survey.maintenanceTypeActual)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày khảo sát">
                                {survey.surveyDate
                                    ? dayjs(survey.surveyDate).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Người khảo sát">
                                {survey.technicianName}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <Empty description="Không có thông tin khảo sát" />
                    )}

                    <Divider />

                    {/* ===== Hình ảnh khảo sát & thiết bị ===== */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Title level={5}>Ảnh / Video khảo sát</Title>
                            {attachments.length > 0 ? (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                    {attachments.map((file, idx) =>
                                        isImage(file) ? (
                                            <Image
                                                key={idx}
                                                width={120}
                                                height={120}
                                                src={`${backendURL}/storage/survey_attachment/${file}`}
                                                alt={`attachment-${idx + 1}`}
                                                style={{
                                                    borderRadius: 8,
                                                    objectFit: "cover",
                                                    border: "1px solid #f0f0f0",
                                                }}
                                            />
                                        ) : isVideo(file) ? (
                                            <video
                                                key={idx}
                                                src={`${backendURL}/storage/survey_attachment/${file}`}
                                                controls
                                                style={{
                                                    width: 120,
                                                    height: 120,
                                                    borderRadius: 8,
                                                    border: "1px solid #f0f0f0",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : null
                                    )}
                                </div>
                            ) : (
                                <Empty description="Không có hình ảnh hoặc video khảo sát" />
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
