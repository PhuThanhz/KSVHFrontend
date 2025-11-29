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

import {
    useAcceptancePendingQuery,
    useAcceptancePaginateQuery,
    useAcceptanceRejectedQuery,
} from "@/hooks/useAcceptance";

import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

import ModalApproveAcceptance from "@/pages/admin/maintenance-acceptance/modal.approve-acceptance";
import ModalRejectAcceptance from "@/pages/admin/maintenance-acceptance/modal.reject-acceptanc";
import ViewDetailAcceptance from "@/pages/admin/maintenance-acceptance/view-detail-acceptance";

const { Title, Text } = Typography;

export default function MaintenanceAcceptancePage() {
    const [activeTab, setActiveTab] = useState("PENDING");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [query, setQuery] = useState(`page=${page}&pageSize=${pageSize}`);

    // Modal state
    const [approveModal, setApproveModal] = useState<{ open: boolean; requestId: string | null }>({
        open: false,
        requestId: null,
    });

    const [rejectModal, setRejectModal] = useState<{ open: boolean; requestId: string | null }>({
        open: false,
        requestId: null,
    });

    const [detailModal, setDetailModal] = useState<string | null>(null);

    // Queries
    const { data: pendingData, isLoading: loadingPending } = useAcceptancePendingQuery(query);
    const { data: acceptedData, isLoading: loadingAccepted } = useAcceptancePaginateQuery(query);
    const { data: rejectedData, isLoading: loadingRejected } = useAcceptanceRejectedQuery(query);

    // Determine which list to show
    const list =
        activeTab === "PENDING"
            ? pendingData?.result || []
            : activeTab === "ACCEPTED"
                ? acceptedData?.result || []
                : rejectedData?.result || [];

    const handlePageChange = (newPage: number, newSize?: number) => {
        setPage(newPage);
        setPageSize(newSize || pageSize);
        setQuery(`page=${newPage}&pageSize=${newSize || pageSize}`);
    };

    // Helper function to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "CHO_NGHIEM_THU":
                return "gold";
            case "TU_CHOI_NGHIEM_THU":
                return "magenta";
            case "DA_NGHIEM_THU":
                return "green";
            case "DANG_BAO_TRI":
                return "blue";
            case "HOAN_THANH":
                return "cyan";
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
                Quản lý nghiệm thu bảo trì
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
                        key: "PENDING",
                        label: (
                            <>
                                Chờ nghiệm thu{" "}
                                <Tag color="red">{pendingData?.meta?.total || 0}</Tag>
                            </>
                        ),
                    },
                    {
                        key: "ACCEPTED",
                        label: (
                            <>
                                Đã nghiệm thu{" "}
                                <Tag color="green">{acceptedData?.meta?.total || 0}</Tag>
                            </>
                        ),
                    },
                    {
                        key: "REJECTED",
                        label: (
                            <>
                                Từ chối nghiệm thu{" "}
                                <Tag color="magenta">{rejectedData?.meta?.total || 0}</Tag>
                            </>
                        ),
                    },
                ]}
            />

            {/* Search */}
            <Input.Search
                placeholder="Tìm theo mã phiếu hoặc thiết bị"
                onSearch={(value) =>
                    setQuery(
                        `page=1&pageSize=${pageSize}&search=${encodeURIComponent(value)}`
                    )
                }
                style={{ width: 260, marginBottom: 16 }}
                allowClear
            />

            {/* LIST */}
            {(
                activeTab === "PENDING"
                    ? loadingPending
                    : activeTab === "ACCEPTED"
                        ? loadingAccepted
                        : loadingRejected
            ) ? (
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
                            const device = item.device;
                            const images = [device?.image1, device?.image2, device?.image3].filter(Boolean);

                            const createdAt = item.createdAt
                                ? dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")
                                : "-";

                            // Format dates for accepted/rejected tabs
                            const completedAt = item.completedAt
                                ? dayjs(item.completedAt).format("DD/MM/YYYY HH:mm")
                                : "-";

                            const rejectedAt = item.rejectInfo?.rejectedAt
                                ? dayjs(item.rejectInfo.rejectedAt).format("DD/MM/YYYY HH:mm")
                                : "-";

                            return (
                                <Card
                                    key={item.requestId}
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
                                                            <Text strong>{item.requestCode}</Text>
                                                        </div>

                                                        <div style={{ marginBottom: 6 }}>
                                                            <Text type="secondary">Mức độ ưu tiên: </Text>
                                                            <Tag color={getPriorityColor(item.priorityLevel)}>
                                                                {getPriorityText(item.priorityLevel)}
                                                            </Tag>
                                                        </div>

                                                        <div style={{ marginBottom: 6 }}>
                                                            <Text type="secondary">Trạng thái: </Text>
                                                            <Tag color={getStatusColor(item.status)}>
                                                                {item.status}
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

                                                        <div style={{ marginBottom: 6 }}>
                                                            <Text type="secondary">Vị trí: </Text>
                                                            <Text>{device?.locationDetail || "-"}</Text>
                                                        </div>

                                                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                                Ngày tạo: {createdAt}
                                                            </Text>
                                                        </div>

                                                        {/* Show rejection info for REJECTED tab */}
                                                        {activeTab === "REJECTED" && item.rejectInfo && (
                                                            <div style={{
                                                                marginTop: 12,
                                                                padding: 12,
                                                                backgroundColor: "#fff1f0",
                                                                borderRadius: 6,
                                                                border: "1px solid #ffccc7"
                                                            }}>
                                                                <Text strong style={{ color: "#cf1322", display: "block", marginBottom: 8 }}>
                                                                    Thông tin từ chối nghiệm thu
                                                                </Text>
                                                                <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                                                                    <div style={{ marginBottom: 4 }}>
                                                                        <Text type="secondary">Lý do: </Text>
                                                                        <Text>{item.rejectInfo.reasonName}</Text>
                                                                    </div>
                                                                    {item.rejectInfo.note && (
                                                                        <div style={{ marginBottom: 4 }}>
                                                                            <Text type="secondary">Ghi chú: </Text>
                                                                            <Text>{item.rejectInfo.note}</Text>
                                                                        </div>
                                                                    )}
                                                                    <div style={{ marginBottom: 4 }}>
                                                                        <Text type="secondary">Người từ chối: </Text>
                                                                        <Text>{item.rejectInfo.rejectedBy}</Text>
                                                                    </div>
                                                                    <div>
                                                                        <Text type="secondary">Thời gian từ chối: </Text>
                                                                        <Text>{rejectedAt}</Text>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Show acceptance info for ACCEPTED tab */}
                                                        {activeTab === "ACCEPTED" && item.acceptanceId && (
                                                            <div style={{
                                                                marginTop: 12,
                                                                padding: 12,
                                                                backgroundColor: "#f6ffed",
                                                                borderRadius: 6,
                                                                border: "1px solid #b7eb8f"
                                                            }}>
                                                                <Text strong style={{ color: "#389e0d", display: "block", marginBottom: 8 }}>
                                                                    Thông tin nghiệm thu
                                                                </Text>
                                                                <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                                                                    <div style={{ marginBottom: 4 }}>
                                                                        <Text type="secondary">Mã nghiệm thu: </Text>
                                                                        <Text>{item.acceptanceId}</Text>
                                                                    </div>
                                                                    {completedAt !== "-" && (
                                                                        <div>
                                                                            <Text type="secondary">Thời gian hoàn thành: </Text>
                                                                            <Text>{completedAt}</Text>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
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
                                                    {/* Only pending can approve / reject */}
                                                    {activeTab === "PENDING" && (
                                                        <>
                                                            <Access permission={ALL_PERMISSIONS.MAINTENANCE_ACCEPTANCE.APPROVE} hideChildren>
                                                                <Button
                                                                    type="primary"
                                                                    onClick={() =>
                                                                        setApproveModal({
                                                                            open: true,
                                                                            requestId: item.requestId,
                                                                        })
                                                                    }
                                                                >
                                                                    Đồng ý nghiệm thu
                                                                </Button>
                                                            </Access>

                                                            <Access permission={ALL_PERMISSIONS.MAINTENANCE_ACCEPTANCE.REJECT} hideChildren>
                                                                <Button
                                                                    danger
                                                                    onClick={() =>
                                                                        setRejectModal({
                                                                            open: true,
                                                                            requestId: item.requestId,
                                                                        })
                                                                    }
                                                                >
                                                                    Từ chối nghiệm thu
                                                                </Button>
                                                            </Access>
                                                        </>
                                                    )}

                                                    {/* Detail always available */}
                                                    <Access permission={ALL_PERMISSIONS.MAINTENANCE_ACCEPTANCE.GET_BY_ID} hideChildren>
                                                        <Button
                                                            style={{ backgroundColor: "#0091EA", color: "white" }}
                                                            onClick={() => setDetailModal(item.requestId)}
                                                        >
                                                            Xem chi tiết
                                                        </Button>
                                                    </Access>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {(activeTab === "PENDING"
                        ? pendingData?.meta
                        : activeTab === "ACCEPTED"
                            ? acceptedData?.meta
                            : rejectedData?.meta) && (
                            <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                                <Pagination
                                    current={
                                        activeTab === "PENDING"
                                            ? pendingData?.meta.page
                                            : activeTab === "ACCEPTED"
                                                ? acceptedData?.meta.page
                                                : rejectedData?.meta.page
                                    }
                                    total={
                                        activeTab === "PENDING"
                                            ? pendingData?.meta.total
                                            : activeTab === "ACCEPTED"
                                                ? acceptedData?.meta.total
                                                : rejectedData?.meta.total
                                    }
                                    pageSize={
                                        activeTab === "PENDING"
                                            ? pendingData?.meta.pageSize
                                            : activeTab === "ACCEPTED"
                                                ? acceptedData?.meta.pageSize
                                                : rejectedData?.meta.pageSize
                                    }
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
            <ModalApproveAcceptance
                openModal={approveModal.open}
                setOpenModal={(v) => setApproveModal({ open: v, requestId: approveModal.requestId })}
                requestId={approveModal.requestId}
            />

            <ModalRejectAcceptance
                openModal={rejectModal.open}
                setOpenModal={(v) => setRejectModal({ open: v, requestId: rejectModal.requestId })}
                requestId={rejectModal.requestId}
            />

            {detailModal && (
                <ViewDetailAcceptance
                    open={!!detailModal}
                    onClose={() => setDetailModal(null)}
                    requestId={detailModal}
                />
            )}
        </div>
    );
}