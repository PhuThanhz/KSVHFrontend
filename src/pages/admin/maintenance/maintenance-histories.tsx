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
    Spin,
    Empty,
    Pagination,
    Descriptions,
} from "antd";
import dayjs from "dayjs";

import { useMaintenanceHistoryQuery } from "@/hooks/maintenance/useMaintenanceHistory";
import ViewMaintenanceHistoryDetail from "@/pages/admin/maintenance/view-maintenance-history-detail";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function MaintenanceHistoryPage() {
    const [activeTab, setActiveTab] = useState("ALL");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [query, setQuery] = useState(`page=${page}&pageSize=${pageSize}`);

    const [detailModal, setDetailModal] = useState<string | null>(null);

    const { data, isLoading } = useMaintenanceHistoryQuery(query);

    const list = data?.result || [];

    const handlePageChange = (newPage: number, newSize?: number) => {
        setPage(newPage);
        setPageSize(newSize || pageSize);
        setQuery(`page=${newPage}&pageSize=${newSize || pageSize}`);
    };

    // Helper function to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "HOAN_THANH":
                return "green";
            case "DANG_BAO_TRI":
                return "blue";
            case "TU_CHOI":
                return "magenta";
            default:
                return "default";
        }
    };

    // Helper function to get priority color
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "KHAN_CAP":
                return "red";
            case "CAO":
                return "orange";
            case "TRUNG_BINH":
                return "blue";
            case "THAP":
                return "default";
            default:
                return "default";
        }
    };

    // Helper function to format priority text
    const getPriorityText = (priority: string) => {
        switch (priority) {
            case "KHAN_CAP":
                return "Khẩn cấp";
            case "CAO":
                return "Cao";
            case "TRUNG_BINH":
                return "Trung bình";
            case "THAP":
                return "Thấp";
            default:
                return priority;
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={3} style={{ marginBottom: 20 }}>
                Quản lý lịch sử bảo trì
            </Title>

            {/* Tabs */}
            <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                    setActiveTab(key);
                    setPage(1);
                    setQuery(`page=1&pageSize=${pageSize}`);
                }}
                items={[
                    {
                        key: "ALL",
                        label: (
                            <>
                                Tất cả{" "}
                                <Tag color="blue">{data?.meta?.total || 0}</Tag>
                            </>
                        ),
                    },
                ]}
            />

            {/* Search */}
            <Input.Search
                placeholder="Tìm theo mã phiếu hoặc thiết bị"
                onSearch={(value) =>
                    setQuery(`page=1&pageSize=${pageSize}&search=${encodeURIComponent(value)}`)
                }
                style={{ width: 260, marginBottom: 16 }}
                allowClear
            />

            {/* LIST */}
            {isLoading ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : list.length === 0 ? (
                <Empty description="Không có dữ liệu" />
            ) : (
                <>
                    {/* Cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {list.map((item) => {
                            const device = item.requestInfo.device;
                            const images = [device?.image1, device?.image2, device?.image3].filter(Boolean);

                            const createdAt = item.requestInfo.createdAt
                                ? dayjs(item.requestInfo.createdAt).format("DD/MM/YYYY HH:mm")
                                : "-";

                            const completedAt = item.completedAt
                                ? dayjs(item.completedAt).format("DD/MM/YYYY HH:mm")
                                : "-";

                            return (
                                <Card
                                    key={item.requestInfo.requestId}
                                    bordered
                                    hoverable
                                    bodyStyle={{ padding: 16 }}
                                >
                                    <Row gutter={[12, 12]}>
                                        <Col xs={24} sm={6}>
                                            {images.length > 0 ? (
                                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                    <Image
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/DEVICE/${images[0]}`}
                                                        width="100%"
                                                        height={120}
                                                        style={{
                                                            objectFit: "cover",
                                                            borderRadius: 6,
                                                            border: "1px solid #e8e8e8",
                                                        }}
                                                    />
                                                    {images.length > 1 && (
                                                        <div style={{ display: "flex", gap: 8 }}>
                                                            {images.slice(1).map((img, idx) => (
                                                                <Image
                                                                    key={idx}
                                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/DEVICE/${img}`}
                                                                    width="48%"
                                                                    height={80}
                                                                    style={{
                                                                        objectFit: "cover",
                                                                        borderRadius: 6,
                                                                        border: "1px solid #e8e8e8",
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: 140,
                                                        background: "#f5f5f5",
                                                        borderRadius: 8,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        color: "#aaa",
                                                        border: "1px solid #eee",
                                                    }}
                                                >
                                                    Không có ảnh
                                                </div>
                                            )}
                                        </Col>

                                        {/* Info */}
                                        <Col xs={24} sm={18}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexWrap: "wrap",
                                                    gap: 16,
                                                }}
                                            >
                                                <div style={{ flex: 1, minWidth: 300 }}>
                                                    <Text strong style={{ fontSize: 16 }}>
                                                        {device?.deviceName}{" "}
                                                        <Text type="secondary">({device?.deviceCode})</Text>
                                                    </Text>

                                                    <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.8 }}>
                                                        <div style={{ marginBottom: 6 }}>
                                                            <Text type="secondary">Mã phiếu: </Text>
                                                            <Text strong>{item.requestInfo.requestCode}</Text>
                                                        </div>

                                                        <div style={{ marginBottom: 6 }}>
                                                            <Text type="secondary">Mức độ ưu tiên: </Text>
                                                            <Tag color={getPriorityColor(item.requestInfo.priorityLevel ?? "")}>
                                                                {getPriorityText(item.requestInfo.priorityLevel || "-")}
                                                            </Tag>
                                                        </div>

                                                        <div style={{ marginBottom: 6 }}>
                                                            <Text type="secondary">Trạng thái: </Text>
                                                            <Tag color={getStatusColor(item.requestInfo.status ?? "")}>
                                                                {item.requestInfo.status || "-"}
                                                            </Tag>
                                                        </div>

                                                        <div style={{ marginBottom: 6 }}>
                                                            <Text type="secondary">Công ty: </Text>
                                                            <Text>{device?.companyName || "-"}</Text>
                                                        </div>

                                                        {device?.departmentName && (
                                                            <div style={{ marginBottom: 6 }}>
                                                                <Text type="secondary">Phòng ban: </Text>
                                                                <Text>{device.departmentName}</Text>
                                                            </div>
                                                        )}


                                                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                                Ngày tạo: {createdAt}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 8,
                                                        minWidth: 180,
                                                    }}
                                                >
                                                    {/* View detail button */}
                                                    <Button
                                                        style={{ backgroundColor: "#0091EA", color: "white" }}
                                                        onClick={() => setDetailModal(item.requestInfo.requestId || "-")}
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {data?.meta && (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                            <Pagination
                                current={data.meta.page}
                                total={data.meta.total}
                                pageSize={data.meta.pageSize}
                                showSizeChanger
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                                showTotal={(t) => `Tổng ${t} phiếu`}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            {detailModal && (
                <ViewMaintenanceHistoryDetail
                    open={!!detailModal}
                    onClose={() => setDetailModal(null)}
                    requestId={detailModal}
                />
            )}
        </div>
    );
}
