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
    Pagination,
} from "antd";
import dayjs from "dayjs";
import { useMaintenanceRequestsQuery } from "@/hooks/useMaintenanceRequests";
import ViewMaintenanceDetail from "@/components/admin/maintenance/view/view.maintenance-detail";
import ModalCreateMaintenance from "@/components/admin/maintenance/modal/modal.maintenance-create";
import ButtonAssignTechnician from "@/components/admin/maintenance/button/button.assign-technician";
import RejectLogsModal from "@/components/admin/maintenance/modal/modal.reject-logs";
import ModalAutoAssignMaintenance from "@/components/admin/maintenance/modal/modal.maintenance-auto-assign";

import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const MaintenancePage = () => {
    const [activeTab, setActiveTab] = useState("ALL");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
    const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);

    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("page=1&pageSize=10");
    const [pageSize, setPageSize] = useState(10);

    const { data, isLoading } = useMaintenanceRequestsQuery(query);
    const requests = data?.result || [];

    const filtered =
        activeTab === "ALL"
            ? requests
            : requests.filter((r) => r.requestInfo.status === "CHO_PHAN_CONG");

    const handlePageChange = (newPage: number, newSize?: number) => {
        setPage(newPage);
        setPageSize(newSize || pageSize);
        setQuery(`page=${newPage}&pageSize=${newSize || pageSize}`);
    };

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

                <div style={{ display: "flex", gap: 8 }}>

                    <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.CREATE_INTERNAL} hideChildren>
                        <Button type="primary" onClick={() => setShowCreateModal(true)}>
                            + Tạo phiếu bảo trì
                        </Button>
                    </Access>
                    <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.AUTO_ASSIGN_ALL} hideChildren>
                        <Button type="default" onClick={() => setShowAutoAssignModal(true)}>
                            Phân công tự động
                        </Button>
                    </Access>
                </div>

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
                                Danh sách yêu cầu <Tag color="blue">{requests.length || 0}</Tag>
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
                                        (r) => r.requestInfo.status === "CHO_PHAN_CONG"
                                    ).length || 0}
                                </Tag>
                            </>
                        ),
                    },
                ]}
            />

            {/* Bộ lọc */}
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
                            `page=1&pageSize=${pageSize}&search=${encodeURIComponent(value)}`
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
                            setQuery(`page=1&pageSize=${pageSize}&start=${start}&end=${end}`);
                            setPage(1);
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
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {filtered.map((item) => {
                            const info = item.requestInfo;
                            const device = info.device;

                            const attachments = [
                                info.attachment1,
                                info.attachment2,
                                info.attachment3,
                            ].filter(Boolean);

                            const mainImage =
                                attachments[0] ||
                                device?.image1 ||
                                device?.image2 ||
                                device?.image3 ||
                                null;

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

                            // Flag giả định backend trả về: item.latestRejectReason / item.latestRejectedAt
                            const latestRejectReason = (item as any).latestRejectReason;
                            const latestRejectedAt = (item as any).latestRejectedAt;

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
                                            {mainImage ? (
                                                <Image
                                                    src={
                                                        mainImage.startsWith("http")
                                                            ? mainImage
                                                            : `${import.meta.env.VITE_BACKEND_URL
                                                            }/storage/${attachments[0]
                                                                ? "MAINTENANCE_REQUEST"
                                                                : "DEVICE"
                                                            }/${mainImage}`
                                                    }
                                                    alt={device?.deviceName}
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

                                        {/* Thông tin phiếu */}
                                        <Col xs={24} sm={18} md={19}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <div>
                                                    {/* Header phiếu */}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 8,
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        <Text strong style={{ fontSize: 15 }}>
                                                            {device?.deviceName ||
                                                                "Thiết bị không xác định"}{" "}
                                                            <Text
                                                                type="secondary"
                                                                style={{ fontSize: 13 }}
                                                            >
                                                                ({device?.deviceCode ||
                                                                    "Không có mã"})
                                                            </Text>
                                                        </Text>

                                                        <Tag
                                                            color={
                                                                info.creatorType === "CUSTOMER"
                                                                    ? "purple"
                                                                    : "blue"
                                                            }
                                                        >
                                                            {info.creatorType === "CUSTOMER"
                                                                ? "Phiếu khách hàng tạo"
                                                                : "Phiếu nhân viên nội bộ tạo"}
                                                        </Tag>

                                                        {device?.ownershipType && (
                                                            <Tag
                                                                color={
                                                                    device.ownershipType ===
                                                                        "CUSTOMER"
                                                                        ? "magenta"
                                                                        : "green"
                                                                }
                                                            >
                                                                {device.ownershipType ===
                                                                    "CUSTOMER"
                                                                    ? "Thiết bị khách hàng"
                                                                    : "Thiết bị nội bộ"}
                                                            </Tag>
                                                        )}
                                                    </div>

                                                    {/* Thông tin cơ bản */}
                                                    <div
                                                        style={{
                                                            marginTop: 6,
                                                            fontSize: 13,
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        <p>
                                                            <Text type="secondary">Mã phiếu: </Text>
                                                            <Text strong>{info.requestCode}</Text>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">
                                                                Loại bảo trì:{" "}
                                                            </Text>
                                                            <Tag color="blue">
                                                                {info.maintenanceType}
                                                            </Tag>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Trạng thái: </Text>
                                                            <Tag color="gold">{info.status}</Tag>
                                                        </p>

                                                        {isCustomer ? (
                                                            <p>
                                                                <Text type="secondary">
                                                                    Địa điểm:{" "}
                                                                </Text>
                                                                {info.locationDetail || "-"}
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p>
                                                                    <Text type="secondary">
                                                                        Công ty:{" "}
                                                                    </Text>
                                                                    {device?.companyName || "-"}
                                                                </p>
                                                                <p>
                                                                    <Text type="secondary">
                                                                        Phòng ban:{" "}
                                                                    </Text>
                                                                    {device?.departmentName || "-"}
                                                                </p>
                                                                <p>
                                                                    <Text type="secondary">
                                                                        Địa chỉ cụ thể:{" "}
                                                                    </Text>
                                                                    {info.locationDetail || "-"}
                                                                </p>
                                                            </>
                                                        )}

                                                        {/* Hiển thị nếu có log từ chối */}
                                                        {latestRejectReason && (
                                                            <div
                                                                style={{
                                                                    marginTop: 8,
                                                                    background: "#fff5f5",
                                                                    padding: 10,
                                                                    borderRadius: 6,
                                                                    border: "1px solid #f0caca",
                                                                }}
                                                            >
                                                                <Text type="danger" strong>
                                                                    Bị từ chối:{" "}
                                                                </Text>
                                                                <Text>{latestRejectReason}</Text>
                                                                {latestRejectedAt && (
                                                                    <p
                                                                        style={{
                                                                            fontSize: 12,
                                                                            color: "#777",
                                                                            margin: 0,
                                                                        }}
                                                                    >
                                                                        {dayjs(latestRejectedAt).format(
                                                                            "DD/MM/YYYY HH:mm"
                                                                        )}
                                                                    </p>
                                                                )}


                                                                <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.GET_REJECT_LOGS} hideChildren>
                                                                    <Button
                                                                        type="link"
                                                                        size="small"
                                                                        onClick={() =>
                                                                            setShowRejectModal(
                                                                                info.requestId!
                                                                            )
                                                                        }
                                                                    >
                                                                        Xem chi tiết log từ chối
                                                                    </Button>
                                                                </Access>

                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cột phải */}
                                                <div style={{ textAlign: "right", minWidth: 180 }}>
                                                    <Tag color={priorityColor}>
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

                                                        <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.GET_BY_ID} hideChildren>
                                                            <Button
                                                                size="small"
                                                                type="primary"
                                                                style={{ marginRight: 6 }}
                                                                onClick={() =>
                                                                    setSelectedId(info.requestId!)
                                                                }
                                                            >
                                                                Thông tin chi tiết
                                                            </Button>
                                                        </Access>
                                                        {info.status === "CHO_PHAN_CONG" && (
                                                            <ButtonAssignTechnician
                                                                requestId={info.requestId!}
                                                            />
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

                    {data?.meta && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 24,
                            }}
                        >
                            <Pagination
                                current={data.meta.page}
                                total={data.meta.total}
                                pageSize={data.meta.pageSize}
                                showSizeChanger
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                                showTotal={(total) => `Tổng cộng ${total} phiếu`}
                            />
                        </div>
                    )}
                </>
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

            {/* Modal log từ chối */}
            {showRejectModal && (
                <RejectLogsModal
                    requestId={showRejectModal}
                    onClose={() => setShowRejectModal(null)}
                />
            )}
            <ModalAutoAssignMaintenance
                open={showAutoAssignModal}
                onClose={() => setShowAutoAssignModal(false)}
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
