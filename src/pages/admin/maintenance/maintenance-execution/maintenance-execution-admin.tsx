import { useRef, useState } from "react";
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
import queryString from "query-string";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";

import { useAdminExecutionsQuery } from "@/hooks/useAdminExecutions";
import ViewAdminExecutionDetail from "./view.admin-maintenance-execution-detail";
import ModalAdminSupportRequests from "./modal.admin-support-requests";

const { Text } = Typography;

interface TechnicianSummary {
    id: string;
    fullName: string;
    phone?: string;
    email?: string;
    isMain?: boolean;
}

interface ExecutionCard {
    requestId: string;
    requestCode: string;
    status: string;
    deviceName?: string;
    deviceCode?: string;
    deviceImage1?: string;
    deviceImage2?: string;
    deviceImage3?: string;
    createdAt?: string;
    totalTasks?: number;
    completedTasks?: number;
    technicians?: TechnicianSummary[];
}

export default function MaintenanceExecutionAdminPage() {
    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}`
    );
    const tableRef = useRef<ActionType>(null);

    // ===================== MODALS =====================
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [openSupportModal, setOpenSupportModal] = useState(false);
    const [selectedRequestIdForSupport, setSelectedRequestIdForSupport] = useState<string | null>(null);

    // ===================== FETCH DATA =====================
    const { data, isFetching } = useAdminExecutionsQuery(query);
    const executions = (data?.result || []) as ExecutionCard[];
    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    // ===================== FILTER OPTIONS =====================
    const statusOptions = [
        { label: "Đang bảo trì", value: "DANG_BAO_TRI", color: "orange" },
        { label: "Từ chối nghiệm thu", value: "TU_CHOI_NGHIEM_THU", color: "red" },
        { label: "Hoàn thành", value: "HOAN_THANH", color: "green" },
    ];

    // ===================== BUILD QUERY =====================
    const buildQuery = (params: any) => {
        const q: any = {
            page: params.current || PAGINATION_CONFIG.DEFAULT_PAGE,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        if (params.requestCode) {
            q.filter = `maintenanceRequest.requestCode~'${params.requestCode}'`;
        }

        if (params.deviceCode) {
            if (q.filter) q.filter += `&filter=maintenanceRequest.device.deviceCode~'${params.deviceCode}'`;
            else q.filter = `maintenanceRequest.device.deviceCode~'${params.deviceCode}'`;
        }

        if (params.deviceName) {
            if (q.filter) q.filter += `&filter=maintenanceRequest.device.deviceName~'${params.deviceName}'`;
            else q.filter = `maintenanceRequest.device.deviceName~'${params.deviceName}'`;
        }

        if (params.status) {
            if (q.filter) q.filter += `&filter=maintenanceRequest.status='${params.status}'`;
            else q.filter = `maintenanceRequest.status='${params.status}'`;
        }

        if (params.createdAtFilter) {
            if (q.filter) q.filter += `&filter=${params.createdAtFilter}`;
            else q.filter = params.createdAtFilter;
        }

        return queryString.stringify(q, { encode: false });
    };

    // ===================== CARD LIST RENDER =====================
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {executions.map((item) => {
                    const imgs = [item.deviceImage1, item.deviceImage2, item.deviceImage3].filter(Boolean);
                    const total = item.totalTasks ?? 0;
                    const done = item.completedTasks ?? 0;
                    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                    return (
                        <Card
                            key={item.requestId}
                            bordered
                            hoverable
                            bodyStyle={{ padding: 16 }}
                            style={{ borderRadius: 8, border: "1px solid #e8e8e8" }}
                        >
                            <Row gutter={[12, 12]}>
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
                                                background: "#f5f5f5",
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
                                            gap: 8,
                                        }}
                                    >
                                        <div>
                                            <Text strong style={{ fontSize: 16 }}>
                                                {item.deviceName}
                                            </Text>{" "}
                                            <Text type="secondary">({item.deviceCode})</Text>

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

                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                        onSearch={(val) =>
                            setQuery(
                                `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=maintenanceRequest.requestCode~'${val}'`
                            )
                        }
                        onFilterApply={(filters) => {
                            const temp = buildQuery({
                                current: 1,
                                pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
                                ...filters,
                            });
                            setQuery(temp);
                        }}
                        showAddButton={false}
                        onReset={() =>
                            setQuery(
                                `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}`
                            )
                        }
                    />

                    <div className="flex flex-wrap gap-3 items-center">
                        <AdvancedFilterSelect
                            buttonLabel="Lọc trạng thái"
                            fields={[
                                {
                                    key: "status",
                                    label: "Trạng thái phiếu",
                                    options: statusOptions,
                                },
                            ]}
                            onChange={(filters) => {
                                const temp = buildQuery({
                                    current: 1,
                                    pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
                                    ...filters,
                                });
                                setQuery(temp);
                            }}
                        />


                        <DateRangeFilter
                            fieldName="maintenanceRequest.createdAt"
                            onChange={(filter) => {
                                const temp = buildQuery({
                                    current: 1,
                                    pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
                                    createdAtFilter: filter,
                                });
                                setQuery(temp);
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
                                {(meta.page - 1) * meta.pageSize + 1}–
                                {Math.min(meta.page * meta.pageSize, meta.total)}
                            </span>{" "}
                            trên{" "}
                            <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                {meta.total.toLocaleString()}
                            </span>{" "}
                            phiếu
                        </div>
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
