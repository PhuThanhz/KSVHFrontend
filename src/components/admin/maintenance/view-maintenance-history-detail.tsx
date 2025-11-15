import { useState } from "react";
import {
    Modal,
    Tabs,
    Descriptions,
    Divider,
    Typography,
    Spin,
    Empty,
    Tag,
    Image,
    Row,
    Col,
    Timeline,
    Card
} from "antd";
import dayjs from "dayjs";
import { useMaintenanceHistoryDetailQuery } from "@/hooks/maintenance/useMaintenanceHistory";
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId: string;
}

const ViewMaintenanceHistoryDetail = ({ open, onClose, requestId }: IProps) => {
    const { data, isLoading, isError } = useMaintenanceHistoryDetailQuery(requestId); // Gọi hook để fetch data
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const renderTabs = () => (
        <Tabs defaultActiveKey="1">
            {/* Tab 1 – Thông tin yêu cầu */}
            <TabPane tab="Thông tin yêu cầu" key="1">
                <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Mã phiếu">{data?.requestInfo?.requestCode || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{data?.requestInfo?.createdAt ? dayjs(data?.requestInfo?.createdAt).format("DD/MM/YYYY HH:mm") : "—"}</Descriptions.Item>
                    <Descriptions.Item label="Độ ưu tiên">
                        <Tag color="red">{data?.requestInfo?.priorityLevel}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại bảo trì">
                        <Tag color="blue">{data?.requestInfo?.maintenanceType}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái" span={2}>
                        <Tag color="processing">{data?.requestInfo?.status}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên thiết bị" span={2}>{data?.requestInfo?.device?.deviceName || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Mã thiết bị">{data?.requestInfo?.device?.deviceCode || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Công ty">{data?.requestInfo?.device?.companyName || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Phòng ban">{data?.requestInfo?.device?.departmentName || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Vị trí" span={2}>{data?.requestInfo?.locationDetail || '—'}</Descriptions.Item>
                </Descriptions>

                <Divider />

                <Row gutter={16}>
                    <Col span={12}>
                        <Title level={5}>Ảnh phiếu bảo trì</Title>
                        {data?.requestInfo?.attachment1 || data?.requestInfo?.attachment2 || data?.requestInfo?.attachment3 ? (
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                {[data?.requestInfo?.attachment1, data?.requestInfo?.attachment2, data?.requestInfo?.attachment3].map((img, idx) => (
                                    <Image key={idx} width={120} height={120} src={`${backendURL}/storage/maintenance_request/${img}`} />
                                ))}
                            </div>
                        ) : (
                            <Empty description="Không có ảnh yêu cầu" />
                        )}
                    </Col>

                    <Col span={12}>
                        <Title level={5}>Ảnh thiết bị</Title>
                        {data?.requestInfo?.device?.image1 || data?.requestInfo?.device?.image2 || data?.requestInfo?.device?.image3 ? (
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                {[data?.requestInfo?.device?.image1, data?.requestInfo?.device?.image2, data?.requestInfo?.device?.image3].map((img, idx) => (
                                    <Image key={idx} width={120} height={120} src={`${backendURL}/storage/DEVICE/${img}`} />
                                ))}
                            </div>
                        ) : (
                            <Empty description="Không có ảnh thiết bị" />
                        )}
                    </Col>
                </Row>
            </TabPane>

            {/* Tab 2 – Khảo sát */}
            <TabPane tab="Khảo sát" key="2">
                {data?.surveyInfo ? (
                    <>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Kỹ thuật viên">{data?.surveyInfo?.technicianName || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày khảo sát">{data?.surveyInfo?.surveyDate ? dayjs(data?.surveyInfo?.surveyDate).format("DD/MM/YYYY") : "—"}</Descriptions.Item>
                            <Descriptions.Item label="Nguyên nhân">{data?.surveyInfo?.causeName || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Mức độ hư hại">{data?.surveyInfo?.damageLevel || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Loại bảo trì thực tế">{data?.surveyInfo?.maintenanceTypeActual || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Mô tả sự cố thực tế" span={2}>{data?.surveyInfo?.actualIssueDescription || '—'}</Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <Title level={5}>Ảnh khảo sát</Title>
                        {[data?.surveyInfo?.attachment1, data?.surveyInfo?.attachment2, data?.surveyInfo?.attachment3].filter(Boolean).length > 0 ? (
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                {[data?.surveyInfo?.attachment1, data?.surveyInfo?.attachment2, data?.surveyInfo?.attachment3].map((img, idx) => (
                                    <Image key={idx} width={120} height={120} src={`${backendURL}/storage/survey_attachment/${img}`} />
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

            {/* Tab 3 – Kế hoạch */}
            <TabPane tab="Kế hoạch" key="3">
                {data?.planInfo ? (
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Mã kế hoạch">{data?.planInfo?.planId}</Descriptions.Item>
                        <Descriptions.Item label="Giải pháp">{data?.planInfo?.solutionName || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Ngày lập">{data?.planInfo?.createdAt ? dayjs(data?.planInfo?.createdAt).format("DD/MM/YYYY HH:mm") : "—"}</Descriptions.Item>
                        <Descriptions.Item label="Người lập">{data?.planInfo?.createdBy || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Ghi chú" span={2}>{data?.planInfo?.note || '—'}</Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Empty description="Không có kế hoạch bảo trì" />
                )}
            </TabPane>

            {/* Tab 4 – Công việc thi công */}
            <TabPane tab="Công việc thi công" key="4">
                {data?.tasks ? (
                    <>
                        {data?.tasks.map((task, idx) => (
                            <Card key={task.id} style={{ marginBottom: 14 }}>
                                <Title level={5}>{task.content}</Title>
                                <Descriptions bordered column={2} size="small">
                                    <Descriptions.Item label="Hoàn thành">{task.done ? 'Có' : 'Không'}</Descriptions.Item>
                                    <Descriptions.Item label="Người thực hiện">{task.doneBy || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Thời gian">{task.doneAt ? dayjs(task.doneAt).format("DD/MM/YYYY HH:mm") : '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Ghi chú" span={2}>{task.note || '—'}</Descriptions.Item>
                                </Descriptions>

                                <Divider />

                                <Row gutter={8}>
                                    {[task.image1, task.image2, task.image3].filter(Boolean).map((img, i) => (
                                        <Col key={i}>
                                            <Image width={120} src={`${backendURL}/storage/execution_task/${img}`} />
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        ))}
                    </>
                ) : (
                    <Empty description="Không có công việc thi công" />
                )}
            </TabPane>

            {/* Tab 5 – Lịch sử từ chối */}
            <TabPane tab="Lịch sử từ chối" key="5">
                {data?.rejectHistory && data?.rejectHistory.length > 0 ? (
                    <Timeline>
                        {data?.rejectHistory.map((item, idx) => (
                            <Timeline.Item key={idx} color="red">
                                <Text strong>{item.reasonName}</Text>
                                <p>{item.note || 'Không có'}</p>
                                <p>{dayjs(item.rejectedAt).format("DD/MM/YYYY HH:mm")}</p>
                                <p>{item.rejectedBy}</p>
                            </Timeline.Item>
                        ))}
                    </Timeline>
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
            width={1100}
            title={<Title level={4}>Chi tiết lịch sử bảo trì</Title>}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !data ? (
                <Empty description="Không tìm thấy thông tin" />
            ) : (
                renderTabs()
            )}
        </Modal>
    );
};

export default ViewMaintenanceHistoryDetail;
