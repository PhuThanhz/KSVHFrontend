import { useEffect, useState, useRef } from "react";
import { Button, Space, Tag, Image, Empty, Modal, Card, Row, Col, Typography, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ActionType } from "@ant-design/pro-components";

import PageContainer from "@/components/common/data-table/PageContainer";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";

import { useMaintenanceRequestsQuery } from "@/hooks/maintenance/useMaintenanceRequests";
import ViewMaintenanceDetail from "@/pages/admin/maintenance/view/view.maintenance-detail";
import ModalCreateMaintenance from "@/pages/admin/maintenance/modal/modal.maintenance-create";
import RejectLogsModal from "@/pages/admin/maintenance/modal/modal.reject-logs";

const { Text } = Typography;
import type {
    IResMaintenanceRequestDTO
} from "@/types/backend";



const MaintenancePage = () => {
    // ===================== Modal states =====================
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
    // ===================== Filter states =====================
    const [searchValue, setSearchValue] = useState<string>("");
    const [creatorTypeFilter, setCreatorTypeFilter] = useState<string | null>(null);
    const [ownershipTypeFilter, setOwnershipTypeFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
    const [maintenanceTypeFilter, setMaintenanceTypeFilter] = useState<string | null>(null);
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
    const { data, isLoading } = useMaintenanceRequestsQuery(query);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const requests = (data?.result || []) as IResMaintenanceRequestDTO[];

    // ===================== Filter options =====================
    const creatorTypeOptions = [
        { label: "Phiếu khách hàng tạo", value: "CUSTOMER", color: "purple" },
        { label: "Phiếu nội bộ tạo", value: "EMPLOYEE", color: "blue" },
    ];

    const ownershipTypeOptions = [
        { label: "Thiết bị khách hàng", value: "CUSTOMER", color: "magenta" },
        { label: "Thiết bị nội bộ", value: "INTERNAL", color: "green" },
    ];

    const statusOptions = [
        { label: "Chờ phân công", value: "CHO_PHAN_CONG", color: "default" },
        { label: "Đang phân công", value: "DANG_PHAN_CONG", color: "processing" },
        { label: "Đã xác nhận", value: "DA_XAC_NHAN", color: "cyan" },
        { label: "Đã khảo sát", value: "DA_KHAO_SAT", color: "blue" },
        { label: "Đã lập kế hoạch", value: "DA_LAP_KE_HOACH", color: "geekblue" },
        { label: "Từ chối phê duyệt", value: "TU_CHOI_PHE_DUYET", color: "volcano" },
        { label: "Đã phê duyệt", value: "DA_PHE_DUYET", color: "purple" },
        { label: "Đang bảo trì", value: "DANG_BAO_TRI", color: "orange" },
        { label: "Chờ nghiệm thu", value: "CHO_NGHIEM_THU", color: "lime" },
        { label: "Từ chối nghiệm thu", value: "TU_CHOI_NGHIEM_THU", color: "magenta" },
        { label: "Hoàn thành", value: "HOAN_THANH", color: "green" },
        { label: "Hủy", value: "HUY", color: "red" },
    ];

    const priorityOptions = [
        { label: "Khẩn cấp", value: "KHAN_CAP", color: "red" },
        { label: "Cao", value: "CAO", color: "orange" },
        { label: "Trung bình", value: "TRUNG_BINH", color: "blue" },
        { label: "Thấp", value: "THAP", color: "green" },
    ];

    const maintenanceTypeOptions = [
        { label: "Bảo trì định kỳ", value: "DINH_KY", color: "blue" },
        { label: "Sửa chữa", value: "SUA_CHUA", color: "orange" },
        { label: "Đột xuất", value: "DOT_XUAT", color: "red" },
    ];

    // ===================== Auto update query when filters change =====================
    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("size", pageSize.toString());
        params.set("sort", PAGINATION_CONFIG.DEFAULT_SORT);

        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(
                `(requestCode~'${searchValue}' or device.deviceName~'${searchValue}' or device.deviceCode~'${searchValue}')`
            );
        }
        if (creatorTypeFilter) filterParts.push(`creatorType='${creatorTypeFilter}'`);
        if (ownershipTypeFilter) filterParts.push(`device.ownershipType='${ownershipTypeFilter}'`);
        if (statusFilter) filterParts.push(`status='${statusFilter}'`);
        if (priorityFilter) filterParts.push(`priorityLevel='${priorityFilter}'`);
        if (maintenanceTypeFilter) filterParts.push(`maintenanceType='${maintenanceTypeFilter}'`);
        if (createdAtFilter) filterParts.push(createdAtFilter);

        if (filterParts.length > 0) {
            params.set("filter", filterParts.join(" and "));
        }

        setQuery(params.toString());
    }, [searchValue, creatorTypeFilter, ownershipTypeFilter, statusFilter, priorityFilter, maintenanceTypeFilter, createdAtFilter, currentPage, pageSize]);

    // ===================== Handlers =====================
    const resetFilters = () => {
        setSearchValue("");
        setCreatorTypeFilter(null);
        setOwnershipTypeFilter(null);
        setStatusFilter(null);
        setPriorityFilter(null);
        setMaintenanceTypeFilter(null);
        setCreatedAtFilter(null);
        setCurrentPage(PAGINATION_CONFIG.DEFAULT_PAGE);
        setPageSize(PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);

        const params = new URLSearchParams();
        params.set("page", PAGINATION_CONFIG.DEFAULT_PAGE.toString());
        params.set("size", PAGINATION_CONFIG.DEFAULT_PAGE_SIZE.toString());
        params.set("sort", PAGINATION_CONFIG.DEFAULT_SORT);
        setQuery(params.toString());
    };

    const handlePageChange = (page: number, newPageSize?: number) => {
        setCurrentPage(page);
        if (newPageSize) {
            setPageSize(newPageSize);
        }
    };

    // ===================== Main Render =====================
    return (
        <PageContainer
            title="Quản lý yêu cầu bảo trì"

            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm theo mã phiếu - mã thiết bị hoặc tên thiết bị..."
                        addLabel="Tạo phiếu bảo trì"
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
                                    key: "creatorType",
                                    label: "Loại phiếu",
                                    options: creatorTypeOptions,
                                },
                                {
                                    key: "ownershipType",
                                    label: "Loại thiết bị",
                                    options: ownershipTypeOptions,
                                },
                                {
                                    key: "status",
                                    label: "Trạng thái",
                                    options: statusOptions,
                                },
                                {
                                    key: "priority",
                                    label: "Độ ưu tiên",
                                    options: priorityOptions,
                                },
                                {
                                    key: "maintenanceType",
                                    label: "Loại bảo trì",
                                    options: maintenanceTypeOptions,
                                },
                            ]}
                            onChange={(filters) => {
                                setCreatorTypeFilter(filters.creatorType || null);
                                setOwnershipTypeFilter(filters.ownershipType || null);
                                setStatusFilter(filters.status || null);
                                setPriorityFilter(filters.priority || null);
                                setMaintenanceTypeFilter(filters.maintenanceType || null);
                                setCurrentPage(1);
                            }}
                        />

                        <Space>
                            <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.CREATE_INTERNAL} hideChildren>
                                <Button type="primary" onClick={() => setShowCreateModal(true)}>
                                    + Tạo phiếu bảo trì
                                </Button>
                            </Access>
                        </Space>

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
            <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.GET_PAGINATE}>
                {isLoading ? (
                    <div style={{ textAlign: "center", marginTop: 50 }}>
                        <Spin size="large" />
                    </div>
                ) : requests.length === 0 ? (
                    <Empty description="Không có phiếu bảo trì nào" />
                ) : (
                    <>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {requests.map((item) => {
                                const info = item.requestInfo;
                                const device = info.device;

                                // Lấy ảnh thiết bị (ưu tiên ảnh thiết bị, không dùng ảnh phiếu)
                                const deviceImages = [device?.image1, device?.image2, device?.image3].filter(Boolean);

                                // Nếu không có ảnh nào thì để null
                                const hasImages = deviceImages.length > 0;

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
                                const latestRejectReason = item.latestRejectReason;
                                const latestRejectedAt = item.latestRejectedAt;

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
                                                        {/* Hàng 1: 1 ảnh lớn */}
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

                                                        {/* Hàng 2: 2 ảnh nhỏ (nếu có) */}
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
                                                        <Space style={{ marginTop: 8 }}>
                                                            <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.GET_BY_ID} hideChildren>
                                                                <Button
                                                                    size="small"
                                                                    type="primary"
                                                                    icon={<EyeOutlined />}
                                                                    style={{
                                                                        borderRadius: 6,
                                                                        height: 36,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        fontWeight: 500,
                                                                    }}
                                                                    onClick={() => setSelectedId(info.requestId!)}
                                                                >
                                                                    Thông tin chi tiết
                                                                </Button>
                                                            </Access>

                                                        </Space>

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
                                        phiếu
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
            {/* Modals */}
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
            {showRejectModal && (
                <RejectLogsModal
                    requestId={showRejectModal}
                    onClose={() => setShowRejectModal(null)}
                />
            )}
            <ModalCreateMaintenance
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => setShowCreateModal(false)}
            />
        </PageContainer>
    );
};

export default MaintenancePage;