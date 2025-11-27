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
import ModalCompleteExecution from "./modal.complete-execution";
import ModalUpdateTasks from "./modal.update-tasks";
import ViewExecutionDetail from "./view.execution-detail";

import type { MaintenanceRequestStatus, IResExecutionCardDTO } from "@/types/backend";
import ModalRequestSupport from "./modal.request-support";

const { Title, Text } = Typography;

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

    const [openSupportModal, setOpenSupportModal] = useState(false);

    const handleOpenModal = (
        type: "start" | "update" | "complete" | "view" | "support",
        id: string,
        code?: string
    ) => {
        setSelectedRequestId(id);
        setSelectedRequestCode(code || null);

        if (type === "start") setOpenStartModal(true);
        if (type === "update") setOpenUpdateModal(true);
        if (type === "complete") setOpenCompleteModal(true);
        if (type === "view") setOpenViewModal(true);
        if (type === "support") setOpenSupportModal(true);
    };


    /** Load lại dữ liệu sau khi update */
    const handleActionSuccess = () => {
        message.success("Cập nhật trạng thái thành công!");
        refetch();
    };

    /** Status → Step index */
    const getStepIndex = (status: MaintenanceRequestStatus): number => {
        switch (status) {
            case "DA_PHE_DUYET":
                return 0;
            case "DANG_BAO_TRI":
                return 1;
            case "CHO_NGHIEM_THU":
            case "TU_CHOI_NGHIEM_THU":
                return 2;
            case "HOAN_THANH":
                return 3;
            default:
                return 0;
        }
    };

    /** Status → Tag color */
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
            case "TU_CHOI_NGHIEM_THU":
                return "red";
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
                    const deviceImages = [
                        item.deviceImage1,
                        item.deviceImage2,
                        item.deviceImage3,
                    ].filter(Boolean);

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
                                {/* ==== HÌNH ẢNH ==== */}
                                <Col xs={24} md={7} style={{ textAlign: "center" }}>
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
                                                        src={`${backendURL}/storage/DEVICE/${img}`}
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

                                <Col xs={24} md={17}>
                                    {/* ==== TAG ==== */}
                                    <Space size="small" wrap>
                                        <Tag color="blue">{item.requestCode}</Tag>
                                        <Tag color={getStatusColor(item.status)}>
                                            {item.status === "TU_CHOI_NGHIEM_THU"
                                                ? "Bị từ chối nghiệm thu"
                                                : item.status}
                                        </Tag>
                                        <Tag color="gold">
                                            {item.createdAt
                                                ? dayjs(item.createdAt).format("DD/MM/YYYY")
                                                : "-"}
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

                                    {/* ==== TIẾN ĐỘ ==== */}
                                    {typeof item.totalTasks === "number" && typeof item.completedTasks === "number" && (
                                        <div style={{ marginTop: 10 }}>
                                            <Text strong>Tiến độ công việc: </Text>
                                            <Tag color="blue">
                                                {item.completedTasks}/{item.totalTasks} (
                                                {item.totalTasks > 0
                                                    ? Math.round((item.completedTasks / item.totalTasks) * 100)
                                                    : 0}
                                                %)
                                            </Tag>
                                        </div>
                                    )}

                                    <Divider style={{ margin: "10px 0" }} />


                                    {/* ==== STEPS ==== */}
                                    <Steps
                                        size="small"
                                        current={getStepIndex(item.status)}
                                        items={[
                                            { title: "Chờ thi công" },
                                            { title: "Đang bảo trì" },
                                            {
                                                title:
                                                    item.status === "TU_CHOI_NGHIEM_THU"
                                                        ? "Bị từ chối - Làm lại"
                                                        : "Chờ nghiệm thu",
                                            },
                                            { title: "Hoàn thành" },
                                        ]}
                                    />

                                    {/* ==== BOX RED WHEN REJECTED ==== */}
                                    {item.rejectInfo && (
                                        <div
                                            style={{
                                                marginTop: 15,
                                                border: "1px solid #ffccc7",
                                                background: "#fff1f0",
                                                padding: 12,
                                                borderRadius: 8,
                                            }}
                                        >
                                            <Text strong style={{ color: "#cf1322" }}>
                                                Phiếu bị từ chối nghiệm thu
                                            </Text>

                                            <div style={{ marginTop: 6 }}>
                                                <p>
                                                    <Text strong>Lý do:</Text>{" "}
                                                    {item.rejectInfo.reasonName}
                                                </p>
                                                <p>
                                                    <Text strong>Ghi chú:</Text>{" "}
                                                    {item.rejectInfo.note || "-"}
                                                </p>

                                                <p
                                                    style={{
                                                        marginTop: 6,
                                                        color: "#999",
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {dayjs(item.rejectInfo.rejectedAt).format(
                                                        "DD/MM/YYYY HH:mm"
                                                    )}{" "}
                                                    – Người từ chối: {item.rejectInfo.rejectedBy}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <Divider style={{ margin: "10px 0" }} />

                                    {/* ==== NÚT HÀNH ĐỘNG ==== */}
                                    <Space wrap>
                                        {(item.status === "DA_PHE_DUYET" ||
                                            item.status === "TU_CHOI_NGHIEM_THU") && (
                                                <Button
                                                    type="primary"
                                                    icon={<PlayCircleOutlined />}
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            "start",
                                                            item.requestId,
                                                            item.requestCode
                                                        )
                                                    }
                                                >
                                                    {item.status === "TU_CHOI_NGHIEM_THU"
                                                        ? "Làm lại thi công"
                                                        : "Bắt đầu thi công"}
                                                </Button>
                                            )}

                                        {item.status === "DANG_BAO_TRI" && (
                                            <>
                                                <Button
                                                    icon={<EditOutlined />}
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            "update",
                                                            item.requestId,
                                                            item.requestCode
                                                        )
                                                    }
                                                >
                                                    Cập nhật task
                                                </Button>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => handleOpenModal("support", item.requestId, item.requestCode)}
                                                >
                                                    Gửi yêu cầu hỗ trợ
                                                </Button>
                                                <Button
                                                    danger
                                                    icon={<CheckCircleOutlined />}
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            "complete",
                                                            item.requestId,
                                                            item.requestCode
                                                        )
                                                    }
                                                >
                                                    Hoàn thành
                                                </Button>
                                            </>
                                        )}

                                        <Button
                                            icon={<EyeOutlined />}
                                            onClick={() =>
                                                handleOpenModal(
                                                    "view",
                                                    item.requestId,
                                                    item.requestCode
                                                )
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

            <ModalUpdateTasks
                open={openUpdateModal}
                onClose={setOpenUpdateModal}
                requestId={selectedRequestId}
                requestCode={selectedRequestCode}
                onSuccess={handleActionSuccess}
            />
            <ModalRequestSupport
                open={openSupportModal}
                onClose={setOpenSupportModal}
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
