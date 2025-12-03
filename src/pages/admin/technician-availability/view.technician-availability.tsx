import {
    Modal,
    Descriptions,
    Typography,
    Divider,
    Spin,
    Empty,
    Badge,
    Button,
} from "antd";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { useTechnicianAvailabilityByIdQuery } from "@/hooks/useTechnicianAvailability";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    technicianAvailabilityId?: string | number | null;
    onEdit?: (data: any) => void;
}

const ViewDetailTechnicianAvailability = ({
    onClose,
    open,
    technicianAvailabilityId,
    onEdit,
}: IProps) => {
    const { data: availability, isLoading, isError } =
        useTechnicianAvailabilityByIdQuery(
            technicianAvailabilityId ? String(technicianAvailabilityId) : undefined
        );

    const renderStatus = (status?: string) => {
        switch (status) {
            case "AVAILABLE":
                return <Badge status="success" text="Đang rảnh" />;
            case "BUSY":
                return <Badge status="warning" text="Đang bận" />;
            case "OFFLINE":
                return <Badge status="default" text="Ngoại tuyến" />;
            case "ON_LEAVE":
                return <Badge status="error" text="Nghỉ phép" />;
            default:
                return "-";
        }
    };

    return (
        <Modal
            title={<Title level={4}>Chi tiết ca làm việc kỹ thuật viên</Title>}
            open={open}
            onCancel={() => onClose(false)}
            footer={
                !isLoading && availability ? (
                    <Button
                        type="primary"
                        onClick={() => onEdit && onEdit(availability)}
                    >
                        Chỉnh sửa
                    </Button>
                ) : null
            }
            width={isMobile ? "100%" : 800}
            maskClosable={false}
            destroyOnClose
            centered
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !availability ? (
                <Empty description="Không tìm thấy thông tin ca làm việc" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        size="middle"
                        column={2}
                        layout="vertical"
                        labelStyle={{
                            fontWeight: 600,
                            color: "#595959",
                            background: "#fafafa",
                        }}
                        contentStyle={{
                            fontSize: 14,
                            color: "#262626",
                        }}
                    >
                        <Descriptions.Item label="Kỹ thuật viên">
                            <Text strong>
                                {availability.technician?.fullName ?? "-"}
                            </Text>
                            {availability.technician?.technicianCode && (
                                <div>
                                    <Text type="secondary">
                                        Mã Nhân Viên: {availability.technician.technicianCode}
                                    </Text>
                                </div>
                            )}
                            {availability.technician?.phone && (
                                <div>
                                    <Text type="secondary">
                                        Số Điện Thoại: {availability.technician.phone}
                                    </Text>
                                </div>
                            )}
                            {availability.technician?.email && (
                                <div>
                                    <Text type="secondary">
                                        Gmail: {availability.technician.email}
                                    </Text>
                                </div>
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ca">
                            {availability.shiftTemplate ? (
                                <>
                                    <Text strong>
                                        {availability.shiftTemplate.name}
                                    </Text>
                                    <div>
                                        <Text type="secondary">
                                            {availability.shiftTemplate.startTime &&
                                                `${availability.shiftTemplate.startTime} - ${availability.shiftTemplate.endTime}`}
                                        </Text>
                                    </div>
                                </>
                            ) : (
                                "-"
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày làm việc">
                            <Text>
                                {availability.workDate
                                    ? dayjs(availability.workDate).format("DD/MM/YYYY")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            {renderStatus(availability.status)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Giờ bắt đầu">
                            <Text>{availability.startTime ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Giờ kết thúc">
                            <Text>{availability.endTime ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ca đặc biệt">
                            {availability.special ? (
                                <Badge status="processing" text="Có" />
                            ) : (
                                <Badge status="default" text="Không" />
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ghi chú" span={2}>
                            <Text>{availability.note || "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {availability.createdAt
                                    ? dayjs(availability.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {availability.updatedAt
                                    ? dayjs(availability.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{availability?.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{availability?.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ViewDetailTechnicianAvailability;
