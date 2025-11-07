import {
    Modal,
    Descriptions,
    Typography,
    Badge,
    Divider,
    Spin,
    Empty,
    Image,
    Row,
    Col,
} from "antd";
import { useTechnicianAssignmentByIdQuery } from "@/hooks/useTechnicianAssignments";
import dayjs from "dayjs";

const { Title } = Typography;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    assignmentId?: string | number | null;
}

const ViewTechnicianAssignment = ({ open, onClose, assignmentId }: IProps) => {
    const { data: assignment, isLoading, isError } =
        useTechnicianAssignmentByIdQuery(assignmentId || undefined);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const requestInfo = assignment?.requestInfo;
    const device = requestInfo?.device || {};

    const deviceImages = [device.image1, device.image2, device.image3].filter(Boolean);
    const requestImages = [
        requestInfo?.attachment1,
        requestInfo?.attachment2,
        requestInfo?.attachment3,
    ].filter(Boolean);

    return (
        <Modal
            title={<Title level={4}>Chi tiết công việc được phân công</Title>}
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={950}
            centered
            bodyStyle={{
                paddingBottom: 32,
                maxHeight: "75vh",
                overflowY: "auto",
                overflowX: "hidden", // ✅ NGĂN scroll ngang
            }}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !assignment ? (
                <Empty description="Không tìm thấy thông tin công việc" />
            ) : (
                <>
                    {/* ================= Thông tin phiếu ================= */}
                    <Descriptions
                        bordered
                        column={2}
                        layout="vertical"
                        size="small"
                        labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                    >
                        <Descriptions.Item label="Mã phiếu">
                            {requestInfo?.requestCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái phiếu">
                            <Badge status="processing" text={requestInfo?.status} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Người tạo">
                            {requestInfo?.fullName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mức độ ưu tiên">
                            <Badge color="orange" text={requestInfo?.priorityLevel} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại bảo trì">
                            {requestInfo?.maintenanceType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo phiếu">
                            {dayjs(requestInfo?.createdAt).format("DD-MM-YYYY HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Người phân công">
                            {assignment.assignedBy ?? "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian phân công">
                            {dayjs(assignment.assignedAt).format("DD-MM-YYYY HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Vấn đề / Sự cố">
                            {requestInfo?.issueName ?? "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Vị trí cụ thể">
                            {requestInfo?.locationDetail ?? "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">
                            {requestInfo?.note ?? "-"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* ================= Thông tin thiết bị ================= */}
                    <Title level={5}>Thông tin thiết bị</Title>
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Mã thiết bị">
                            {device.deviceCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên thiết bị">
                            {device.deviceName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Công ty">
                            {device.companyName ?? "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Bộ phận">
                            {device.departmentName ?? "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại sở hữu">
                            {device.ownershipType === "CUSTOMER"
                                ? "Thiết bị khách hàng"
                                : "Thiết bị nội bộ"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* ================= Hình ảnh ================= */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Title level={5}>Ảnh phiếu bảo trì</Title>
                            {requestImages.length > 0 ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 12,
                                        justifyContent: "flex-start",
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

                        <Col xs={24} md={12}>
                            <Title level={5}>Ảnh thiết bị</Title>
                            {deviceImages.length > 0 ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 12,
                                        justifyContent: "flex-start",
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

export default ViewTechnicianAssignment;
