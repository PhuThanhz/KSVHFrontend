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
    const reject = data?.rejectInfo;

    const statusColorMap: Record<string, string> = {
        CHO_PHAN_CONG: "gold",
        DANG_PHAN_CONG: "blue",
        DA_XAC_NHAN: "cyan",
        DANG_BAO_TRI: "green",
        DA_HOAN_THANH: "success",
        HUY: "red",
    };

    const creatorLabel =
        info?.creatorType === "CUSTOMER"
            ? "Khách hàng"
            : info?.creatorType === "EMPLOYEE"
                ? "Nhân viên nội bộ"
                : "Không xác định";

    const creatorCodeLabel =
        info?.creatorType === "CUSTOMER" ? "Mã khách hàng" : "Mã nhân viên";

    return (
        <div style={{ padding: "8px 16px" }}>
            <Title level={5}>Thông tin yêu cầu</Title>
            <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Mã phiếu">
                    {info?.requestCode}
                </Descriptions.Item>
                <Descriptions.Item label="Người tạo">
                    {info?.fullName}
                </Descriptions.Item>

                <Descriptions.Item label="Loại người tạo">
                    {creatorLabel}
                </Descriptions.Item>
                <Descriptions.Item label={creatorCodeLabel}>
                    <Tag
                        color={
                            info?.creatorType === "CUSTOMER"
                                ? "purple"
                                : "blue"
                        }
                    >
                        {info?.employeeOrCustomerCode}
                    </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Số điện thoại">
                    {info?.phone || "-"}
                </Descriptions.Item>
                {info?.creatorType === "EMPLOYEE" && (
                    <>
                        <Descriptions.Item label="Chức vụ">
                            {info?.position || "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Công ty">
                            {info?.companyName || "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phòng ban / Nhà hàng">
                            {info?.departmentName || "-"}
                        </Descriptions.Item>
                    </>
                )}

                <Descriptions.Item label="Thiết bị">
                    {info?.deviceName}
                </Descriptions.Item>
                <Descriptions.Item label="Mã thiết bị">
                    <Tag color="geekblue">{info?.deviceCode}</Tag>
                </Descriptions.Item>

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

                <Descriptions.Item label="Địa điểm" span={2}>
                    {info?.locationDetail || "-"}
                </Descriptions.Item>
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

            {/* =================== Tệp đính kèm =================== */}
            {(info?.attachment1 || info?.attachment2 || info?.attachment3) && (
                <>
                    <Divider />
                    <Title level={5}>Tệp đính kèm</Title>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {[info?.attachment1, info?.attachment2, info?.attachment3]
                            .filter(Boolean)
                            .map((file, index) => (
                                <Image
                                    key={index}
                                    width={120}
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/MAINTENANCE_REQUEST/${file}`}
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
                        <Descriptions.Item label="Kỹ thuật viên">
                            {assign.technicianName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian phân công">
                            {assign.assignedAt
                                ? dayjs(assign.assignedAt).format(
                                    "DD/MM/YYYY HH:mm"
                                )
                                : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Người phân công">
                            {assign.assignedBy}
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
                            {survey.surveyInfo?.causeName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mức độ hư hại">
                            {survey.surveyInfo?.damageLevel}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại bảo trì thực tế">
                            {survey.surveyInfo?.maintenanceTypeActual}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày khảo sát">
                            {survey.surveyInfo?.surveyDate
                                ? dayjs(survey.surveyInfo?.surveyDate).format(
                                    "DD/MM/YYYY HH:mm"
                                )
                                : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Kỹ thuật viên khảo sát">
                            {survey.surveyInfo?.technicianName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mô tả thực tế">
                            {survey.surveyInfo?.actualIssueDescription || "-"}
                        </Descriptions.Item>
                    </Descriptions>
                </>
            )}

            {/* =================== Thông tin từ chối =================== */}
            {reject && (
                <>
                    <Divider />
                    <Title level={5}>Thông tin từ chối</Title>
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Lý do">
                            {reject.reasonName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">
                            {reject.note}
                        </Descriptions.Item>
                    </Descriptions>
                </>
            )}
        </div>
    );
};

export default ViewMaintenanceDetail;
