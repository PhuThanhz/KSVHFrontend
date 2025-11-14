import { useState } from "react";
import {
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
} from "antd";
import dayjs from "dayjs";

import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

import { useAdminExecutionsQuery } from "@/hooks/useAdminExecutions";
import ViewAdminExecutionDetail from "@/components/admin/maintenance-execution/view.admin-maintenance-execution-detail";
import ModalAdminMaintenanceExecutionFilter from "@/components/admin/maintenance-execution/modal.admin-maintenance-execution-filter";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

export default function MaintenanceExecutionAdminPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [query, setQuery] = useState(`page=1&pageSize=10`);

    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    const [openFilter, setOpenFilter] = useState(false);

    const { data, isLoading } = useAdminExecutionsQuery(query);
    const list = data?.result || [];

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const handlePageChange = (newPage: number, newSize?: number) => {
        setPage(newPage);
        setPageSize(newSize || pageSize);
        setQuery(`page=${newPage}&pageSize=${newSize || pageSize}`);
    };

    return (
        <div style={{ padding: 24 }}>

            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <Title level={3} style={{ margin: 0 }}>
                    Theo dõi thi công
                </Title>

                <Button onClick={() => setOpenFilter(true)}>Lọc</Button>
            </div>

            {/* SEARCH + DATE FILTER */}
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
                    placeholder="Mã phiếu / mã thiết bị / tên KTV"
                    onSearch={(value) =>
                        setQuery(
                            `page=1&pageSize=${pageSize}&keyword=${encodeURIComponent(value)}`
                        )
                    }
                    style={{ width: 260 }}
                    allowClear
                />

                <RangePicker
                    onChange={(dates) => {
                        if (!dates || !dates[0] || !dates[1]) return;

                        const from = dates[0].toISOString();
                        const to = dates[1].toISOString();

                        setQuery(
                            `page=1&pageSize=${pageSize}&createdFrom=${from}&createdTo=${to}`
                        );
                        setPage(1);
                    }}
                />
            </div>

            {/* LIST */}
            {isLoading ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : list.length === 0 ? (
                <Empty description="Không có phiếu thi công nào" />
            ) : (
                <>
                    {/* LIST ITEMS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {list.map((item) => {
                            const imgs = [
                                item.deviceImage1,
                                item.deviceImage2,
                                item.deviceImage3,
                            ].filter(Boolean);

                            const total = item.totalTasks ?? 0;
                            const done = item.completedTasks ?? 0;

                            const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                            return (
                                <Card
                                    key={item.requestId}
                                    bordered
                                    bodyStyle={{ padding: 16 }}
                                    style={{ borderRadius: 8 }}
                                >
                                    <Row gutter={[12, 12]}>

                                        {/* IMAGE BLOCK */}
                                        <Col xs={24} sm={6} md={5}>
                                            {imgs.length > 0 ? (
                                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                    <Image
                                                        src={`${backendURL}/storage/DEVICE/${imgs[0]}`}
                                                        width="100%"
                                                        height={120}
                                                        style={{
                                                            objectFit: "cover",
                                                            borderRadius: 6,
                                                            border: "1px solid #e8e8e8",
                                                        }}
                                                    />

                                                    {imgs.length > 1 && (
                                                        <div style={{ display: "flex", gap: 8 }}>
                                                            {imgs.slice(1).map((img, idx) => (
                                                                <Image
                                                                    key={idx}
                                                                    src={`${backendURL}/storage/DEVICE/${img}`}
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

                                        {/* INFO BLOCK */}
                                        <Col xs={24} sm={18} md={19}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexWrap: "wrap",
                                                    gap: 8,
                                                }}
                                            >
                                                {/* left side */}
                                                <div>
                                                    <Text strong style={{ fontSize: 16 }}>
                                                        {item.deviceName}
                                                    </Text>{" "}
                                                    <Text type="secondary">({item.deviceCode})</Text>

                                                    <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
                                                        <p>
                                                            <Text type="secondary">Mã phiếu: </Text>
                                                            <Text strong>{item.requestCode}</Text>
                                                        </p>

                                                        <p>
                                                            <Text type="secondary">Trạng thái phiếu: </Text>
                                                            <Tag color="gold">{item.status}</Tag>
                                                        </p>

                                                        <p>
                                                            <Text type="secondary">Tiến độ công việc: </Text>
                                                            <Tag color="blue">
                                                                {done}/{total} ({percent}%)
                                                            </Tag>
                                                        </p>

                                                        <p>
                                                            <Text type="secondary">Kỹ thuật viên thực hiện: </Text>
                                                            {item.technicianName || "—"}
                                                        </p>

                                                        <p style={{ fontSize: 12, color: "#888" }}>
                                                            Tạo lúc:{" "}
                                                            {item.createdAt
                                                                ? dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* ACTIONS */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 8,
                                                        minWidth: 160,
                                                    }}
                                                >
                                                    <Access
                                                        permission={
                                                            ALL_PERMISSIONS.MAINTENANCE_EXECUTION_ADMIN.GET_DETAIL
                                                        }
                                                        hideChildren
                                                    >
                                                        <Button
                                                            type="primary"
                                                            onClick={() => {
                                                                setSelectedRequestId(item.requestId);
                                                                setOpenDetailModal(true);
                                                            }}
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

                    {/* PAGINATION */}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                        <Pagination
                            current={data?.meta.page}
                            total={data?.meta.total}
                            pageSize={data?.meta.pageSize}
                            showSizeChanger
                            onChange={handlePageChange}
                            onShowSizeChange={handlePageChange}
                        />
                    </div>
                </>
            )}

            {/* DETAIL MODAL */}
            {openDetailModal && (
                <ViewAdminExecutionDetail
                    open={openDetailModal}
                    onClose={() => setOpenDetailModal(false)}
                    requestId={selectedRequestId}
                />
            )}

            {/* FILTER MODAL */}
            <ModalAdminMaintenanceExecutionFilter
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                onApply={(q) => {
                    const params = new URLSearchParams(q).toString();
                    setQuery(`page=1&pageSize=${pageSize}&${params}`);
                    setPage(1);
                }}
            />
        </div>
    );
}
