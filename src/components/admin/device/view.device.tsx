import { Drawer, Descriptions, Divider, Tag, Table, Spin } from "antd";
import { useDeviceByIdQuery } from "@/hooks/useDevices";
import { formatCurrency } from "@/config/format";
import dayjs from "dayjs";
import React from "react";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    deviceId?: string | null;
}

const ViewDevice: React.FC<IProps> = ({ open, onClose, deviceId }) => {
    const { data, isFetching } = useDeviceByIdQuery(deviceId ?? "");

    const renderDate = (v?: string | null) =>
        v ? dayjs(v).format("DD/MM/YYYY") : "-";

    const renderMoney = (v?: string | number | null) =>
        v != null && v !== ""
            ? formatCurrency(Number(v))
            : "-";

    const renderTag = (value?: string | null) =>
        value ? <Tag color="blue">{value}</Tag> : <Tag>-</Tag>;

    return (
        <Drawer
            title="Chi tiết thiết bị / công cụ dụng cụ"
            width={900}
            onClose={() => onClose(false)}
            open={open}
            destroyOnClose
        >
            {isFetching ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin tip="Đang tải dữ liệu..." />
                </div>
            ) : data ? (
                <>
                    {/* =============== THÔNG TIN CƠ BẢN =============== */}
                    <Descriptions bordered size="middle" column={2}>
                        <Descriptions.Item label="Mã thiết bị">{data.deviceCode}</Descriptions.Item>
                        <Descriptions.Item label="Mã kế toán">{data.accountingCode || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Tên thiết bị">{data.deviceName}</Descriptions.Item>
                        <Descriptions.Item label="Loại thiết bị">{data.deviceType?.typeName || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Công ty">{data.company?.name || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Phòng ban / Nhà hàng">{data.department?.name || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Người phụ trách">{data.manager?.name || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Nhà cung cấp">{data.supplier?.supplierName || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Đơn vị">{data.unit?.name || "-"}</Descriptions.Item>

                        <Descriptions.Item label="Loại sở hữu">
                            {data.ownershipType === "INTERNAL"
                                ? "Thiết bị nội bộ"
                                : data.ownershipType === "CUSTOMER"
                                    ? "Thiết bị thuộc khách hàng"
                                    : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">{renderTag(data.status)}</Descriptions.Item>

                        {data.ownershipType === "CUSTOMER" && data.customer && (
                            <>
                                <Descriptions.Item label="Khách hàng">{data.customer.name || "-"}</Descriptions.Item>
                                <Descriptions.Item label="Mã khách hàng">{data.customer.customerCode || "-"}</Descriptions.Item>
                            </>
                        )}
                    </Descriptions>

                    <Divider orientation="left">Thông tin kỹ thuật</Divider>
                    <Descriptions bordered size="middle" column={2}>
                        <Descriptions.Item label="Thương hiệu">{data.brand || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Model">{data.modelDesc || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Công suất / Năng lượng">{data.powerCapacity || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Đơn giá">{renderMoney(data.unitPrice)}</Descriptions.Item>
                        <Descriptions.Item label="Kích thước (D x R x C)">
                            {data.length || data.width || data.height
                                ? `${data.length ?? "-"} x ${data.width ?? "-"} x ${data.height ?? "-"} (cm)`
                                : "-"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider orientation="left">Thông tin sử dụng & bảo trì</Divider>
                    <Descriptions bordered size="middle" column={2}>
                        <Descriptions.Item label="Ngày đưa vào sử dụng">{renderDate(data.startDate)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày hết hạn bảo hành">{renderDate(data.warrantyExpiryDate)}</Descriptions.Item>
                        <Descriptions.Item label="Chu kỳ khấu hao">
                            {data.depreciationPeriodValue
                                ? `${data.depreciationPeriodValue} ${data.depreciationPeriodUnit === "MONTH"
                                    ? "tháng"
                                    : data.depreciationPeriodUnit === "QUARTER"
                                        ? "quý"
                                        : "năm"
                                }`
                                : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày hết khấu hao dự kiến">{renderDate(data.depreciationEndDate)}</Descriptions.Item>
                        <Descriptions.Item label="Tần suất bảo dưỡng">
                            {data.maintenanceFrequencyValue
                                ? `${data.maintenanceFrequencyValue} ${data.maintenanceFrequencyUnit === "DAY"
                                    ? "ngày"
                                    : data.maintenanceFrequencyUnit === "WEEK"
                                        ? "tuần"
                                        : data.maintenanceFrequencyUnit === "MONTH"
                                            ? "tháng"
                                            : "năm"
                                } / lần`
                                : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Chi tiết bảo dưỡng">
                            {data.maintenanceDayOfMonth
                                ? `Ngày ${data.maintenanceDayOfMonth}`
                                : data.maintenanceMonth
                                    ? `Tháng ${data.maintenanceMonth}`
                                    : "-"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider orientation="left">Ghi chú</Divider>
                    <div
                        style={{
                            whiteSpace: "pre-line",
                            padding: "8px 12px",
                            border: "1px solid #f0f0f0",
                            borderRadius: 6,
                            minHeight: 50,
                        }}
                    >
                        {data.note || "(Không có ghi chú)"}
                    </div>

                    <Divider orientation="left">Hình ảnh</Divider>
                    {([data.image1, data.image2, data.image3].filter(Boolean).length > 0) ? (
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            {[data.image1, data.image2, data.image3]
                                .filter(Boolean)
                                .map((fileName, idx) => {
                                    const safeName = String(fileName);
                                    const fullUrl = safeName.startsWith("http")
                                        ? safeName
                                        : safeName.startsWith("/storage/")
                                            ? `${import.meta.env.VITE_BACKEND_URL}${safeName}`
                                            : `${import.meta.env.VITE_BACKEND_URL}/storage/device/${safeName}`;

                                    return (
                                        <img
                                            key={idx}
                                            src={fullUrl}
                                            alt={`device-${idx + 1}`}
                                            width={200}
                                            height={150}
                                            style={{
                                                objectFit: "cover",
                                                borderRadius: 8,
                                                border: "1px solid #f0f0f0",
                                            }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    "https://via.placeholder.com/200x150?text=No+Image";
                                            }}
                                        />
                                    );
                                })}
                        </div>
                    ) : (
                        <div>Không có hình ảnh</div>
                    )}

                    <Divider orientation="left">Danh sách linh kiện</Divider>
                    <Table
                        size="small"
                        bordered
                        dataSource={data.parts || []}
                        pagination={false}
                        rowKey={(r) => String(r.partCode || r.partName)}
                        columns={[
                            { title: "Mã linh kiện", dataIndex: "partCode", key: "partCode" },
                            { title: "Tên linh kiện", dataIndex: "partName", key: "partName" },
                            {
                                title: "Số lượng",
                                dataIndex: "quantity",
                                key: "quantity",
                                align: "center",
                            },
                        ]}
                    />

                    <Divider orientation="left">Thông tin hệ thống</Divider>
                    <Descriptions bordered size="small" column={2}>
                        <Descriptions.Item label="Người tạo">{data.createdBy || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {data.createdAt ? dayjs(data.createdAt).format("DD/MM/YYYY HH:mm") : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Người cập nhật">{data.updatedBy || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">
                            {data.updatedAt ? dayjs(data.updatedAt).format("DD/MM/YYYY HH:mm") : "-"}
                        </Descriptions.Item>
                    </Descriptions>
                </>
            ) : (
                <div>Không có dữ liệu thiết bị</div>
            )}
        </Drawer>
    );
};

export default ViewDevice;
