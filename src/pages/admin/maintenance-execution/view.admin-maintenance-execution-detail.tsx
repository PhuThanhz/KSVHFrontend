import {
    Modal,
    Descriptions,
    Divider,
    Typography,
    Spin,
    Empty,
    Tabs,
    Tag,
    Image,
    Row,
    Col,
    Card
} from "antd";

import dayjs from "dayjs";
import { useAdminExecutionDetailQuery } from "@/hooks/useAdminExecutions";


const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId?: string | null;
}

const ViewAdminExecutionDetail = ({ open, onClose, requestId }: IProps) => {
    const { data, isLoading, isError } = useAdminExecutionDetailQuery(
        requestId || undefined
    );

    const requestInfo = data?.requestInfo;
    const surveyInfo = data?.surveyInfo;
    const planInfo = data?.planInfo;
    const technicians = data?.technicians || [];

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const device = requestInfo?.device;

    const deviceImages = [device?.image1, device?.image2, device?.image3].filter(Boolean);
    const surveyImages = [
        surveyInfo?.attachment1,
        surveyInfo?.attachment2,
        surveyInfo?.attachment3,
    ].filter(Boolean);

    /** ===================== RENDER TASKS ===================== */
    const renderTaskItem = (task: any) => {
        const attachments = [task.image1, task.image2, task.image3, task.video].filter(Boolean);

        return (
            <Card
                key={task.id}
                style={{ marginBottom: 14, borderRadius: 8 }}
                bodyStyle={{ padding: 16 }}
            >
                <Row>
                    <Col span={18}>
                        <Text strong>{task.content}</Text>

                        <div style={{ marginTop: 6 }}>
                            Trạng thái:{" "}
                            {task.done ? (
                                <Tag color="green">Hoàn thành</Tag>
                            ) : (
                                <Tag color="red">Chưa xong</Tag>
                            )}
                        </div>

                        {task.doneAt && (
                            <div>
                                <Text type="secondary">
                                    {dayjs(task.doneAt).format("DD/MM/YYYY HH:mm")}
                                </Text>
                            </div>
                        )}

                        {task.doneBy && (
                            <div>
                                Người thực hiện: <Text strong>{task.doneBy}</Text>
                            </div>
                        )}

                        {task.note && (
                            <div style={{ marginTop: 6 }}>
                                Ghi chú: <Text type="secondary">{task.note}</Text>
                            </div>
                        )}
                    </Col>

                    <Col span={6}>
                        {attachments.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {attachments.map((f: string, idx: number) => {
                                    const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(f);
                                    const isVid = /\.(mp4|mov|avi|mkv|webm)$/i.test(f);

                                    return isImg ? (
                                        <Image
                                            key={idx}
                                            width={80}
                                            height={80}
                                            src={`${backendURL}/storage/execution_task/${f}`}
                                            style={{
                                                borderRadius: 6,
                                                objectFit: "cover",
                                                border: "1px solid #eee",
                                            }}
                                        />
                                    ) : isVid ? (
                                        <video
                                            key={idx}
                                            src={`${backendURL}/storage/execution_task/${f}`}
                                            controls
                                            style={{
                                                width: 100,
                                                height: 80,
                                                borderRadius: 6,
                                                border: "1px solid #eee",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : null;
                                })}
                            </div>
                        )}
                    </Col>
                </Row>
            </Card>
        );
    };

    /** ===================== RENDER DANH SÁCH KTV ===================== */
    const renderTechnicians = () => {
        if (!technicians.length) return <Text type="secondary">Không có kỹ thuật viên</Text>;

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {technicians.map((t) => (
                    <div key={t.id}>
                        <Text strong>{t.fullName}</Text>{" "}
                        {t.isMain ? (
                            <Tag color="blue">Chính</Tag>
                        ) : (
                            <Tag color="green">Hỗ trợ</Tag>
                        )}
                        {t.phone && (
                            <>
                                {" "}
                                - <Text type="secondary">{t.phone}</Text>
                            </>
                        )}
                        {t.email && (
                            <>
                                {" "}
                                - <Text type="secondary">{t.email}</Text>
                            </>
                        )}
                    </div>
                ))}
            </div>
        );
    };


    /** ===================== RENDER TABS ===================== */
    const renderTabs = () => (
        <Tabs defaultActiveKey="1">
            {/* TAB 1: THÔNG TIN PHIẾU */}
            <TabPane tab="Thông tin phiếu" key="1">
                <Descriptions bordered size="small" column={2}>
                    <Descriptions.Item label="Mã phiếu">
                        {requestInfo?.requestCode}
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        <Tag color="blue">{requestInfo?.status}</Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Tên thiết bị">
                        {device?.deviceName || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Mã thiết bị">
                        {device?.deviceCode || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Vị trí">
                        {requestInfo?.locationDetail || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Đơn vị">
                        {device?.companyName || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Phòng ban">
                        {device?.departmentName || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày tạo phiếu">
                        {requestInfo?.createdAt
                            ? dayjs(requestInfo.createdAt).format("DD/MM/YYYY HH:mm")
                            : "-"}
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={5}>Ảnh thiết bị</Title>
                {deviceImages.length > 0 ? (
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
            </TabPane>

            {/* TAB 2: KHẢO SÁT */}
            <TabPane tab="Khảo sát" key="2">
                {surveyInfo ? (
                    <>
                        <Descriptions bordered size="small" column={2}>
                            <Descriptions.Item label="Kỹ thuật viên khảo sát">
                                {surveyInfo.technicianName || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày khảo sát">
                                {surveyInfo.surveyDate
                                    ? dayjs(surveyInfo.surveyDate).format("DD/MM/YYYY HH:mm")
                                    : "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Nguyên nhân">
                                {surveyInfo.causeName || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Mức độ hư hại">
                                {surveyInfo.damageLevel || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Loại bảo trì thực tế">
                                {surveyInfo.maintenanceTypeActual || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Mô tả sự cố thực tế">
                                {surveyInfo.actualIssueDescription || "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <Title level={5}>Ảnh / Video khảo sát</Title>

                        {surveyImages.length > 0 ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                {surveyImages.map((f, idx) => {
                                    const file = f as string;
                                    const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                                    const isVid = /\.(mp4|mov|avi|mkv|webm)$/i.test(file);

                                    return isImg ? (
                                        <Image
                                            key={idx}
                                            width={120}
                                            height={120}
                                            src={`${backendURL}/storage/survey_attachment/${file}`}
                                            style={{
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                border: "1px solid #f0f0f0",
                                            }}
                                        />
                                    ) : isVid ? (
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
                                    ) : null;
                                })}
                            </div>
                        ) : (
                            <Empty description="Không có hình ảnh khảo sát" />
                        )}
                    </>
                ) : (
                    <Empty description="Không có thông tin khảo sát" />
                )}
            </TabPane>

            {/* TAB 3: KẾ HOẠCH */}
            <TabPane tab="Kế hoạch" key="3">
                {planInfo ? (
                    <Descriptions bordered size="small" column={2}>
                        <Descriptions.Item label="Phương án">
                            {planInfo.solutionName || "-"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            {planInfo.createdAt
                                ? dayjs(planInfo.createdAt).format("DD/MM/YYYY HH:mm")
                                : "-"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Vật tư">
                            {planInfo.useMaterial ? "Có sử dụng" : "Không sử dụng"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ghi chú">
                            {planInfo.note || "-"}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Empty description="Không có kế hoạch" />
                )}
            </TabPane>

            {/* TAB 4: TIẾN ĐỘ THI CÔNG */}
            <TabPane tab="Tiến độ thi công" key="4">
                <Descriptions bordered size="small" column={1}>
                    <Descriptions.Item label="Kỹ thuật viên thực hiện">
                        {renderTechnicians()}
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={5}>Danh sách công việc</Title>

                {data?.tasks?.length ? (
                    data.tasks.map((task) => renderTaskItem(task))
                ) : (
                    <Empty description="Không có công việc" />
                )}
            </TabPane>
        </Tabs>
    );

    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={980}
            title={<Title level={4}>Chi tiết thi công</Title>}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !data ? (
                <Empty description="Không tìm thấy dữ liệu" />
            ) : (
                renderTabs()
            )}
        </Modal>
    );
};

export default ViewAdminExecutionDetail;
