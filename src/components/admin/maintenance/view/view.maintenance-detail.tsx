import { Descriptions, Tag, Divider, Typography, Spin, Image } from "antd";
import { useMaintenanceRequestByIdQuery } from "@/hooks/useMaintenanceRequests";
import dayjs from "dayjs";

const { Title } = Typography;

interface ViewMaintenanceDetailProps {
    requestId: string;
}

const ViewMaintenanceDetail = ({ requestId }: ViewMaintenanceDetailProps) => {
    const { data, isLoading } = useMaintenanceRequestByIdQuery(requestId);

    if (isLoading) return <Spin size="large" />;

    const info = data?.requestInfo;
    const assign = data?.assignmentInfo;
    const survey = data?.surveyInfo;
    const device = info?.device;

    const statusColorMap: Record<string, string> = {
        CHO_PHAN_CONG: "gold",
        DANG_PHAN_CONG: "blue",
        DA_XAC_NHAN: "cyan",
        DANG_BAO_TRI: "green",
        DA_HOAN_THANH: "success",
        HUY: "red",
    };

    const creatorCodeLabel =
        info?.creatorType === "CUSTOMER" ? "Mã khách hàng" : "Mã nhân viên";

    return (
        <div style={{ padding: "8px 16px" }}>
            <Title level={5}>Thông tin yêu cầu</Title>
            <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Mã phiếu">
                    {info?.requestCode}
                </Descriptions.Item>

                <Descriptions.Item label="Người tạo phiếu">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{info?.fullName}</span>
                        <Tag color={info?.creatorType === "CUSTOMER" ? "purple" : "blue"}>
                            {info?.creatorType === "CUSTOMER"
                                ? "Khách hàng tạo"
                                : "Nhân viên nội bộ tạo"}
                        </Tag>
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label={creatorCodeLabel}>
                    <Tag color={info?.creatorType === "CUSTOMER" ? "purple" : "blue"}>
                        {info?.employeeOrCustomerCode}
                    </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Số điện thoại">
                    {info?.phone || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa điểm">
                    {info?.locationDetail || "-"}
                </Descriptions.Item>
                {info?.creatorType === "EMPLOYEE" && (
                    <>
                        <Descriptions.Item label="Chức vụ">
                            {info?.position || "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa điểm">
                            {info?.locationDetail || "-"}
                        </Descriptions.Item>
                    </>
                )}

                <Descriptions.Item label="Ghi chú" span={2}>
                    {info?.note || "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Ngày tạo">
                    {info?.createdAt
                        ? dayjs(info?.createdAt).format("DD/MM/YYYY HH:mm")
                        : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                    {info?.updatedAt
                        ? dayjs(info?.updatedAt).format("DD/MM/YYYY HH:mm")
                        : "-"}
                </Descriptions.Item>
            </Descriptions>

            {/* =================== Thông tin thiết bị =================== */}
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
                        <Descriptions.Item label="Thuộc về">
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
                        <Descriptions.Item label="Phòng ban / Nhà hàng">
                            {device.departmentName || "-"}
                        </Descriptions.Item>
                    </Descriptions>

                    {(device.image1 || device.image2 || device.image3) && (
                        <>
                            <Divider />
                            <Title level={5}>Hình ảnh thiết bị</Title>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                {[device.image1, device.image2, device.image3]
                                    .filter(Boolean)
                                    .map((img, index) => (
                                        <Image
                                            key={index}
                                            width={120}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/DEVICE/${img}`}
                                            alt={`device-image-${index + 1}`}
                                        />
                                    ))}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* =================== Thông tin phiếu bảo trì =================== */}
            <Divider />
            <Title level={5}>Thông tin phiếu bảo trì</Title>
            <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Sự cố">
                    {info?.issueName || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Mức ưu tiên">
                    <Tag color="volcano">{info?.priorityLevel}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Loại bảo trì">
                    {info?.maintenanceType}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={statusColorMap[info?.status || ""] || "default"}>
                        {info?.status}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>

            {/* =================== Tệp đính kèm =================== */}
            {(info?.attachment1 || info?.attachment2 || info?.attachment3) && (
                <>
                    <Divider />
                    <Title level={5}>Hình ảnh thông tin phiếu bảo trì</Title>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {[info?.attachment1, info?.attachment2, info?.attachment3]
                            .filter(Boolean)
                            .map((file, index) => (
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

            {/* =================== Thông tin phân công =================== */}
            {assign && (
                <>
                    <Divider />
                    <Title level={5}>Thông tin phân công</Title>
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Mã kỹ thuật viên">
                            {assign.technicianCode || "-"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên kỹ thuật viên">
                            {assign.technicianName || "-"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Số điện thoại">
                            {assign.technicianPhone || "-"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Thời gian phân công">
                            {assign.assignedAt
                                ? dayjs(assign.assignedAt).format("DD/MM/YYYY HH:mm")
                                : "-"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Người phân công">
                            {assign.assignedBy || "-"}
                        </Descriptions.Item>
                    </Descriptions>
                </>
            )}

            {/* =================== Thông tin khảo sát =================== */}
            {survey && (
                <>
                    <Divider />
                    <Title level={5}>Thông tin khảo sát</Title>
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Nguyên nhân">
                            {survey?.causeName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mức độ hư hại">
                            {survey?.damageLevel}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại bảo trì thực tế">
                            {survey?.maintenanceTypeActual}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày khảo sát">
                            {survey?.surveyDate
                                ? dayjs(survey?.surveyDate).format(
                                    "DD/MM/YYYY HH:mm"
                                )
                                : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Kỹ thuật viên khảo sát">
                            {survey?.technicianName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mô tả thực tế">
                            {survey?.actualIssueDescription || "-"}
                        </Descriptions.Item>
                    </Descriptions>
                </>
            )}
        </div>
    );
};

export default ViewMaintenanceDetail;
