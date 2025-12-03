import { useState, useEffect } from "react";
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
} from "antd";
import dayjs from "dayjs";
import PageContainer from "@/components/common/data-table/PageContainer";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { useMaintenanceHistoryQuery } from "@/hooks/maintenance/useMaintenanceHistory";
import ViewMaintenanceHistoryDetail from "@/pages/admin/maintenance/view-maintenance-history-detail";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface MaintenanceHistoryItem {
    requestInfo: {
        requestId?: string;
        requestCode?: string;
        status?: string;
        priorityLevel?: string;
        createdAt?: string;
        device?: {
            deviceName?: string;
            deviceCode?: string;
            companyName?: string;
            departmentName?: string;
            image1?: string;
            image2?: string;
            image3?: string;
        };
    };
    completedAt?: string;
}

export default function MaintenanceHistoryPage() {
    // ===================== State =====================
    const [activeTab, setActiveTab] = useState("ALL");
    const [searchValue, setSearchValue] = useState<string>("");
    const [page, setPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);
    const [query, setQuery] = useState(`page=${page}&pageSize=${pageSize}`);

    const [detailModal, setDetailModal] = useState<string | null>(null);

    // ===================== Query =====================
    const { data, isLoading } = useMaintenanceHistoryQuery(query);
    const list = (data?.result || []) as MaintenanceHistoryItem[];
    const meta = data?.meta;

    // ===================== Effect: Update Query =====================
    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("pageSize", pageSize.toString());
        if (searchValue) params.set("search", searchValue);
        setQuery(params.toString());
    }, [page, pageSize, searchValue]);

    // ===================== Helpers =====================
    const handlePageChange = (newPage: number, newSize?: number) => {
        setPage(newPage);
        setPageSize(newSize || pageSize);
    };

    const getStatusColor = (status?: string) => {
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

    const getPriorityColor = (priority?: string) => {
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

    const getPriorityText = (priority?: string) => {
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
                return priority || "-";
        }
    };

    // ===================== Main Render =====================
    return (
        <PageContainer title="Lịch sử bảo trì">
            <div className="flex flex-col gap-3">
                {/* Tabs */}
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        setPage(1);
                    }}
                    items={[
                        {
                            key: "ALL",
                            label: (
                                <>
                                    Tất cả <Tag color="blue">{meta?.total || 0}</Tag>
                                </>
                            ),
                        },
                    ]}
                />

                {/* Search */}
                <Input.Search
                    placeholder="Tìm theo mã phiếu hoặc tên thiết bị..."
                    onSearch={(value) => {
                        setSearchValue(value);
                        setPage(1);
                    }}
                    allowClear
                    style={{ width: 280 }}
                />
            </div>

            {/* LIST */}
            {isLoading ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : list.length === 0 ? (
                <Empty description="Không có dữ liệu bảo trì" />
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
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
                                    style={{ borderRadius: 8, border: "1px solid #e8e8e8" }}
                                >
                                    <Row gutter={[12, 12]}>
                                        {/* Hình ảnh thiết bị */}
                                        <Col xs={24} sm={6} md={5}>
                                            {images.length > 0 ? (
                                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                    <Image
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/DEVICE/${images[0]}`}
                                                        alt={device?.deviceName}
                                                        width="100%"
                                                        height={120}
                                                        style={{
                                                            objectFit: "cover",
                                                            borderRadius: 6,
                                                            border: "1px solid #e8e8e8",
                                                        }}
                                                    />
                                                    {images.length > 1 && (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                gap: 8,
                                                                width: "100%",
                                                            }}
                                                        >
                                                            {images.slice(1).map((img, idx) => (
                                                                <Image
                                                                    key={idx}
                                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/DEVICE/${img}`}
                                                                    alt={`device-thumb-${idx}`}
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
                                                    Không có hình ảnh
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
                                                <div style={{ flex: 1, minWidth: 300 }}>
                                                    <Text strong style={{ fontSize: 15 }}>
                                                        {device?.deviceName || "Thiết bị không xác định"}{" "}
                                                        <Text type="secondary" style={{ fontSize: 13 }}>
                                                            ({device?.deviceCode || "Không có mã"})
                                                        </Text>
                                                    </Text>

                                                    <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.7 }}>
                                                        <p>
                                                            <Text type="secondary">Mã phiếu: </Text>
                                                            <Text strong>{item.requestInfo.requestCode}</Text>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Mức độ ưu tiên: </Text>
                                                            <Tag color={getPriorityColor(item.requestInfo.priorityLevel)}>
                                                                {getPriorityText(item.requestInfo.priorityLevel)}
                                                            </Tag>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Trạng thái: </Text>
                                                            <Tag color={getStatusColor(item.requestInfo.status)}>
                                                                {item.requestInfo.status}
                                                            </Tag>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Công ty: </Text>
                                                            {device?.companyName || "-"}
                                                        </p>
                                                        {device?.departmentName && (
                                                            <p>
                                                                <Text type="secondary">Phòng ban: </Text>
                                                                {device.departmentName}
                                                            </p>
                                                        )}
                                                        <p>
                                                            <Text type="secondary">Ngày tạo: </Text>
                                                            {createdAt}
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Hoàn thành: </Text>
                                                            {completedAt}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div style={{ textAlign: "right", minWidth: 180 }}>
                                                    <Button
                                                        type="primary"
                                                        onClick={() =>
                                                            setDetailModal(item.requestInfo.requestId || "")
                                                        }
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
                    {meta && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 24,
                            }}
                        >
                            <Pagination
                                current={meta.page}
                                total={meta.total}
                                pageSize={meta.pageSize}
                                showSizeChanger
                                onChange={handlePageChange}
                                showTotal={(t) => `Tổng ${t} phiếu`}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Modal chi tiết */}
            {detailModal && (
                <ViewMaintenanceHistoryDetail
                    open={!!detailModal}
                    onClose={() => setDetailModal(null)}
                    requestId={detailModal}
                />
            )}
        </PageContainer>
    );
}
