import { Modal, Spin, Empty, Card, Typography } from "antd";
import dayjs from "dayjs";
import { useRejectLogsByRequestIdQuery } from "@/hooks/useMaintenanceRequests";
import "dayjs/locale/vi";

const { Text } = Typography;

interface Props {
    requestId: string;
    onClose: () => void;
}

const RejectLogsModal = ({ requestId, onClose }: Props) => {
    const { data, isLoading } = useRejectLogsByRequestIdQuery(requestId);
    const logs = data?.logs || [];

    // thiết lập locale tiếng Việt
    dayjs.locale("vi");

    return (
        <Modal
            open
            onCancel={onClose}
            title="Lịch sử log từ chối"
            footer={null}
            width={700}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Spin />
                </div>
            ) : logs.length === 0 ? (
                <Empty description="Không có log từ chối nào" />
            ) : (
                <div style={{ maxHeight: 500, overflowY: "auto", paddingRight: 4 }}>
                    {logs.map((log, idx) => {
                        // format giờ kiểu “SA / CH” theo giờ Việt Nam
                        const timeFormatted = log.rejectedAt
                            ? dayjs(log.rejectedAt).format("DD/MM/YYYY hh:mm A")
                            : "-";

                        // nếu muốn hiển thị “SA” hoặc “CH” thay vì AM/PM:
                        const timeVN = timeFormatted
                            .replace("AM", "SA")
                            .replace("PM", "CH");

                        return (
                            <Card
                                key={idx}
                                size="small"
                                style={{
                                    marginBottom: 12,
                                    borderLeft: "4px solid #ff7875",
                                    background: "#fff9f9",
                                }}
                                title={
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text strong type="danger">
                                            {log.reasonName || "Không rõ lý do"}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {timeVN}
                                        </Text>
                                    </div>
                                }
                            >
                                {log.note && (
                                    <p
                                        style={{
                                            fontSize: 13,
                                            color: "#555",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Text type="secondary">Ghi chú: </Text>
                                        {log.note}
                                    </p>
                                )}
                                <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
                                    <Text type="secondary">Người từ chối: </Text>
                                    <b>{log.technicianName || "Không xác định"}</b>
                                </p>
                            </Card>
                        );
                    })}
                </div>
            )}
        </Modal>
    );
};

export default RejectLogsModal;
