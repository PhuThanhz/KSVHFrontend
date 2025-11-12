import { Modal, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useCompleteExecutionMutation } from "@/hooks/maintenance/useMaintenanceExecutions";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId?: string | null;
    requestCode?: string | null;
    /** Callback cho cha khi hành động thành công */
    onSuccess?: () => void;
}

/** ===================== Modal Xác Nhận Hoàn Thành Thi Công ===================== */
const ModalCompleteExecution = ({
    open,
    onClose,
    requestId,
    requestCode,
    onSuccess,
}: IProps) => {
    const { mutate: completeExecution, isPending } = useCompleteExecutionMutation();

    const handleConfirm = () => {
        if (!requestId) return;
        completeExecution(requestId, {
            onSuccess: () => {
                message.success("Đã hoàn thành thi công!");
                onClose(false);
                onSuccess?.(); // callback cho HomeExecution refetch
            },
            onError: (err: any) => {
                message.error(err?.message || "Không thể hoàn thành thi công");
            },
        });
    };

    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    <span>Xác nhận hoàn thành thi công</span>
                </div>
            }
            okText="Hoàn thành"
            cancelText="Hủy"
            okButtonProps={{ loading: isPending, type: "primary" }}
            onOk={handleConfirm}
        >
            <p>
                Bạn có chắc chắn muốn{" "}
                <strong style={{ color: "#52c41a" }}>đánh dấu hoàn thành</strong>{" "}
                cho phiếu <strong>{requestCode || "..."}</strong> không?
            </p>
            <p style={{ color: "#999" }}>
                Sau khi xác nhận, hệ thống sẽ cập nhật trạng thái phiếu sang{" "}
                <strong>“CHỜ NGHIỆM THU”</strong> và ghi nhận thời điểm hoàn thành.
            </p>
        </Modal>
    );
};

export default ModalCompleteExecution;
