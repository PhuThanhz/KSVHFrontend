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
    Pagination,
    Modal,
} from "antd";
import dayjs from "dayjs";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { notify } from "@/components/common/notify";
import {
    useMaintenanceApprovalsQuery,
    useApprovePlanMutation,
} from "@/hooks/useMaintenanceApprovals";
import ViewMaintenanceApprovalDetail from "@/components/admin/maintenance-approval/view.maintenance-approval-detail";
import ViewMaintenanceApprovalMaterials from "@/components/admin/maintenance-approval/view.maintenance-approval-materials";
import ModalRejectMaintenancePlan from "@/components/admin/maintenance-approval/modal.reject-maintenance-plan";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

export default function MaintenanceApprovalPage() {
    const [activeTab, setActiveTab] = useState("DA_LAP_KE_HOACH");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [query, setQuery] = useState(`page=${page}&pageSize=${pageSize}`);
    const [showDetail, setShowDetail] = useState<string | null>(null);
    const [showMaterials, setShowMaterials] = useState<string | null>(null);
    const [rejectModal, setRejectModal] = useState<{ open: boolean; planId: string | null }>({
        open: false,
        planId: null,
    });
    const [approveModal, setApproveModal] = useState<{ open: boolean; planId: string | null }>({
        open: false,
        planId: null,
    });

    const approveMutation = useApprovePlanMutation();
    const { data, isLoading, refetch } = useMaintenanceApprovalsQuery(query);
    const plans = data?.result || [];

    const filtered =
        activeTab === "ALL" ? plans : plans.filter((p) => p.status === activeTab);

    const handlePageChange = (newPage: number, newSize?: number) => {
        setPage(newPage);
        setPageSize(newSize || pageSize);
        setQuery(`page=${newPage}&pageSize=${newSize || pageSize}`);
    };

    /** Xử lý duyệt kế hoạch */
    const handleApprove = async () => {
        if (!approveModal.planId) return;
        try {
            await approveMutation.mutateAsync(approveModal.planId);
            notify.success("Kế hoạch đã được duyệt thành công");
            setApproveModal({ open: false, planId: null });
            refetch();
        } catch (err: any) {
            notify.error(err.message || "Không thể duyệt kế hoạch");
        }
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
                    Phê duyệt kế hoạch bảo trì
                </Title>
            </div>

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
                        key: "DA_LAP_KE_HOACH",
                        label: (
                            <>
                                Chờ phê duyệt{" "}
                                <Tag color="red">
                                    {plans.filter((p) => p.status === "DA_LAP_KE_HOACH").length}
                                </Tag>
                            </>
                        ),
                    },
                    {
                        key: "DA_PHE_DUYET",
                        label: (
                            <>
                                Đã duyệt{" "}
                                <Tag color="green">
                                    {plans.filter((p) => p.status === "DA_PHE_DUYET").length}
                                </Tag>
                            </>
                        ),
                    },
                    {
                        key: "TU_CHOI_PHE_DUYET",
                        label: (
                            <>
                                Bị từ chối{" "}
                                <Tag color="default">
                                    {plans.filter((p) => p.status === "TU_CHOI_PHE_DUYET").length}
                                </Tag>
                            </>
                        ),
                    },
                    {
                        key: "ALL",
                        label: (
                            <>
                                Tất cả <Tag color="blue">{plans.length || 0}</Tag>
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
                    placeholder="Tìm theo mã phiếu hoặc thiết bị"
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
                            setQuery(
                                `page=1&pageSize=${pageSize}&start=${start}&end=${end}`
                            );
                            setPage(1);
                        }
                    }}
                />
            </div>

            {/* Danh sách kế hoạch */}
            {isLoading ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : filtered.length === 0 ? (
                <Empty description="Không có kế hoạch nào" />
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {filtered.map((plan) => {
                            const device = plan.device;
                            const deviceImages = [
                                device?.image1,
                                device?.image2,
                                device?.image3,
                            ].filter(Boolean);

                            const hasImages = deviceImages.length > 0;
                            const createdAt = plan.createdAt
                                ? dayjs(plan.createdAt).format("DD/MM/YYYY HH:mm")
                                : "-";

                            const priorityColor =
                                plan.priorityLevel === "KHAN_CAP"
                                    ? "red"
                                    : plan.priorityLevel === "CAO"
                                        ? "orange"
                                        : "blue";

                            return (
                                <Card
                                    key={plan.planId}
                                    bordered
                                    hoverable
                                    bodyStyle={{ padding: 16 }}
                                    style={{
                                        borderRadius: 8,
                                        border: "1px solid #e8e8e8",
                                    }}
                                >
                                    <Row gutter={[12, 12]} align="middle">
                                        {/* Hình ảnh thiết bị */}
                                        <Col xs={24} sm={6} md={5}>
                                            {hasImages ? (
                                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                    <Image
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/DEVICE/${deviceImages[0]}`}
                                                        alt={device?.deviceName}
                                                        width="100%"
                                                        height={120}
                                                        style={{
                                                            objectFit: "cover",
                                                            borderRadius: 6,
                                                            border: "1px solid #e8e8e8",
                                                        }}
                                                    />
                                                    {deviceImages.length > 1 && (
                                                        <div style={{ display: "flex", gap: 8 }}>
                                                            {deviceImages.slice(1).map((img, idx) => (
                                                                <Image
                                                                    key={idx}
                                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/DEVICE/${img}`}
                                                                    alt={`thumb-${idx}`}
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
                                                    Không có hình ảnh thiết bị
                                                </div>
                                            )}
                                        </Col>

                                        {/* Nội dung thông tin kế hoạch */}
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
                                                        <Text strong style={{ fontSize: 16 }}>
                                                            {device?.deviceName || "Thiết bị không xác định"}{" "}
                                                            <Text type="secondary" style={{ fontSize: 13 }}>
                                                                ({device?.deviceCode || "Không có mã"})
                                                            </Text>
                                                        </Text>
                                                    </div>

                                                    <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
                                                        <p>
                                                            <Text type="secondary">Mã phiếu: </Text>
                                                            <Text strong>{plan.requestCode}</Text>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Giải pháp: </Text>
                                                            {plan.solutionName || "—"}
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Loại bảo trì thực tế: </Text>
                                                            <Tag color="blue">{plan.maintenanceTypeActual}</Tag>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Sự cố thực tế: </Text>
                                                            {plan.actualIssueDescription || "—"}
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Mức ưu tiên: </Text>
                                                            <Tag color={priorityColor}>{plan.priorityLevel}</Tag>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Trạng thái: </Text>
                                                            <Tag
                                                                color={
                                                                    plan.status === "DA_PHE_DUYET"
                                                                        ? "green"
                                                                        : plan.status === "TU_CHOI_PHE_DUYET"
                                                                            ? "default"
                                                                            : "gold"
                                                                }
                                                            >
                                                                {plan.status}
                                                            </Tag>
                                                        </p>
                                                        <p style={{ color: "#888", fontSize: 12 }}>
                                                            Ngày tạo: {createdAt}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Hành động */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "stretch",
                                                        gap: 8,
                                                        minWidth: 180,
                                                    }}
                                                >
                                                    {plan.status === "DA_LAP_KE_HOACH" && (
                                                        <>
                                                            <Access
                                                                permission={ALL_PERMISSIONS.MAINTENANCE_APPROVAL.APPROVE}
                                                                hideChildren
                                                            >
                                                                <Button
                                                                    type="primary"
                                                                    onClick={() =>
                                                                        setApproveModal({
                                                                            open: true,
                                                                            planId: plan.planId,
                                                                        })
                                                                    }
                                                                >
                                                                    Duyệt
                                                                </Button>
                                                            </Access>


                                                            <Access
                                                                permission={ALL_PERMISSIONS.MAINTENANCE_APPROVAL.REJECT}
                                                                hideChildren
                                                            >
                                                                <Button
                                                                    danger
                                                                    onClick={() =>
                                                                        setRejectModal({
                                                                            open: true,
                                                                            planId: plan.planId,
                                                                        })
                                                                    }
                                                                >
                                                                    Không duyệt
                                                                </Button>
                                                            </Access>
                                                        </>
                                                    )}
                                                    <Access
                                                        permission={ALL_PERMISSIONS.MAINTENANCE_APPROVAL.GET_DETAIL}
                                                        hideChildren
                                                    >
                                                        <Button
                                                            onClick={() => setShowDetail(plan.planId)}
                                                            style={{
                                                                backgroundColor: "#0091EA",
                                                                color: "white",
                                                            }}
                                                        >
                                                            Xem chi tiết
                                                        </Button>
                                                    </Access>

                                                    <Access
                                                        permission={ALL_PERMISSIONS.MAINTENANCE_APPROVAL.GET_MATERIALS}
                                                        hideChildren
                                                    >
                                                        <Button
                                                            style={{
                                                                backgroundColor: "#00C853",
                                                                color: "white",
                                                            }}
                                                            onClick={() => setShowMaterials(plan.planId)}
                                                        >
                                                            Danh sách vật tư
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
                    {data?.meta && (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                            <Pagination
                                current={data.meta.page}
                                total={data.meta.total}
                                pageSize={data.meta.pageSize}
                                showSizeChanger
                                onChange={handlePageChange}
                                onShowSizeChange={handlePageChange}
                                showTotal={(total) => `Tổng cộng ${total} kế hoạch`}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Modal xác nhận duyệt */}
            <Modal
                title="Xác nhận phê duyệt kế hoạch"
                open={approveModal.open}
                onCancel={() => setApproveModal({ open: false, planId: null })}
                onOk={handleApprove}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn phê duyệt kế hoạch này không?</p>
            </Modal>

            {/* Modal từ chối kế hoạch */}
            <ModalRejectMaintenancePlan
                openModal={rejectModal.open}
                setOpenModal={(v) => setRejectModal({ open: v, planId: rejectModal.planId })}
                planId={rejectModal.planId}
                onSuccess={() => refetch()}
            />

            {/* Modal xem chi tiết */}
            {showDetail && (
                <ViewMaintenanceApprovalDetail
                    open={!!showDetail}
                    onClose={() => setShowDetail(null)}
                    planId={showDetail!}
                />

            )}

            {/* Modal vật tư */}
            {showMaterials && (
                <Modal
                    open={!!showMaterials}
                    onCancel={() => setShowMaterials(null)}
                    title="Danh sách vật tư của kế hoạch"
                    footer={null}
                    width={900}
                    destroyOnClose
                >
                    <ViewMaintenanceApprovalMaterials planId={showMaterials} />
                </Modal>
            )}
        </div>
    );
}
