import { useEffect, useRef, useState } from "react";
import {
    Button,
    Tag,
    Image,
    Empty,
    Card,
    Row,
    Col,
    Typography,
    Spin,
    Space,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ActionType } from "@ant-design/pro-components";
import dayjs from "dayjs";

import PageContainer from "@/components/common/data-table/PageContainer";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";

import { useAdminExecutionsQuery } from "@/hooks/useAdminExecutions";
import ViewAdminExecutionDetail from "./view.admin-maintenance-execution-detail";
import ModalAdminSupportRequests from "./modal.admin-support-requests";
import type { IResAdminExecutionCardDTO } from "@/types/backend";

const { Text } = Typography;

export default function MaintenanceExecutionAdminPage() {
    // ===================== States =====================
    const [searchValue, setSearchValue] = useState<string>("");
    const [deviceCode, setDeviceCode] = useState<string>("");
    const [deviceName, setDeviceName] = useState<string>("");
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);

    const [query, setQuery] = useState<string>(() => {
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("size", pageSize.toString());
        params.set("sort", PAGINATION_CONFIG.DEFAULT_SORT); // ✅ Gắn sort mặc định
        return params.toString();
    });

    const tableRef = useRef<ActionType>(null);

    // ===================== MODALS =====================
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [openSupportModal, setOpenSupportModal] = useState(false);
    const [selectedRequestIdForSupport, setSelectedRequestIdForSupport] = useState<string | null>(null);

    // ===================== FETCH DATA =====================
    const { data, isFetching } = useAdminExecutionsQuery(query);
    const executions = (data?.result || []) as IResAdminExecutionCardDTO[];
    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    // ===================== AUTO BUILD QUERY =====================
    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("size", pageSize.toString());
        params.set("sort", PAGINATION_CONFIG.DEFAULT_SORT);

        const filters: string[] = [];

        if (searchValue) {
            filters.push(`maintenanceRequest.requestCode~'${searchValue}'`);
        }
        if (deviceCode) {
            filters.push(`maintenanceRequest.device.deviceCode~'${deviceCode}'`);
        }
        if (deviceName) {
            filters.push(`maintenanceRequest.device.deviceName~'${deviceName}'`);
        }
        if (createdAtFilter) {
            filters.push(createdAtFilter);
        }

        if (filters.length > 0) {
            params.set("filter", filters.join(" and "));
        }

        setQuery(params.toString());
    }, [searchValue, deviceCode, deviceName, createdAtFilter, currentPage, pageSize]);

    // ===================== HANDLERS =====================
    const resetFilters = () => {
        setSearchValue("");
        setDeviceCode("");
        setDeviceName("");
        setCreatedAtFilter(null);
        setCurrentPage(PAGINATION_CONFIG.DEFAULT_PAGE);
        setPageSize(PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);

        const params = new URLSearchParams();
        params.set("page", PAGINATION_CONFIG.DEFAULT_PAGE.toString());
        params.set("size", PAGINATION_CONFIG.DEFAULT_PAGE_SIZE.toString());
        params.set("sort", PAGINATION_CONFIG.DEFAULT_SORT); // ✅ Reset về sort mặc định
        setQuery(params.toString());
    };

    const handlePageChange = (page: number, newPageSize?: number) => {
        setCurrentPage(page);
        if (newPageSize) {
            setPageSize(newPageSize);
        }
    };

    // ===================== RENDER LIST =====================
    const renderExecutionCards = () => {
        if (isFetching) {
            return (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            );
        }

        if (executions.length === 0) {
            return <Empty description="Không có phiếu thi công nào" />;
        }

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {executions.map((item) => {
                    const imgs = [item.deviceImage1, item.deviceImage2, item.deviceImage3].filter(Boolean);
                    const total = item.totalTasks ?? 0;
                    const done = item.completedTasks ?? 0;
                    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                    const pendingSupportCount = (item as any).pendingSupportCount || 0;
                    const hasPendingSupport = pendingSupportCount > 0;

                    return (
                        <Card
                            key={item.requestId}
                            bordered
                            hoverable
                            bodyStyle={{ padding: 14 }}
                            style={{
                                borderRadius: 8,
                                border: hasPendingSupport ? "1.5px solid #faad14" : "1px solid #eaeaea",
                                background: hasPendingSupport ? "#fffbe6" : "#fff",
                            }}
                        >
                            <Row gutter={[8, 8]} align="middle">
                                <Col xs={24} sm={6} md={5}>
                                    {imgs.length > 0 ? (
                                        <Image
                                            src={`${backendURL}/storage/DEVICE/${imgs[0]}`}
                                            width="100%"
                                            height={120}
                                            style={{ objectFit: "cover", borderRadius: 6 }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: 120,
                                                background: "#f7f7f7",
                                                borderRadius: 6,
                                                border: "1px solid #ddd",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color: "#aaa",
                                            }}
                                        >
                                            Không có hình
                                        </div>
                                    )}
                                </Col>

                                <Col xs={24} sm={18} md={19}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            flexWrap: "wrap",
                                            gap: 6,
                                        }}
                                    >
                                        <div style={{ flex: 1, minWidth: 240 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <Text strong style={{ fontSize: 15 }}>
                                                    {item.deviceName}
                                                </Text>
                                                <Text type="secondary">({item.deviceCode})</Text>
                                                {hasPendingSupport && (
                                                    <Tag color="orange" style={{ fontWeight: 600 }}>
                                                        Có yêu cầu hỗ trợ ({pendingSupportCount})
                                                    </Tag>
                                                )}
                                            </div>

                                            <div style={{ marginTop: 8, fontSize: 13 }}>
                                                <p>
                                                    <Text type="secondary">Mã phiếu: </Text>
                                                    <Text strong>{item.requestCode}</Text>
                                                </p>
                                                <p>
                                                    <Text type="secondary">Trạng thái: </Text>
                                                    <Tag color="gold">{item.status}</Tag>
                                                </p>
                                                <p>
                                                    <Text type="secondary">Tiến độ: </Text>
                                                    <Tag color="blue">
                                                        {done}/{total} ({percent}%)
                                                    </Tag>
                                                </p>
                                                <p>
                                                    <Text type="secondary">Kỹ thuật viên: </Text>
                                                    {item.technicians?.length ? (
                                                        item.technicians.map((t) => (
                                                            <div key={t.id}>
                                                                <Text strong>{t.fullName}</Text>{" "}
                                                                {t.isMain ? (
                                                                    <Tag color="blue">Chính</Tag>
                                                                ) : (
                                                                    <Tag color="green">Hỗ trợ</Tag>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        "—"
                                                    )}
                                                </p>
                                                <p style={{ fontSize: 12, color: "#888" }}>
                                                    Tạo lúc:{" "}
                                                    {item.createdAt
                                                        ? dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")
                                                        : "-"}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-end",
                                                gap: 8,
                                                minWidth: 140,
                                            }}
                                        >
                                            <Access
                                                permission={ALL_PERMISSIONS.MAINTENANCE_EXECUTION_ADMIN.GET_DETAIL}
                                                hideChildren
                                            >
                                                <Button
                                                    type="primary"
                                                    icon={<EyeOutlined />}
                                                    onClick={() => {
                                                        setSelectedRequestId(item.requestId);
                                                        setOpenDetailModal(true);
                                                    }}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </Access>

                                            <Access
                                                permission={ALL_PERMISSIONS.MAINTENANCE_EXECUTION_ADMIN.GET_SUPPORT_REQUESTS}
                                                hideChildren
                                            >
                                                <Button
                                                    onClick={() => {
                                                        setSelectedRequestIdForSupport(item.requestId);
                                                        setOpenSupportModal(true);
                                                    }}
                                                >
                                                    Yêu cầu hỗ trợ
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
        );
    };

    // ===================== RENDER =====================
    return (
        <PageContainer
            title="Theo dõi thi công"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Nhập mã phiếu cần tìm..."
                        filterFields={[
                            { name: "deviceCode", label: "Mã thiết bị", placeholder: "Nhập mã thiết bị..." },
                            { name: "deviceName", label: "Tên thiết bị", placeholder: "Nhập tên thiết bị..." },
                        ]}
                        onSearch={(val) => {
                            setSearchValue(val);
                            setCurrentPage(1);
                        }}
                        onFilterApply={(filters) => {
                            setDeviceCode(filters.deviceCode || "");
                            setDeviceName(filters.deviceName || "");
                            setCurrentPage(1);
                        }}
                        showAddButton={false}
                        onReset={resetFilters}
                    />

                    <div className="flex flex-wrap gap-3 items-center">
                        <DateRangeFilter
                            fieldName="maintenanceRequest.createdAt"
                            onChange={(filter) => {
                                setCreatedAtFilter(filter);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            }
        >
            {renderExecutionCards()}

            {/* PAGINATION */}
            {meta.total > 0 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                    <Space direction="vertical" align="center" size={8}>
                        <div style={{ fontSize: 13 }}>
                            <span style={{ fontWeight: 500 }}>
                                {(currentPage - 1) * pageSize + 1}–
                                {Math.min(currentPage * pageSize, meta.total)}
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

            {/* DETAIL MODAL */}
            {openDetailModal && selectedRequestId && (
                <ViewAdminExecutionDetail
                    open={openDetailModal}
                    onClose={() => setOpenDetailModal(false)}
                    requestId={selectedRequestId}
                />
            )}

            {/* SUPPORT REQUEST MODAL */}
            {openSupportModal && selectedRequestIdForSupport && (
                <ModalAdminSupportRequests
                    open={openSupportModal}
                    onClose={() => setOpenSupportModal(false)}
                    requestId={selectedRequestIdForSupport}
                />
            )}
        </PageContainer>
    );
}
