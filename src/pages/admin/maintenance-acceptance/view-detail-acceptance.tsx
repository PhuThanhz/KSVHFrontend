import {
    Modal,
    Tabs,
    Descriptions,
    Spin,
    Tag,
    Empty,
    Image,
    Divider,
    Row,
    Col,
    Typography,
    Timeline,
} from "antd";
import { useAcceptanceDetailQuery } from "@/hooks/useAcceptance";
import { useState } from "react";

const { Title } = Typography;
const { TabPane } = Tabs;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId: string | null;
}

export default function ViewDetailAcceptance({ open, onClose, requestId }: IProps) {
    const { data, isLoading } = useAcceptanceDetailQuery(requestId || "");
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
                <Empty description="Không tìm thấy thông tin nghiệm thu" />
            </Modal>
        );
    }

    const { requestInfo, surveyInfo, planInfo, tasks, rejectHistory } = data;

    const deviceImages = [
        requestInfo?.device?.image1,
        requestInfo?.device?.image2,
        requestInfo?.device?.image3,
    ].filter(Boolean) as string[];

    const requestImages = [
        requestInfo?.attachment1,
        requestInfo?.attachment2,
        requestInfo?.attachment3,
    ].filter(Boolean) as string[];

    const surveyImages = [
        surveyInfo?.attachment1,
        surveyInfo?.attachment2,
        surveyInfo?.attachment3,
    ].filter(Boolean) as string[];

    const renderTabs = () => (
        <Tabs defaultActiveKey="1">

            {/* TAB 1 – Thông tin yêu cầu */}
            <TabPane tab="Thông tin yêu cầu" key="1">
                <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Mã phiếu">{requestInfo.requestCode}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {requestInfo.createdAt ? new Date(requestInfo.createdAt).toLocaleString() : "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Độ ưu tiên">
                        <Tag color="red">{requestInfo.priorityLevel}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại bảo trì">
                        <Tag color="blue">{requestInfo.maintenanceType}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái" span={2}>
                        <Tag color="processing">{requestInfo.status}</Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Tên thiết bị" span={2}>
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

                    <Descriptions.Item label="Vị trí" span={2}>
                        {requestInfo.locationDetail || "—"}
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Row gutter={16}>
                    <Col span={12}>
                        <Title level={5}>Ảnh phiếu bảo trì</Title>
                        {requestImages.length > 0 ? (
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                {requestImages.map((img, idx) => (
                                    <Image
                                        key={idx}
                                        width={120}
                                        src={`${backendURL}/storage/maintenance_request/${img}`}
                                        style={{ borderRadius: 8, border: "1px solid #eee" }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Empty description="Không có ảnh yêu cầu" />
                        )}
                    </Col>

                    <Col span={12}>
                        <Title level={5}>Ảnh thiết bị</Title>
                        {deviceImages.length > 0 ? (
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                {deviceImages.map((img, idx) => (
                                    <Image
                                        key={idx}
                                        width={120}
                                        src={`${backendURL}/storage/DEVICE/${img}`}
                                        style={{ borderRadius: 8, border: "1px solid #eee" }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Empty description="Không có ảnh thiết bị" />
                        )}
                    </Col>
                </Row>
            </TabPane>

            {/* TAB 2 – Khảo sát */}
            <TabPane tab="Khảo sát" key="2">
                {surveyInfo ? (
                    <>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Ngày khảo sát">
                                {surveyInfo.surveyDate
                                    ? new Date(surveyInfo.surveyDate).toLocaleString()
                                    : "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kỹ thuật viên">
                                {surveyInfo.technicianName || "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sự cố thực tế" span={2}>
                                {surveyInfo.actualIssueDescription || "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nguyên nhân">
                                {surveyInfo.causeName || "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mức độ hư hại">
                                {surveyInfo.damageLevel || "—"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <Title level={5}>Ảnh khảo sát</Title>
                        {surveyImages.length > 0 ? (
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                {surveyImages.map((img, idx) => (
                                    <Image key={idx} width={120} src={`${backendURL}/storage/survey_attachment/${img}`} />
                                ))}
                            </div>
                        ) : (
                            <Empty description="Không có hình khảo sát" />
                        )}
                    </>
                ) : (
                    <Empty description="Không có thông tin khảo sát" />
                )}
            </TabPane>

            {/* TAB 3 – Kế hoạch */}
            <TabPane tab="Kế hoạch bảo trì" key="3">
                {planInfo ? (
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Mã kế hoạch">{planInfo.planId}</Descriptions.Item>
                        <Descriptions.Item label="Giải pháp">{planInfo.solutionName}</Descriptions.Item>
                        <Descriptions.Item label="Ngày lập" span={2}>
                            {planInfo.createdAt ? new Date(planInfo.createdAt).toLocaleString() : "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Người lập" span={2}>
                            {planInfo.createdBy || "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú" span={2}>
                            {planInfo.note || "Không có"}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Empty description="Không có kế hoạch bảo trì" />
                )}
            </TabPane>

            {/* TAB 4 – Tasks */}
            <TabPane tab="Thực hiện bảo trì" key="4">
                {tasks && tasks.length > 0 ? (
                    tasks.map((t, idx) => (
                        <div key={idx} style={{ marginBottom: 25 }}>
                            <Title level={5}>{t.content}</Title>

                            <Descriptions bordered size="small" column={2}>
                                <Descriptions.Item label="Hoàn thành">{t.done ? "Có" : "Không"}</Descriptions.Item>
                                <Descriptions.Item label="Người thực hiện">{t.doneBy}</Descriptions.Item>
                                <Descriptions.Item label="Thời gian" span={2}>
                                    {t.doneAt ? new Date(t.doneAt).toLocaleString() : "—"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ghi chú" span={2}>
                                    {t.note || "—"}
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            <Row gutter={8}>
                                {[t.image1, t.image2, t.image3].filter(Boolean).map((img, i) => (
                                    <Col key={i}>
                                        <Image width={120} src={`${backendURL}/storage/execution_task/${img}`} />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))
                ) : (
                    <Empty description="Không có công việc" />
                )}
            </TabPane>

            {/* TAB 5 – Lịch sử từ chối nghiệm thu */}
            <TabPane tab="Lịch sử từ chối" key="5">
                {rejectHistory && rejectHistory.length > 0 ? (
                    <Timeline>
                        {rejectHistory.map((item, idx) => (
                            <Timeline.Item color="red" key={idx}>
                                <Title level={5} style={{ marginBottom: 5 }}>
                                    {item.reasonName}
                                </Title>
                                <div><strong>Thời gian:</strong> {new Date(item.rejectedAt).toLocaleString()}</div>
                                <div><strong>Người từ chối:</strong> {item.rejectedBy || "—"}</div>
                                <div><strong>Ghi chú:</strong> {item.note || "—"}</div>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                ) : (
                    <Empty description="Không có lịch sử từ chối nghiệm thu" />
                )}
            </TabPane>

        </Tabs>
    );

    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={1100}
            title={<Title level={4}>Chi tiết nghiệm thu bảo trì</Title>}
        >
            {renderTabs()}
        </Modal>
    );
}
