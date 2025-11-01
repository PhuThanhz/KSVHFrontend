import { useState } from "react";
import {
    Tabs,
    Card,
    Tag,
    Row,
    Col,
    Typography,
    Button,
    Image,
    Input,
    DatePicker,
    Spin,
    Empty,
    Modal,
} from "antd";
import dayjs from "dayjs";
import { useMaintenanceRequestsQuery } from "@/hooks/useMaintenanceRequests";
import ViewMaintenanceDetail from "@/components/admin/maintenance/view/view.maintenance-detail";
import ModalAssignTechnician from "@/components/admin/maintenance/modal/modal.maintenance-assign";
import ModalCreateMaintenance from "@/components/admin/maintenance/modal/modal.maintenance-create";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const MaintenancePage = () => {
    const [query, setQuery] = useState("page=1&pageSize=20");
    const [activeTab, setActiveTab] = useState("ALL");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, isLoading } = useMaintenanceRequestsQuery(query);
    const requests = data?.result || [];

    // Lọc theo tab
    const filtered =
        activeTab === "ALL"
            ? requests
            : requests.filter((r) => r.requestInfo.status === "CHO_PHAN_CONG");

    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <Title level={3} style={{ margin: 0 }}>
                    Yêu cầu bảo trì
                </Title>
                <Button type="primary" onClick={() => setShowCreateModal(true)}>
                    + Tạo phiếu bảo trì
                </Button>
            </div>

            {/* Tabs */}
            <Tabs
                defaultActiveKey="ALL"
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                items={[
                    {
                        key: "ALL",
                        label: (
                            <>
                                Danh sách yêu cầu{" "}
                                <Tag color="blue">{requests.length || 0}</Tag>
                            </>
                        ),
                    },
                    {
                        key: "CHO_PHAN_CONG",
                        label: (
                            <>
                                Yêu cầu chờ phân công{" "}
                                <Tag color="red">
                                    {requests.filter(
                                        (r) =>
                                            r.requestInfo.status ===
                                            "CHO_PHAN_CONG"
                                    ).length || 0}
                                </Tag>
                            </>
                        ),
                    },
                ]}
            />

            {/* Bộ lọc tìm kiếm */}
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 16,
                    flexWrap: "wrap",
                }}
            >
                <Input.Search
                    placeholder="Mã phiếu hoặc tên thiết bị"
                    onSearch={(value) =>
                        setQuery(
                            `page=1&pageSize=20&search=${encodeURIComponent(
                                value
                            )}`
                        )
                    }
                    style={{ width: 260 }}
                    allowClear
                />
                <RangePicker
                    onChange={(dates) => {
                        if (dates && dates[0] && dates[1]) {
                            const start = dates[0].format("YYYY-MM-DD");
                            const end = dates[1].format("YYYY-MM-DD");
                            setQuery(
                                `page=1&pageSize=20&start=${start}&end=${end}`
                            );
                        }
                    }}
                />
            </div>

            {/* Danh sách phiếu */}
            {isLoading ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : filtered.length === 0 ? (
                <Empty description="Không có phiếu bảo trì nào" />
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {filtered.map((item) => {
                        const info = item.requestInfo;
                        const reject = item.rejectInfo;
                        const attachments = [
                            info.attachment1,
                            info.attachment2,
                            info.attachment3,
                        ].filter(Boolean);

                        const createdAt = info.createdAt
                            ? dayjs(info.createdAt).format("DD/MM/YYYY HH:mm")
                            : "-";

                        const priorityColor =
                            info.priorityLevel === "KHAN_CAP"
                                ? "red"
                                : info.priorityLevel === "CAO"
                                    ? "orange"
                                    : info.priorityLevel === "TRUNG_BINH"
                                        ? "blue"
                                        : "green";

                        const isCustomer = info.creatorType === "CUSTOMER";

                        return (
                            <Card
                                key={info.requestId}
                                bordered
                                hoverable
                                bodyStyle={{ padding: 16 }}
                                style={{
                                    borderRadius: 8,
                                    border: "1px solid #e8e8e8",
                                }}
                            >
                                <Row gutter={[12, 12]} align="middle">
                                    {/* Hình ảnh */}
                                    <Col xs={24} sm={6} md={5}>
                                        {attachments.length > 0 ? (
                                            <Image
                                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/MAINTENANCE_REQUEST/${attachments[0]}`}
                                                alt={info.deviceName}
                                                width="100%"
                                                height={120}
                                                style={{
                                                    objectFit: "cover",
                                                    borderRadius: 6,
                                                    border: "1px solid #e8e8e8",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: 120,
                                                    background: "#f5f5f5",
                                                    borderRadius: 6,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    color: "#aaa",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Không có ảnh
                                            </div>
                                        )}
                                    </Col>

                                    {/* Thông tin chính */}
                                    <Col xs={24} sm={18} md={19}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <Text strong style={{ fontSize: 15 }}>
                                                        {info.deviceName ||
                                                            "Thiết bị không xác định"}
                                                    </Text>
                                                    <Tag
                                                        color={
                                                            isCustomer
                                                                ? "purple"
                                                                : "blue"
                                                        }
                                                    >
                                                        {isCustomer
                                                            ? "Khách hàng"
                                                            : "Nội bộ"}
                                                    </Tag>
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: 6,
                                                        fontSize: 13,
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    <p style={{ margin: "2px 0" }}>
                                                        <Text type="secondary">
                                                            Mã phiếu:{" "}
                                                        </Text>
                                                        <Text strong>
                                                            {info.requestCode}
                                                        </Text>
                                                    </p>
                                                    <p style={{ margin: "2px 0" }}>
                                                        <Text type="secondary">
                                                            Loại bảo trì:{" "}
                                                        </Text>
                                                        <Tag color="blue">
                                                            {info.maintenanceType}
                                                        </Tag>
                                                    </p>
                                                    <p style={{ margin: "2px 0" }}>
                                                        <Text type="secondary">
                                                            Trạng thái:{" "}
                                                        </Text>
                                                        <Tag color="gold">
                                                            {info.status}
                                                        </Tag>
                                                    </p>

                                                    {/* Phân biệt hiển thị theo loại người tạo */}
                                                    {isCustomer ? (
                                                        <p style={{ margin: "2px 0" }}>
                                                            <Text type="secondary">
                                                                Địa điểm:{" "}
                                                            </Text>
                                                            {info.locationDetail ||
                                                                "-"}
                                                        </p>
                                                    ) : (
                                                        <>
                                                            <p style={{ margin: "2px 0" }}>
                                                                <Text type="secondary">
                                                                    Công ty:{" "}
                                                                </Text>
                                                                {info.companyName ||
                                                                    "-"}
                                                            </p>
                                                            <p style={{ margin: "2px 0" }}>
                                                                <Text type="secondary">
                                                                    Phòng ban:{" "}
                                                                </Text>
                                                                {info.departmentName ||
                                                                    "-"}
                                                            </p>
                                                            <p style={{ margin: "2px 0" }}>
                                                                <Text type="secondary">
                                                                    Địa chỉ cụ thể:{" "}
                                                                </Text>
                                                                {info.locationDetail ||
                                                                    "-"}
                                                            </p>
                                                        </>
                                                    )}

                                                    {/* Lý do từ chối */}
                                                    {reject && (
                                                        <div
                                                            style={{
                                                                marginTop: 6,
                                                                background:
                                                                    "#fff3f3",
                                                                padding: 8,
                                                                borderRadius: 6,
                                                                border: "1px solid #f0caca",
                                                            }}
                                                        >
                                                            <Text
                                                                type="danger"
                                                                strong
                                                            >
                                                                Bị từ chối:{" "}
                                                            </Text>
                                                            <Text>
                                                                {reject.reasonName}
                                                            </Text>
                                                            {reject.note && (
                                                                <p
                                                                    style={{
                                                                        margin: 0,
                                                                        fontSize: 12,
                                                                        color: "#555",
                                                                    }}
                                                                >
                                                                    Ghi chú:{" "}
                                                                    {reject.note}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Cột phải */}
                                            <div
                                                style={{
                                                    textAlign: "right",
                                                    minWidth: 180,
                                                }}
                                            >
                                                <Tag
                                                    color={priorityColor}
                                                    style={{ marginBottom: 6 }}
                                                >
                                                    {info.priorityLevel}
                                                </Tag>
                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        color: "#888",
                                                    }}
                                                >
                                                    Ngày tạo: {createdAt}
                                                </div>
                                                <div style={{ marginTop: 8 }}>
                                                    <Button
                                                        size="small"
                                                        type="primary"
                                                        style={{ marginRight: 6 }}
                                                        onClick={() =>
                                                            setSelectedId(
                                                                info.requestId!
                                                            )
                                                        }
                                                    >
                                                        Thông tin chi tiết
                                                    </Button>
                                                    {info.status ===
                                                        "CHO_PHAN_CONG" && (
                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    setShowAssignModal(
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                Phân công
                                                            </Button>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Modal chi tiết phiếu */}
            {selectedId && (
                <Modal
                    open={!!selectedId}
                    onCancel={() => setSelectedId(null)}
                    title="Chi tiết phiếu bảo trì"
                    footer={null}
                    width={900}
                >
                    <ViewMaintenanceDetail requestId={selectedId} />
                </Modal>
            )}

            {/* Modal phân công */}
            <ModalAssignTechnician
                open={showAssignModal}
                requestId={selectedId}
                onClose={() => setShowAssignModal(false)}
                onSuccess={() => setShowAssignModal(false)}
            />

            {/* Modal tạo phiếu */}
            <ModalCreateMaintenance
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => setShowCreateModal(false)}
            />
        </div>
    );
};

export default MaintenancePage;
