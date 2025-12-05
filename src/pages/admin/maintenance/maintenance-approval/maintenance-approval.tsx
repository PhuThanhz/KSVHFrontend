import { useEffect, useState, useRef } from "react";
import { Button, Space, Tag, Image, Empty, Modal, Card, Row, Col, Typography, Spin } from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ActionType } from "@ant-design/pro-components";

import PageContainer from "@/components/common/data-table/PageContainer";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";

import {
    useMaintenanceApprovalsQuery,
    useApprovePlanMutation,
} from "@/hooks/useMaintenanceApprovals";
import ViewMaintenanceApprovalDetail from "@/pages/admin/maintenance/maintenance-approval/view.maintenance-approval-detail";
import ViewMaintenanceApprovalMaterials from "@/pages/admin/maintenance/maintenance-approval/view.maintenance-approval-materials";
import ModalRejectMaintenancePlan from "@/pages/admin/maintenance/maintenance-approval/modal.reject-maintenance-plan";

const { Text } = Typography;

interface MaintenancePlan {
    planId: string;
    requestCode?: string;
    maintenanceTypeActual?: string;
    status?: string;
    priorityLevel?: string;
    solutionName?: string;
    actualIssueDescription?: string;
    createdAt?: string;
    device?: {
        deviceName?: string;
        deviceCode?: string;
        companyName?: string;
        departmentName?: string;
        ownershipType?: string;
        image1?: string;
        image2?: string;
        image3?: string;
    };
}

const MaintenanceApprovalPage = () => {
    // ===================== Modal states =====================
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

    // ===================== Filter states =====================
    const [searchValue, setSearchValue] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    // ===================== Pagination states =====================
    const [currentPage, setCurrentPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);

    // ===================== Query state =====================
    const [query, setQuery] = useState<string>(() => {
        const params = new URLSearchParams();
        params.set("page", PAGINATION_CONFIG.DEFAULT_PAGE.toString());
        params.set("size", PAGINATION_CONFIG.DEFAULT_PAGE_SIZE.toString());
        params.set("sort", PAGINATION_CONFIG.DEFAULT_SORT);
        return params.toString();
    });


    // ===================== Data fetching =====================
    const approveMutation = useApprovePlanMutation();
    const { data, isLoading, refetch } = useMaintenanceApprovalsQuery(query);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const plans = (data?.result || []) as MaintenancePlan[];

    // ===================== Filter options =====================
    const statusOptions = [
        { label: "Chờ phê duyệt", value: "DA_LAP_KE_HOACH", color: "gold" },
        { label: "Đã phê duyệt", value: "DA_PHE_DUYET", color: "green" },
        { label: "Từ chối phê duyệt", value: "TU_CHOI_PHE_DUYET", color: "red" },
    ];

    // ===================== Auto update query when filters change =====================
    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("size", pageSize.toString());
        params.set("sort", PAGINATION_CONFIG.DEFAULT_SORT);


        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(`(maintenanceRequest.requestCode~'${searchValue}' or maintenanceRequest.device.deviceName~'${searchValue}')`);
        }
        if (statusFilter) {
            filterParts.push(`maintenanceRequest.status='${statusFilter}'`);
        }
        if (createdAtFilter) {
            filterParts.push(createdAtFilter);
        }

        if (filterParts.length > 0) {
            params.set("filter", filterParts.join(" and "));
        }

        setQuery(params.toString());
    }, [searchValue, statusFilter, createdAtFilter, currentPage, pageSize]);

    // ===================== Handlers =====================
    const resetFilters = () => {
        setSearchValue("");
        setStatusFilter(null);
        setCreatedAtFilter(null);
        setCurrentPage(PAGINATION_CONFIG.DEFAULT_PAGE);
        setPageSize(PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);

        const params = new URLSearchParams();
        params.set("page", PAGINATION_CONFIG.DEFAULT_PAGE.toString());
        params.set("size", PAGINATION_CONFIG.DEFAULT_PAGE_SIZE.toString());
        params.set("sort", PAGINATION_CONFIG.DEFAULT_SORT);
        setQuery(params.toString());

        setQuery(params.toString());
    };

    const handlePageChange = (page: number, newPageSize?: number) => {
        setCurrentPage(page);
        if (newPageSize) {
            setPageSize(newPageSize);
        }
    };

    const handleApprove = async () => {
        if (!approveModal.planId) return;
        try {
            await approveMutation.mutateAsync(approveModal.planId);
            setApproveModal({ open: false, planId: null });
            refetch();
        } catch (err: any) {
            console.error("Không thể duyệt kế hoạch:", err);
        }
    };

    // ===================== Main Render =====================
    return (
        <PageContainer
            title="Phê duyệt kế hoạch bảo trì"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm theo mã phiếu hoặc tên thiết bị..."
                        addLabel=""
                        showFilterButton={false}
                        showAddButton={false}
                        onSearch={(val) => {
                            setSearchValue(val);
                            setCurrentPage(1);
                        }}
                        onReset={resetFilters}
                    />

                    <div className="flex flex-wrap gap-3 items-center">
                        <AdvancedFilterSelect
                            fields={[
                                {
                                    key: "status",
                                    label: "Trạng thái",
                                    options: statusOptions,
                                },
                            ]}
                            onChange={(filters) => {
                                setStatusFilter(filters.status || null);
                                setCurrentPage(1);
                            }}
                        />

                        <DateRangeFilter
                            fieldName="createdAt"
                            onChange={(filter) => {
                                setCreatedAtFilter(filter);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            }
        >
            <Access permission={ALL_PERMISSIONS.MAINTENANCE_APPROVAL.GET_PAGINATE}>
                {isLoading ? (
                    <div style={{ textAlign: "center", marginTop: 50 }}>
                        <Spin size="large" />
                    </div>
                ) : plans.length === 0 ? (
                    <Empty description="Không có kế hoạch bảo trì nào" />
                ) : (
                    <>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {plans.map((plan) => {
                                const device = plan.device;
                                const deviceImages = [device?.image1, device?.image2, device?.image3].filter(Boolean);
                                const hasImages = deviceImages.length > 0;

                                const createdAt = plan.createdAt
                                    ? dayjs(plan.createdAt).format("DD/MM/YYYY HH:mm")
                                    : "-";

                                const priorityColor =
                                    plan.priorityLevel === "KHAN_CAP"
                                        ? "red"
                                        : plan.priorityLevel === "CAO"
                                            ? "orange"
                                            : plan.priorityLevel === "TRUNG_BINH"
                                                ? "blue"
                                                : "green";

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
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center",
                                                            gap: 8,
                                                        }}
                                                    >
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
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    gap: 8,
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                {deviceImages.slice(1).map((img, idx) => (
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
                                                        Không có hình ảnh thiết bị
                                                    </div>
                                                )}
                                            </Col>

                                            {/* Thông tin kế hoạch */}
                                            <Col xs={24} sm={18} md={19}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    <div>
                                                        {/* Header */}
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 8,
                                                                flexWrap: "wrap",
                                                            }}
                                                        >
                                                            <Text strong style={{ fontSize: 15 }}>
                                                                {device?.deviceName || "Thiết bị không xác định"}{" "}
                                                                <Text type="secondary" style={{ fontSize: 13 }}>
                                                                    ({device?.deviceCode || "Không có mã"})
                                                                </Text>
                                                            </Text>

                                                            {device?.ownershipType && (
                                                                <Tag
                                                                    color={
                                                                        device.ownershipType === "CUSTOMER"
                                                                            ? "magenta"
                                                                            : "green"
                                                                    }
                                                                >
                                                                    {device.ownershipType === "CUSTOMER"
                                                                        ? "Thiết bị khách hàng"
                                                                        : "Thiết bị nội bộ"}
                                                                </Tag>
                                                            )}
                                                        </div>

                                                        {/* Thông tin chi tiết */}
                                                        <div
                                                            style={{
                                                                marginTop: 6,
                                                                fontSize: 13,
                                                                lineHeight: 1.6,
                                                            }}
                                                        >
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
                                                                <Text type="secondary">Trạng thái: </Text>
                                                                <Tag
                                                                    color={
                                                                        plan.status === "DA_PHE_DUYET"
                                                                            ? "green"
                                                                            : plan.status === "TU_CHOI_PHE_DUYET"
                                                                                ? "red"
                                                                                : "gold"
                                                                    }
                                                                >
                                                                    {plan.status}
                                                                </Tag>
                                                            </p>
                                                            <p>
                                                                <Text type="secondary">Công ty: </Text>
                                                                {device?.companyName || "-"}
                                                            </p>
                                                            <p>
                                                                <Text type="secondary">Phòng ban: </Text>
                                                                {device?.departmentName || "-"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Cột phải */}
                                                    <div style={{ textAlign: "right", minWidth: 180 }}>
                                                        <Tag color={priorityColor}>
                                                            {plan.priorityLevel}
                                                        </Tag>
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#888",
                                                            }}
                                                        >
                                                            Ngày tạo: {createdAt}
                                                        </div>
                                                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                                                            <Access
                                                                permission={ALL_PERMISSIONS.MAINTENANCE_APPROVAL.APPROVE}
                                                                hideChildren
                                                            >
                                                                <Button
                                                                    size="small"
                                                                    type="primary"
                                                                    icon={<CheckOutlined />}
                                                                    disabled={plan.status !== "DA_LAP_KE_HOACH"}
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
                                                                    size="small"
                                                                    danger
                                                                    icon={<CloseOutlined />}
                                                                    disabled={plan.status !== "DA_LAP_KE_HOACH"}
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

                                                            <Access
                                                                permission={ALL_PERMISSIONS.MAINTENANCE_APPROVAL.GET_DETAIL}
                                                                hideChildren
                                                            >
                                                                <Button
                                                                    size="small"
                                                                    type="default"
                                                                    icon={<EyeOutlined />}
                                                                    onClick={() => setShowDetail(plan.planId)}
                                                                >
                                                                    Chi tiết
                                                                </Button>
                                                            </Access>

                                                            <Access
                                                                permission={ALL_PERMISSIONS.MAINTENANCE_APPROVAL.GET_MATERIALS}
                                                                hideChildren
                                                            >
                                                                <Button
                                                                    size="small"
                                                                    type="default"
                                                                    onClick={() => setShowMaterials(plan.planId)}
                                                                >
                                                                    Danh sách vật tư
                                                                </Button>
                                                            </Access>
                                                        </div>
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
                                <Space direction="vertical" align="center" size={8}>
                                    <div style={{ fontSize: 13 }}>
                                        <span style={{ fontWeight: 500 }}>
                                            {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, meta.total)}
                                        </span>{" "}
                                        trên{" "}
                                        <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                            {meta.total.toLocaleString()}
                                        </span>{" "}
                                        kế hoạch
                                    </div>
                                    <Space>
                                        <Button
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            Trước
                                        </Button>
                                        <span style={{ padding: "0 16px" }}>
                                            Trang {currentPage} / {Math.ceil(meta.total / pageSize)}
                                        </span>
                                        <Button
                                            disabled={currentPage >= Math.ceil(meta.total / pageSize)}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Sau
                                        </Button>
                                    </Space>
                                </Space>
                            </div>
                        )}
                    </>
                )}
            </Access>

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
                    planId={showDetail}
                />
            )}

            {/* Modal danh sách vật tư */}
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
        </PageContainer>
    );
};

export default MaintenanceApprovalPage;