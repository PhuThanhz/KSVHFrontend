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

import { usePendingMaintenanceRequestsQuery } from "@/hooks/maintenance/useMaintenanceRequests";
import ViewMaintenanceDetail from "@/pages/admin/maintenance/view/view.maintenance-detail";
import ButtonAssignTechnician from "@/pages/admin/maintenance/button/button.assign-technician";
import RejectLogsModal from "@/pages/admin/maintenance/modal/modal.reject-logs";
import ModalAutoAssignMaintenance from "@/pages/admin/maintenance/modal/modal.maintenance-auto-assign";

const { Text } = Typography;

const MaintenancePendingPage = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
    const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);

    const [searchValue, setSearchValue] = useState<string>("");
    const [creatorTypeFilter, setCreatorTypeFilter] = useState<string | null>(null);
    const [ownershipTypeFilter, setOwnershipTypeFilter] = useState<string | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
    const [maintenanceTypeFilter, setMaintenanceTypeFilter] = useState<string | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);

    const [query, setQuery] = useState<string>(() => {
        const params = new URLSearchParams();
        params.set("page", PAGINATION_CONFIG.DEFAULT_PAGE.toString());
        params.set("size", PAGINATION_CONFIG.DEFAULT_PAGE_SIZE.toString());
        params.set("sort", PAGINATION_CONFIG.DEFAULT_SORT);
        return params.toString();
    });


    const { data, isLoading } = usePendingMaintenanceRequestsQuery(query);
    const requests = data?.result || [];

    const creatorTypeOptions = [
        { label: "Phiếu khách hàng tạo", value: "CUSTOMER", color: "purple" },
        { label: "Phiếu nội bộ tạo", value: "EMPLOYEE", color: "blue" },
    ];

    const ownershipTypeOptions = [
        { label: "Thiết bị khách hàng", value: "CUSTOMER", color: "magenta" },
        { label: "Thiết bị nội bộ", value: "INTERNAL", color: "green" },
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

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("size", pageSize.toString());
        params.set("sort", PAGINATION_CONFIG.DEFAULT_SORT);

        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(`(requestCode~'${searchValue}' or device.deviceName~'${searchValue}')`);
        }
        if (creatorTypeFilter) filterParts.push(`creatorType='${creatorTypeFilter}'`);
        if (ownershipTypeFilter) filterParts.push(`device.ownershipType='${ownershipTypeFilter}'`);
        if (priorityFilter) filterParts.push(`priorityLevel='${priorityFilter}'`);
        if (maintenanceTypeFilter) filterParts.push(`maintenanceType='${maintenanceTypeFilter}'`);
        if (createdAtFilter) filterParts.push(createdAtFilter);

        if (filterParts.length > 0) params.set("filter", filterParts.join(" and "));
        setQuery(params.toString());
    }, [searchValue, creatorTypeFilter, ownershipTypeFilter, priorityFilter, maintenanceTypeFilter, createdAtFilter, currentPage, pageSize]);

    const resetFilters = () => {
        setSearchValue("");
        setCreatorTypeFilter(null);
        setOwnershipTypeFilter(null);
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

        setQuery(params.toString());
    };



    return (
        <PageContainer
            title="Phiếu chờ phân công"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm theo mã phiếu hoặc tên thiết bị..."
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
                                { key: "creatorType", label: "Loại phiếu", options: creatorTypeOptions },
                                { key: "ownershipType", label: "Loại thiết bị", options: ownershipTypeOptions },
                                { key: "priority", label: "Độ ưu tiên", options: priorityOptions },
                                { key: "maintenanceType", label: "Loại bảo trì", options: maintenanceTypeOptions },
                            ]}
                            onChange={(filters) => {
                                setCreatorTypeFilter(filters.creatorType || null);
                                setOwnershipTypeFilter(filters.ownershipType || null);
                                setPriorityFilter(filters.priority || null);
                                setMaintenanceTypeFilter(filters.maintenanceType || null);
                                setCurrentPage(1);
                            }}
                        />
                        <Space>
                            <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.AUTO_ASSIGN_ALL} hideChildren>
                                <Button type="default" onClick={() => setShowAutoAssignModal(true)}>
                                    Phân công tự động
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
            {isLoading ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : requests.length === 0 ? (
                <Empty description="Không có phiếu chờ phân công nào" />
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {requests.map((item) => {
                            const info = item.requestInfo;
                            const device = info.device;
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
                            const latestRejectReason = item.latestRejectReason;
                            const latestRejectedAt = item.latestRejectedAt;
                            const deviceImages = [device?.image1, device?.image2, device?.image3].filter(Boolean);
                            const hasImages = deviceImages.length > 0;

                            return (
                                <Card
                                    key={info.requestId}
                                    bordered
                                    hoverable
                                    bodyStyle={{ padding: 16 }}
                                    style={{ borderRadius: 8, border: "1px solid #e8e8e8" }}
                                >
                                    <Row gutter={[12, 12]} align="middle">
                                        <Col xs={24} sm={6} md={5}>
                                            {hasImages ? (
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
                                        <Col xs={24} sm={18} md={19}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <div>
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
                                                        <Tag color={isCustomer ? "purple" : "blue"}>
                                                            {isCustomer
                                                                ? "Phiếu khách hàng tạo"
                                                                : "Phiếu nhân viên nội bộ tạo"}
                                                        </Tag>
                                                        {device?.ownershipType && (
                                                            <Tag color={device.ownershipType === "CUSTOMER" ? "magenta" : "green"}>
                                                                {device.ownershipType === "CUSTOMER"
                                                                    ? "Thiết bị khách hàng"
                                                                    : "Thiết bị nội bộ"}
                                                            </Tag>
                                                        )}
                                                    </div>

                                                    <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6 }}>
                                                        <p>
                                                            <Text type="secondary">Mã phiếu: </Text>
                                                            <Text strong>{info.requestCode}</Text>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Loại bảo trì: </Text>
                                                            <Tag color="blue">{info.maintenanceType}</Tag>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">Trạng thái: </Text>
                                                            <Tag color="gold">{info.status}</Tag>
                                                        </p>

                                                        {isCustomer ? (
                                                            <p>
                                                                <Text type="secondary">Địa điểm: </Text>
                                                                {info.locationDetail || "-"}
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p>
                                                                    <Text type="secondary">Công ty: </Text>
                                                                    {device?.companyName || "-"}
                                                                </p>
                                                                <p>
                                                                    <Text type="secondary">Phòng ban: </Text>
                                                                    {device?.departmentName || "-"}
                                                                </p>
                                                                <p>
                                                                    <Text type="secondary">Địa chỉ cụ thể: </Text>
                                                                    {info.locationDetail || "-"}
                                                                </p>
                                                            </>
                                                        )}

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
                                                                        {dayjs(latestRejectedAt).format("DD/MM/YYYY HH:mm")}
                                                                    </p>
                                                                )}
                                                                <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.GET_REJECT_LOGS} hideChildren>
                                                                    <Button
                                                                        type="link"
                                                                        size="small"
                                                                        onClick={() => setShowRejectModal(info.requestId!)}
                                                                    >
                                                                        Xem chi tiết log từ chối
                                                                    </Button>
                                                                </Access>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{ textAlign: "right", minWidth: 180 }}>
                                                    <Tag color={priorityColor}>{info.priorityLevel}</Tag>
                                                    <div style={{ fontSize: 12, color: "#888" }}>
                                                        Ngày tạo: {createdAt}
                                                    </div>
                                                    <Space style={{ marginTop: 8 }}>
                                                        <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.GET_BY_ID} hideChildren>
                                                            <Button
                                                                size="small"
                                                                type="primary"
                                                                icon={<EyeOutlined />}
                                                                style={{ borderRadius: 6, height: 36 }}
                                                                onClick={() => setSelectedId(info.requestId!)}
                                                            >
                                                                Thông tin chi tiết
                                                            </Button>
                                                        </Access>
                                                        <ButtonAssignTechnician requestId={info.requestId!} />
                                                    </Space>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })}
                    </div>
                </>
            )}

            {selectedId && (
                <Modal open={!!selectedId} onCancel={() => setSelectedId(null)} title="Chi tiết phiếu bảo trì" footer={null} width={900}>
                    <ViewMaintenanceDetail requestId={selectedId} />
                </Modal>
            )}

            {showRejectModal && (
                <RejectLogsModal requestId={showRejectModal} onClose={() => setShowRejectModal(null)} />
            )}

            <ModalAutoAssignMaintenance open={showAutoAssignModal} onClose={() => setShowAutoAssignModal(false)} />
        </PageContainer>
    );
};

export default MaintenancePendingPage;
