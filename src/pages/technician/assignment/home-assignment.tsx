import { useState } from "react";
import {
    Card,
    Row,
    Col,
    Space,
    Tag,
    Button,
    Image,
    Typography,
    Popconfirm,
    Divider,
    Empty,
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import {
    useTechnicianAssignmentsQuery,
    useAcceptTechnicianAssignmentMutation,
} from "@/hooks/useTechnicianAssignments";
import ModalRejectAssignment from "./modal.technician.assignment";
import ViewTechnicianAssignment from "./view.technician.assignment";
import queryString from "query-string";
import dayjs from "dayjs";

const { Text, Title } = Typography;

const TechnicianAssignmentPage = () => {
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | number | null>(null);
    const [openViewModal, setOpenViewModal] = useState(false);

    const [query] = useState<string>(() =>
        queryString.stringify({
            page: 1,
            size: 20,
            sort: "assignedAt,desc",
        })
    );

    const { data, isFetching } = useTechnicianAssignmentsQuery(query);
    const { mutate: acceptAssignment, isPending: isAccepting } =
        useAcceptTechnicianAssignmentMutation();

    const assignments = data?.result || [];
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    return (
        <div style={{ padding: "24px 36px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
                Danh sách công việc được phân công cho kỹ thuật viên
            </h2>

            {isFetching && <p>Đang tải dữ liệu...</p>}

            {(!assignments || assignments.length === 0) && !isFetching ? (
                <Empty description="Không có công việc nào được phân công" />
            ) : (
                <Space direction="vertical" size={20} style={{ width: "100%" }}>
                    {assignments.map((item) => {
                        const { requestInfo } = item;
                        const device = requestInfo.device || {};
                        const attachmentImages = [
                            requestInfo.attachment1,
                            requestInfo.attachment2,
                            requestInfo.attachment3,
                        ].filter(Boolean);
                        const deviceImages = [
                            device.image1,
                            device.image2,
                            device.image3,
                        ].filter(Boolean);

                        return (
                            <Card
                                key={item.id}
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
                                    {/* Cột ảnh minh chứng */}
                                    <Col xs={24} md={8} lg={7}>
                                        <Title
                                            level={5}
                                            style={{ textAlign: "center", marginBottom: 12 }}
                                        >
                                            Ảnh phiếu bảo trì
                                        </Title>

                                        {attachmentImages.length > 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 10,
                                                    justifyContent: "center",
                                                    marginBottom: 16,
                                                }}
                                            >
                                                {attachmentImages.map((img, idx) => (
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
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                    color: "#999",
                                                    marginBottom: 16,
                                                }}
                                            >
                                                Không có hình ảnh phiếu
                                            </div>
                                        )}

                                        <Title
                                            level={5}
                                            style={{ textAlign: "center", marginBottom: 12 }}
                                        >
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

                                            <h3
                                                style={{
                                                    fontWeight: 600,
                                                    marginTop: 6,
                                                    marginBottom: 8,
                                                }}
                                            >
                                                {requestInfo.issueName || "Chưa có tên sự cố"}
                                            </h3>

                                            <Row gutter={[8, 8]}>
                                                <Col span={12}>
                                                    <Text strong>Người tạo:</Text>{" "}
                                                    {requestInfo.fullName}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Vị trí:</Text>{" "}
                                                    {requestInfo.locationDetail ?? "-"}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Ngày tạo phiếu:</Text>{" "}
                                                    {dayjs(requestInfo.createdAt).format(
                                                        "DD-MM-YYYY HH:mm"
                                                    )}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Người phân công:</Text>{" "}
                                                    {item.assignedBy ?? "-"}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Thời gian phân công:</Text>{" "}
                                                    {dayjs(item.assignedAt).format("DD-MM-YYYY HH:mm")}
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong>Ghi chú:</Text>{" "}
                                                    {requestInfo.note ?? "-"}
                                                </Col>
                                            </Row>

                                            <Divider style={{ margin: "10px 0" }} />

                                            <div>
                                                <Title level={5}>Thông tin thiết bị</Title>
                                                <Row gutter={[8, 4]}>
                                                    <Col span={12}>
                                                        <Text>Mã thiết bị:</Text>{" "}
                                                        <b>{device.deviceCode}</b>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text>Tên thiết bị:</Text>{" "}
                                                        <b>{device.deviceName}</b>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text>Công ty:</Text>{" "}
                                                        {device.companyName ?? "-"}
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text>Bộ phận:</Text>{" "}
                                                        {device.departmentName ?? "-"}
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text>Loại sở hữu:</Text>{" "}
                                                        {device.ownershipType === "CUSTOMER" ? (
                                                            <Tag color="magenta">
                                                                Thiết bị khách hàng
                                                            </Tag>
                                                        ) : (
                                                            <Tag color="green">Thiết bị nội bộ</Tag>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </div>

                                            <Divider style={{ margin: "10px 0" }} />

                                            <Space>
                                                <Popconfirm
                                                    title="Xác nhận nhận việc"
                                                    description="Bạn có chắc chắn muốn nhận công việc này không?"
                                                    okText="Đồng ý"
                                                    cancelText="Hủy"
                                                    onConfirm={() => {
                                                        if (!item.id) return;
                                                        acceptAssignment(item.id);
                                                    }}
                                                >
                                                    <Button
                                                        icon={<CheckOutlined />}
                                                        type="primary"
                                                        loading={isAccepting}
                                                    >
                                                        Nhận việc
                                                    </Button>
                                                </Popconfirm>
                                                <Button
                                                    icon={<CloseOutlined />}
                                                    danger
                                                    onClick={() => {
                                                        setSelectedAssignmentId(item.id!);
                                                        setOpenRejectModal(true);
                                                    }}
                                                >
                                                    Từ chối
                                                </Button>
                                                <Button
                                                    icon={<EyeOutlined />}
                                                    onClick={() => {
                                                        setSelectedAssignmentId(item.id!);
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

            {/* Modal từ chối */}
            <ModalRejectAssignment
                openModal={openRejectModal}
                setOpenModal={setOpenRejectModal}
                assignmentId={selectedAssignmentId}
            />

            {/* Modal xem chi tiết */}
            <ViewTechnicianAssignment
                open={openViewModal}
                onClose={setOpenViewModal}
                assignmentId={selectedAssignmentId}
            />
        </div>
    );
};

export default TechnicianAssignmentPage;
