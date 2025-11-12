import { useState } from "react";
import {
    Tabs,
    Card,
    Tag,
    Typography,
    Button,
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

import { useMaintenanceApprovalsQuery } from "@/hooks/useMaintenanceApprovals";
import ModalMaintenanceApproval from "@/components/admin/maintenance-approval/modal.maintenance-approval";
import ViewMaintenanceApprovalDetail from "@/components/admin/maintenance-approval/view.maintenance-approval-detail";
import ViewMaintenanceApprovalMaterials from "@/components/admin/maintenance-approval/view.maintenance-approval-materials";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

export default function MaintenanceApprovalPage() {
    const [activeTab, setActiveTab] = useState("ALL");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [query, setQuery] = useState(`page=${page}&pageSize=${pageSize}`);

    const [selectedPlan, setSelectedPlan] = useState<{
        planId: string;
        requestCode: string;
    } | null>(null);

    const [showDetail, setShowDetail] = useState<string | null>(null);
    const [showMaterials, setShowMaterials] = useState<string | null>(null);

    const { data, isLoading } = useMaintenanceApprovalsQuery(query);
    const plans = data?.result || [];

    const filtered =
        activeTab === "ALL"
            ? plans
            : plans.filter((p) => p.status === "DA_LAP_KE_HOACH");

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
                    Phê duyệt kế hoạch bảo trì
                </Title>
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
                                Tất cả kế hoạch <Tag color="blue">{plans.length || 0}</Tag>
                            </>
                        ),
                    },
                    {
                        key: "DA_LAP_KE_HOACH",
                        label: (
                            <>
                                Chờ phê duyệt{" "}
                                <Tag color="red">
                                    {
                                        plans.filter((p) => p.status === "DA_LAP_KE_HOACH").length ||
                                        0
                                    }
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
                <Empty description="Không có kế hoạch nào chờ phê duyệt" />
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {filtered.map((plan) => {
                            const createdAt = plan.createdAt
                                ? dayjs(plan.createdAt).format("DD/MM/YYYY HH:mm")
                                : "-";

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
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            flexWrap: "wrap",
                                            gap: 12,
                                        }}
                                    >
                                        <div>
                                            <Text strong style={{ fontSize: 15 }}>
                                                {plan.deviceName}
                                            </Text>
                                            <p>
                                                <Text type="secondary">Mã phiếu: </Text>
                                                <Text strong>{plan.requestCode}</Text>
                                            </p>
                                            <p>
                                                <Text type="secondary">Giải pháp: </Text>
                                                {plan.solutionName || "—"}
                                            </p>
                                            <p>
                                                <Text type="secondary">Mức ưu tiên: </Text>
                                                <Tag color="orange">{plan.priorityLevel}</Tag>
                                            </p>
                                            <p>
                                                <Text type="secondary">Trạng thái: </Text>
                                                <Tag color="gold">{plan.status}</Tag>
                                            </p>
                                            <p style={{ color: "#888", fontSize: 12 }}>
                                                Ngày tạo: {createdAt}
                                            </p>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 6,
                                                justifyContent: "flex-end",
                                                minWidth: 180,
                                            }}
                                        >
                                            {/* Nút mở modal phê duyệt */}
                                            <Access
                                                permission={
                                                    ALL_PERMISSIONS.MAINTENANCE_APPROVAL.APPROVE
                                                }
                                                hideChildren
                                            >
                                                <Button
                                                    type="primary"
                                                    onClick={() =>
                                                        setSelectedPlan({
                                                            planId: plan.planId,
                                                            requestCode: plan.requestCode,
                                                        })
                                                    }
                                                >
                                                    Phê duyệt
                                                </Button>
                                            </Access>

                                            {/* Nút xem chi tiết */}
                                            <Button
                                                onClick={() => setShowDetail(plan.planId)}
                                                style={{ backgroundColor: "#0091EA", color: "white" }}
                                            >
                                                Xem chi tiết
                                            </Button>

                                            {/* Nút danh sách vật tư */}
                                            <Button
                                                style={{ backgroundColor: "#00C853", color: "white" }}
                                                onClick={() => setShowMaterials(plan.planId)}
                                            >
                                                Danh sách vật tư
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
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
                                showTotal={(total) => `Tổng cộng ${total} kế hoạch`}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Modal phê duyệt kế hoạch */}
            {selectedPlan && (
                <ModalMaintenanceApproval
                    open={!!selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                    planId={selectedPlan.planId}
                    requestCode={selectedPlan.requestCode}
                />
            )}

            {/* Modal xem chi tiết kế hoạch */}
            {showDetail && (
                <Modal
                    open={!!showDetail}
                    onCancel={() => setShowDetail(null)}
                    title="Chi tiết kế hoạch bảo trì"
                    footer={null}
                    width={900}
                >
                    <ViewMaintenanceApprovalDetail />
                </Modal>
            )}

            {/* Modal danh sách vật tư */}
            {showMaterials && (
                <Modal
                    open={!!showMaterials}
                    onCancel={() => setShowMaterials(null)}
                    title="Danh sách vật tư của kế hoạch"
                    footer={null}
                    width={900}
                >
                    <ViewMaintenanceApprovalMaterials />
                </Modal>
            )}
        </div>
    );
}
