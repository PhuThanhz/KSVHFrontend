import {
    Modal,
    Descriptions,
    Divider,
    Typography,
    Spin,
    Tag,
    Image,
} from "antd";
import { useMaintenanceScheduleByIdQuery } from "@/hooks/useMaintenanceSchedules";
import dayjs from "dayjs";

const { Title } = Typography;

interface Props {
    id: string;
    open: boolean;
    onClose: () => void;
}

const MaintenanceScheduleDetailModal = ({ id, open, onClose }: Props) => {
    const { data, isLoading } = useMaintenanceScheduleByIdQuery(id);

    if (isLoading) return <Spin size="large" />;

    const info = data?.requestInfo;
    const device = info?.device;

    const statusColorMap: Record<string, string> = {
        CHO_PHAN_CONG: "gold",
        DANG_PHAN_CONG: "blue",
        DA_XAC_NHAN: "cyan",
        DANG_BAO_TRI: "green",
        DA_HOAN_THANH: "success",
        HUY: "red",
    };

    return (
        <Modal
            title="Chi tiết lịch bảo trì"
            width={800}
            footer={null}
            open={open}
            onCancel={onClose}
        >
            <div style={{ padding: "8px 16px" }}>
                {/* ================= THÔNG TIN LỊCH BẢO TRÌ ================= */}
                <Title level={5}>Thông tin lịch bảo trì</Title>
                <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="ID">{data?.id}</Descriptions.Item>

                    <Descriptions.Item label="Ngày bảo trì">
                        {data?.scheduledDate
                            ? dayjs(data?.scheduledDate).format("DD/MM/YYYY HH:mm")
                            : "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Bảo hành">
                        <Tag color={data?.underWarranty ? "green" : "red"}>
                            {data?.underWarranty ? "Có" : "Không"}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Ghi chú" span={2}>
                        {data?.note || "-"}
                    </Descriptions.Item>
                </Descriptions>

                {/* ================= THÔNG TIN PHIẾU YÊU CẦU ================= */}
                {info && (
                    <>
                        <Divider />
                        <Title level={5}>Thông tin phiếu yêu cầu</Title>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Mã phiếu">
                                {info?.requestCode}
                            </Descriptions.Item>

                            <Descriptions.Item label="Người yêu cầu">
                                {info?.fullName}
                            </Descriptions.Item>

                            <Descriptions.Item label="Số điện thoại">
                                {info?.phone || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Mã khách/nhân viên">
                                {info?.employeeOrCustomerCode || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Chức vụ">
                                {info?.position || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Địa điểm" span={2}>
                                {info?.locationDetail || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Tên sự cố">
                                {info?.issueName || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Mức độ ưu tiên">
                                <Tag color="volcano">{info?.priorityLevel}</Tag>
                            </Descriptions.Item>

                            <Descriptions.Item label="Loại bảo trì">
                                {info?.maintenanceType}
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                <Tag
                                    color={statusColorMap[info?.status || ""] || "default"}
                                >
                                    {info?.status}
                                </Tag>
                            </Descriptions.Item>

                            <Descriptions.Item label="Ghi chú" span={2}>
                                {info?.note || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày tạo">
                                {info?.createdAt
                                    ? dayjs(info?.createdAt).format(
                                        "DD/MM/YYYY HH:mm"
                                    )
                                    : "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày cập nhật">
                                {info?.updatedAt
                                    ? dayjs(info?.updatedAt).format(
                                        "DD/MM/YYYY HH:mm"
                                    )
                                    : "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* File đính kèm */}
                        {(info?.attachment1 ||
                            info?.attachment2 ||
                            info?.attachment3) && (
                                <>
                                    <Divider />
                                    <Title level={5}>Hình ảnh đính kèm</Title>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 12,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {[info.attachment1, info.attachment2, info.attachment3]
                                            .filter(Boolean)
                                            .map((file: any, index: number) => (
                                                <Image
                                                    key={index}
                                                    width={120}
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/maintenance_request/${file}`}
                                                    alt={`attachment-${index + 1}`}
                                                />
                                            ))}
                                    </div>
                                </>
                            )}
                    </>
                )}

                {/* ================= THÔNG TIN THIẾT BỊ ================= */}
                {device && (
                    <>
                        <Divider />
                        <Title level={5}>Thông tin thiết bị</Title>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Mã thiết bị">
                                <Tag color="geekblue">{device.deviceCode}</Tag>
                            </Descriptions.Item>

                            <Descriptions.Item label="Tên thiết bị">
                                {device.deviceName}
                            </Descriptions.Item>

                            <Descriptions.Item label="Loại sở hữu">
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
                            </Descriptions.Item>

                            <Descriptions.Item label="Công ty">
                                {device.companyName || "-"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Phòng ban">
                                {device.departmentName || "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        {(device.image1 || device.image2 || device.image3) && (
                            <>
                                <Divider />
                                <Title level={5}>Hình ảnh thiết bị</Title>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: 12,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {[device.image1, device.image2, device.image3]
                                        .filter(Boolean)
                                        .map((img: any, index: number) => (
                                            <Image
                                                key={index}
                                                width={120}
                                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/DEVICE/${img}`}
                                                alt={`device-img-${index + 1}`}
                                            />
                                        ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </Modal>
    );
};

export default MaintenanceScheduleDetailModal;
