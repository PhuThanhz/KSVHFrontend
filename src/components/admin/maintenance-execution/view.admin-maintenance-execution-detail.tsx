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
    Progress,
    Row,
    Col,
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
    const progress = data?.progress;

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const device = requestInfo?.device;

    const deviceImages = [
        device?.image1,
        device?.image2,
        device?.image3,
    ].filter(Boolean);

    const surveyImages = [
        surveyInfo?.attachment1,
        surveyInfo?.attachment2,
        surveyInfo?.attachment3,
    ].filter(Boolean);

    const progressImages = [
        progress?.image1,
        progress?.image2,
        progress?.image3,
    ].filter(Boolean);

    const renderTabs = () => (
        <Tabs defaultActiveKey="1">

            {/* === TAB 1: THÔNG TIN PHIẾU === */}
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

                {/* === Ảnh thiết bị === */}
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

            {/* Tab 2 - Thông tin khảo sát */}
            <TabPane tab="Khảo sát" key="2">
                {surveyInfo ? (
                    <>
                        <Descriptions bordered size="small" column={2}>
                            <Descriptions.Item label="Kỹ thuật viên">
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
                                {surveyImages.map((file, idx) => {
                                    const f = file as string; // ép TS hiểu là string 100%

                                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(f);
                                    const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(f);

                                    return isImage ? (
                                        <Image
                                            key={idx}
                                            width={120}
                                            height={120}
                                            src={`${backendURL}/storage/survey_attachment/${f}`}
                                            style={{
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                border: "1px solid #f0f0f0",
                                            }}
                                        />
                                    ) : isVideo ? (
                                        <video
                                            key={idx}
                                            src={`${backendURL}/storage/survey_attachment/${f}`}
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
                            <Empty description="Không có hình ảnh hoặc video khảo sát" />
                        )}
                    </>
                ) : (
                    <Empty description="Không có thông tin khảo sát" />
                )}
            </TabPane>

            {/* === TAB 3: KẾ HOẠCH === */}
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
                            {planInfo.useMaterial ? "Có" : "Không"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ghi chú">
                            {planInfo.note || "-"}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Empty description="Không có kế hoạch" />
                )}
            </TabPane>

            {/* === TAB 4: TIẾN ĐỘ === */}
            <TabPane tab="Tiến độ" key="4">
                {progress ? (
                    <>
                        <Progress
                            percent={progress.progressPercent || 0}
                            status={progress.progressPercent === 100 ? "success" : "active"}
                            style={{ maxWidth: 300 }}
                        />

                        <Divider />

                        <Row gutter={16}>
                            <Col span={12}>
                                <Title level={5}>Ảnh tiến độ</Title>
                                {progressImages.length > 0 ? (
                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                        {progressImages.map((img, idx) => (
                                            <Image
                                                key={idx}
                                                width={120}
                                                height={120}
                                                src={`${backendURL}/storage/execution_progress/${img}`}
                                                style={{
                                                    borderRadius: 8,
                                                    objectFit: "cover",
                                                    border: "1px solid #f0f0f0",
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <Empty description="Không có ảnh tiến độ" />
                                )}
                            </Col>
                        </Row>

                        {progress.video && (
                            <>
                                <Divider />
                                <Title level={5}>Video thi công</Title>
                                <video
                                    src={`${backendURL}/storage/execution_progress/${progress.video}`}
                                    controls
                                    style={{ width: "100%", borderRadius: 8 }}
                                />
                            </>
                        )}
                    </>
                ) : (
                    <Empty description="Không có tiến độ" />
                )}
            </TabPane>

            {/* === TAB 5: KTV === */}
            <TabPane tab="Kỹ thuật viên" key="5">
                <Descriptions bordered size="small" column={1}>
                    <Descriptions.Item label="Tên KTV">
                        {data?.technicianName || "-"}
                    </Descriptions.Item>
                </Descriptions>
            </TabPane>
        </Tabs>
    );

    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={950}
            title={<Title level={4}>Chi tiết thi công (Admin)</Title>}
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
