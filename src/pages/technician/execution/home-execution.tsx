import { useState } from "react";
import {
    Card,
    Row,
    Col,
    Space,
    Tag,
    Button,
    Typography,
    Divider,
    Image,
    Empty,
    Steps,
    Spin,
    message,
} from "antd";
import {
    PlayCircleOutlined,
    EyeOutlined,
    EditOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import queryString from "query-string";
import dayjs from "dayjs";
import { useApprovedExecutionsQuery } from "@/hooks/maintenance/useMaintenanceExecutions";
import ModalStartExecution from "./modal.start-execution";
import ModalUpdateProgress from "./modal.update-progress";
import ModalCompleteExecution from "./modal.complete-execution";
import ViewExecutionDetail from "./view.execution-detail";
import type { MaintenanceRequestStatus, IResExecutionCardDTO } from "@/types/backend";

const { Title, Text } = Typography;

/** ===================== HomeExecution - Danh sách phiếu được duyệt để thi công ===================== */
const HomeExecution = () => {
    const [openStartModal, setOpenStartModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openCompleteModal, setOpenCompleteModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [selectedRequestCode, setSelectedRequestCode] = useState<string | null>(null);

    const [query] = useState<string>(() =>
        queryString.stringify({
            page: 1,
            size: 20,
            sort: "createdAt,desc",
        })
    );

    const { data, isFetching, refetch } = useApprovedExecutionsQuery(query);
    const executions: IResExecutionCardDTO[] = data?.result || [];
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    /** Mở modal hành động */
    const handleOpenModal = (
        type: "start" | "update" | "complete" | "view",
        id: string,
        code?: string
    ) => {
        setSelectedRequestId(id);
        setSelectedRequestCode(code || null);
        if (type === "start") setOpenStartModal(true);
        if (type === "update") setOpenUpdateModal(true);
        if (type === "complete") setOpenCompleteModal(true);
        if (type === "view") setOpenViewModal(true);
    };

    /** Sau khi hành động thành công */
    const handleActionSuccess = () => {
        message.success("Cập nhật trạng thái thành công!");
        refetch();
    };

    /** Ánh xạ trạng thái → số bước step */
    const getStepIndex = (status: MaintenanceRequestStatus): number => {
        switch (status) {
            case "DA_PHE_DUYET":
                return 0; // chờ thi công
            case "DANG_BAO_TRI":
                return 1; // đang bảo trì
            case "CHO_NGHIEM_THU":
                return 2; // chờ nghiệm thu
            case "HOAN_THANH":
                return 3; // hoàn thành
            default:
                return 0;
        }
    };

    /** Màu trạng thái */
    const getStatusColor = (status: MaintenanceRequestStatus): string => {
        switch (status) {
            case "DA_PHE_DUYET":
                return "blue";
            case "DANG_BAO_TRI":
                return "orange";
            case "CHO_NGHIEM_THU":
                return "gold";
            case "HOAN_THANH":
                return "green";
            default:
                return "default";
        }
    };

    return (
        <div style={{ padding: "24px 36px" }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                Danh sách phiếu được duyệt để thi công
            </Title>

            {isFetching && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <Spin tip="Đang tải dữ liệu..." />
                </div>
            )}

            {!isFetching && executions.length === 0 && (
                <Empty description="Không có phiếu thi công nào" />
            )}

            <Space direction="vertical" size={20} style={{ width: "100%" }}>
                {executions.map((item) => {
                    const deviceImages = [item.attachment1, item.attachment2, item.attachment3].filter(
                        Boolean
                    );
                    return (
                        <Card
                            key={item.requestId}
                            style={{
                                borderRadius: 10,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                background: "#fff",
                            }}
                            bodyStyle={{ padding: 20 }}
                        >
                            <Row gutter={16} align="top">
                                {/* ========== Ảnh thiết bị ========== */}
                                <Col xs={24} md={7} style={{ textAlign: "center" }}>
                                    <Title level={5}>Ảnh thiết bị</Title>
                                    {deviceImages.length > 0 ? (
                                        <Image.PreviewGroup>
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
                                                        width={110}
                                                        height={110}
                                                        src={`${backendURL}/storage/MAINTENANCE_REQUEST/${img}`}
                                                        alt={`device-${idx}`}
                                                        style={{
                                                            borderRadius: 8,
                                                            objectFit: "cover",
                                                            border: "1px solid #eee",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </Image.PreviewGroup>
                                    ) : (
                                        <Text type="secondary">Không có hình ảnh</Text>
                                    )}
                                </Col>

                                {/* ========== Thông tin phiếu ========== */}
                                <Col xs={24} md={17}>
                                    <Space size="small" wrap>
                                        <Tag color="blue">{item.requestCode}</Tag>
                                        <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                                        <Tag color="gold">
                                            {item.createdAt ? dayjs(item.createdAt).format("DD/MM/YYYY") : "-"}
                                        </Tag>
                                    </Space>

                                    <Title level={5} style={{ marginTop: 6 }}>
                                        {item.deviceName || "Chưa có tên thiết bị"}
                                    </Title>

                                    <Row gutter={[8, 8]}>
                                        <Col span={12}>
                                            <Text strong>Thiết bị:</Text> {item.deviceCode || "-"}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Vị trí:</Text> {item.locationDetail || "-"}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Đơn vị:</Text> {item.companyName || "-"}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Phòng ban:</Text> {item.departmentName || "-"}
                                        </Col>
                                    </Row>

                                    <Divider style={{ margin: "10px 0" }} />

                                    {/* ========== Tiến trình thi công ========== */}
                                    <Steps
                                        size="small"
                                        current={getStepIndex(item.status)}
                                        items={[
                                            { title: "Chờ thi công" },
                                            { title: "Đang bảo trì" },
                                            { title: "Chờ nghiệm thu" },
                                            { title: "Hoàn thành" },
                                        ]}
                                    />

                                    <Divider style={{ margin: "10px 0" }} />

                                    {/* ========== Hành động theo trạng thái ========== */}
                                    <Space>
                                        {item.status === "DA_PHE_DUYET" && (
                                            <Button
                                                type="primary"
                                                icon={<PlayCircleOutlined />}
                                                onClick={() =>
                                                    handleOpenModal("start", item.requestId, item.requestCode)
                                                }
                                            >
                                                Bắt đầu thi công
                                            </Button>
                                        )}

                                        {item.status === "DANG_BAO_TRI" && (
                                            <>
                                                <Button
                                                    icon={<EditOutlined />}
                                                    onClick={() =>
                                                        handleOpenModal("update", item.requestId, item.requestCode)
                                                    }
                                                >
                                                    Cập nhật tiến độ
                                                </Button>
                                                <Button
                                                    danger
                                                    icon={<CheckCircleOutlined />}
                                                    onClick={() =>
                                                        handleOpenModal("complete", item.requestId, item.requestCode)
                                                    }
                                                >
                                                    Hoàn thành
                                                </Button>
                                            </>
                                        )}

                                        <Button
                                            icon={<EyeOutlined />}
                                            onClick={() =>
                                                handleOpenModal("view", item.requestId, item.requestCode)
                                            }
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    );
                })}
            </Space>

            {/* ===== Modal ===== */}
            <ModalStartExecution
                open={openStartModal}
                onClose={setOpenStartModal}
                requestId={selectedRequestId}
                requestCode={selectedRequestCode}
                onSuccess={handleActionSuccess}
            />
            <ModalUpdateProgress
                open={openUpdateModal}
                onClose={setOpenUpdateModal}
                requestId={selectedRequestId}
            />
            <ModalCompleteExecution
                open={openCompleteModal}
                onClose={setOpenCompleteModal}
                requestId={selectedRequestId}
                requestCode={selectedRequestCode}
                onSuccess={handleActionSuccess}
            />
            <ViewExecutionDetail
                open={openViewModal}
                onClose={setOpenViewModal}
                requestId={selectedRequestId}
            />
        </div>
    );
};

export default HomeExecution;
