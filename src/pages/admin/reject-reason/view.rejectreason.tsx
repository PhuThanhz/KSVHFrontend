import { Badge, Descriptions, Modal, Typography, Divider, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { useRejectReasonByIdQuery } from "@/hooks/useRejectReasons";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    reasonId?: string | number | null;
}

const ViewRejectReason = ({ onClose, open, reasonId }: IProps) => {
    const { data: reason, isLoading, isError } = useRejectReasonByIdQuery(reasonId || undefined);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin lý do từ chối
                </Title>
            }
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={isMobile ? "100%" : 700}
            maskClosable={false}
            destroyOnClose
            centered
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !reason ? (
                <Empty description="Không tìm thấy thông tin lý do" />
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
                        <Descriptions.Item label="Loại lý do">
                            <Badge
                                status="processing"
                                text={
                                    reason.reasonType === "ASSIGNMENT"
                                        ? "Phân công"
                                        : reason.reasonType === "PLAN"
                                            ? "Kế hoạch"
                                            : "Nghiệm thu"
                                }
                            />
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên lý do">
                            <Text strong>{reason.reasonName ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Mô tả chi tiết" span={2}>
                            <Text>{reason.description ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {reason.createdAt
                                    ? dayjs(reason.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {reason.updatedAt
                                    ? dayjs(reason.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{reason?.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{reason?.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ViewRejectReason;
