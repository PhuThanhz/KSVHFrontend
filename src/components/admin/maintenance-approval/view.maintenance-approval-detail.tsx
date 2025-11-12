import { useState } from "react";
import {
    Modal,
    Tabs,
    Descriptions,
    Spin,
    Tag,
    Empty,
    Image,
    Timeline,
    Collapse,
    Divider,
    Row,
    Col,
    Typography,
} from "antd";
import { useMaintenancePlanDetailQuery } from "@/hooks/useMaintenanceApprovals";

const { Title } = Typography;
const { TabPane } = Tabs;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    planId: string;
}

/** ===================== Modal Xem Chi Tiết Kế Hoạch Bảo Trì ===================== */
export default function ViewMaintenanceApprovalDetail({ open, onClose, planId }: IProps) {
    const { data, isLoading } = useMaintenancePlanDetailQuery(planId);
    const [openRejects, setOpenRejects] = useState(false);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    if (isLoading) {
        return (
            <Modal open={open} footer={null} onCancel={() => onClose(false)}>
                <div className="flex justify-center items-center h-60">
                    <Spin size="large" />
                </div>
            </Modal>
        );
    }

    if (!data) {
        return (
            <Modal open={open} footer={null} onCancel={() => onClose(false)}>
                <Empty description="Không tìm thấy thông tin kế hoạch bảo trì" />
            </Modal>
        );
    }

    const { requestInfo, surveyInfo, planInfo, rejectLogs } = data;

    // =================== Xử lý ảnh ===================
    const deviceImages = [
        requestInfo?.device?.image1,
        requestInfo?.device?.image2,
        requestInfo?.device?.image3,
    ].filter((f): f is string => Boolean(f));

    const requestImages = [
        requestInfo?.attachment1,
        requestInfo?.attachment2,
        requestInfo?.attachment3,
    ].filter((f): f is string => Boolean(f));

    const surveyFiles = [
        surveyInfo?.attachment1,
        surveyInfo?.attachment2,
        surveyInfo?.attachment3,
    ].filter((f): f is string => Boolean(f));

    const isImageFile = (file: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
    const isVideoFile = (file: string) => /\.(mp4|mov|avi|mkv|webm)$/i.test(file);

    // =================== Tabs Nội Dung ===================
    const renderTabs = () => (
        <Tabs defaultActiveKey="1">
            {/* Tab 1 - Thông tin phiếu */}
            <TabPane tab="Thông tin phiếu bảo trì" key="1">
                <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Mã phiếu">{requestInfo.requestCode}</Descriptions.Item>
                    <Descriptions.Item label="Người tạo">{requestInfo.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Vị trí">{requestInfo.locationDetail || "—"}</Descriptions.Item>
                    <Descriptions.Item label="Loại bảo trì">{requestInfo.maintenanceType}</Descriptions.Item>
                    <Descriptions.Item label="Mức độ ưu tiên" span={2}>
                        <Tag color="orange">{requestInfo.priorityLevel}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái" span={2}>
                        <Tag
                            color={
                                requestInfo.status === "DA_PHE_DUYET"
                                    ? "green"
                                    : requestInfo.status === "TU_CHOI_PHE_DUYET"
                                        ? "default"
                                        : "gold"
                            }
                        >
                            {requestInfo.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Thiết bị" span={2}>
                        {requestInfo.device?.deviceName || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã thiết bị">
                        {requestInfo.device?.deviceCode || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Công ty">
                        {requestInfo.device?.companyName || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phòng ban">
                        {requestInfo.device?.departmentName || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo" span={2}>
                        {requestInfo.createdAt
                            ? new Date(requestInfo.createdAt).toLocaleString()
                            : "—"}
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Row gutter={16}>
                    <Col span={12}>
                        <Title level={5}>Ảnh phiếu bảo trì</Title>
                        {requestImages.length > 0 ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                {requestImages.map((img, idx) => (
                                    <Image
                                        key={idx}
                                        width={120}
                                        height={120}
                                        src={`${backendURL}/storage/maintenance_request/${img}`}
                                        style={{
                                            borderRadius: 8,
                                            objectFit: "cover",
                                            border: "1px solid #f0f0f0",
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Empty description="Không có ảnh phiếu bảo trì" />
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
                                        style={{
                                            borderRadius: 8,
                                            objectFit: "cover",
                                            border: "1px solid #f0f0f0",
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Empty description="Không có ảnh thiết bị" />
                        )}
                    </Col>
                </Row>
            </TabPane>

            {/* Tab 2 - Khảo sát thực tế */}
            <TabPane tab="Khảo sát thực tế" key="2">
                {surveyInfo ? (
                    <>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Sự cố thực tế">
                                {surveyInfo.actualIssueDescription || "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nguyên nhân">
                                {surveyInfo.causeName || "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mức độ hư hỏng">
                                {surveyInfo.damageLevel || "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Hình thức bảo trì">
                                {surveyInfo.maintenanceTypeActual || "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày khảo sát" span={2}>
                                {surveyInfo.surveyDate
                                    ? new Date(surveyInfo.surveyDate).toLocaleString()
                                    : "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kỹ thuật viên khảo sát" span={2}>
                                {surveyInfo.technicianName || "—"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <Title level={5}>Ảnh / Video khảo sát</Title>
                        {surveyFiles.length > 0 ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                {surveyFiles.map((file, idx) =>
                                    isImageFile(file) ? (
                                        <Image
                                            key={idx}
                                            width={120}
                                            height={120}
                                            src={`${backendURL}/storage/survey_attachment/${file}`}
                                            alt={`survey-${idx + 1}`}
                                            style={{
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                border: "1px solid #f0f0f0",
                                            }}
                                        />
                                    ) : isVideoFile(file) ? (
                                        <video
                                            key={idx}
                                            src={`${backendURL}/storage/survey_attachment/${file}`}
                                            controls
                                            style={{
                                                width: 200,
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
                    </>
                ) : (
                    <Empty description="Không có thông tin khảo sát" />
                )}
            </TabPane>

            {/* Tab 3 - Kế hoạch bảo trì */}
            <TabPane tab="Kế hoạch bảo trì" key="3">
                <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Mã kế hoạch">{planInfo.planId}</Descriptions.Item>
                    <Descriptions.Item label="Giải pháp">{planInfo.solutionName || "—"}</Descriptions.Item>
                    <Descriptions.Item label="Sử dụng vật tư">
                        {planInfo.useMaterial ? "Có" : "Không"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người lập kế hoạch">
                        {planInfo.createdBy || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày lập kế hoạch" span={2}>
                        {planInfo.createdAt
                            ? new Date(planInfo.createdAt).toLocaleString()
                            : "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ghi chú" span={2}>
                        {planInfo.note || "Không có"}
                    </Descriptions.Item>
                </Descriptions>
            </TabPane>

            {/* Tab 4 - Lịch sử từ chối kế hoạch */}
            <TabPane tab={`Lịch sử từ chối (${rejectLogs?.length || 0})`} key="4">
                {rejectLogs && rejectLogs.length > 0 ? (
                    <div style={{ padding: "8px 12px" }}>
                        <Timeline
                            mode="left"
                            style={{ marginLeft: "-10px" }}
                            items={rejectLogs.map((log, index) => ({
                                color: "red",
                                label: (
                                    <span className="text-xs text-gray-600">
                                        {log.rejectedAt
                                            ? new Date(log.rejectedAt).toLocaleString()
                                            : "—"}
                                    </span>
                                ),
                                children: (
                                    <div
                                        className={`text-[13px] leading-6 ${index === 0
                                                ? "bg-red-50 border border-red-100 rounded-md p-2"
                                                : ""
                                            }`}
                                    >
                                        <p>
                                            <strong>Lý do:</strong> {log.reasonName || "—"}
                                        </p>
                                        <p>
                                            <strong>Ghi chú:</strong> {log.note || "Không có"}
                                        </p>
                                        <p>
                                            <strong>Người từ chối:</strong> {log.rejectedBy || "—"}
                                        </p>
                                    </div>
                                ),
                            }))}
                        />
                    </div>
                ) : (
                    <Empty description="Không có lịch sử từ chối" />
                )}
            </TabPane>

        </Tabs>
    );

    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={1000}
            title={<Title level={4}>Chi tiết kế hoạch bảo trì</Title>}
        >
            {renderTabs()}
        </Modal>
    );
}
