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
    const [showDetail, setShowDetail] = useState<string | null>(null);
    const [openFilter, setOpenFilter] = useState(false);

    const { data, isLoading } = useAdminExecutionsQuery(query);
    const list = data?.result || [];

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

            {/* BỘ LỌC NHANH */}
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
                            `page=1&pageSize=${pageSize}&requestCode=${encodeURIComponent(
                                value
                            )}`
                        )
                    }
                    style={{ width: 260 }}
                    allowClear
                />

                <RangePicker
                    onChange={(dates) => {
                        if (dates && dates[0] && dates[1]) {
                            const from = dates[0].toISOString();
                            const to = dates[1].toISOString();
                            setQuery(
                                `page=1&pageSize=${pageSize}&createdFrom=${from}&createdTo=${to}`
                            );
                            setPage(1);
                        }
                    }}
                />
            </div>

            {/* DANH SÁCH THI CÔNG */}
            {isLoading ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : list.length === 0 ? (
                <Empty description="Không có phiếu thi công nào" />
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {list.map((item) => {
                            const deviceImages = [
                                item.deviceImage1,
                                item.deviceImage2,
                                item.deviceImage3,
                            ].filter(Boolean);

                            const hasImages = deviceImages.length > 0;

                            return (
                                <Card
                                    key={item.requestId}
                                    bordered
                                    hoverable
                                    bodyStyle={{ padding: 16 }}
                                    style={{
                                        borderRadius: 8,
                                        border: "1px solid #e8e8e8",
                                    }}
                                >
                                    <Row gutter={[12, 12]} align="middle">

                                        {/* ẢNH THIẾT BỊ */}
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

                                        {/* THÔNG TIN CHI TIẾT */}
                                        <Col xs={24} sm={18} md={19}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                {/* LEFT CONTENT */}
                                                <div>
                                                    <div style={{ display: "flex", gap: 8 }}>
                                                        <Text strong style={{ fontSize: 16 }}>
                                                            {item.deviceName}
                                                        </Text>
                                                        <Text type="secondary">
                                                            ({item.deviceCode})
                                                        </Text>
                                                    </div>

                                                    <div
                                                        style={{
                                                            marginTop: 6,
                                                            fontSize: 13,
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
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
                                                                {item.progressPercent ?? 0}%
                                                            </Tag>
                                                        </p>
                                                        <p>
                                                            <Text type="secondary">KTV: </Text>
                                                            {item.technicianName || "—"}
                                                        </p>
                                                        <p
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#888",
                                                            }}
                                                        >
                                                            Tạo lúc:{" "}
                                                            {item.createdAt
                                                                ? dayjs(item.createdAt).format(
                                                                    "DD/MM/YYYY HH:mm"
                                                                )
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* HÀNH ĐỘNG */}
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
                            />
                        </div>
                    )}
                </>
            )}

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
