import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useStartExecutionMutation } from "@/hooks/maintenance/useMaintenanceExecutions";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId?: string | null;
    requestCode?: string | null;
    /** Callback cho cha khi hành động thành công */
    onSuccess?: () => void;
}

/** ===================== Modal Xác Nhận Bắt Đầu Thi Công ===================== */
const ModalStartExecution = ({
    open,
    onClose,
    requestId,
    requestCode,
    onSuccess,
}: IProps) => {
    const { mutate: startExecution, isPending } = useStartExecutionMutation();

    const handleConfirm = () => {
        if (!requestId) return;
        startExecution(requestId, {
            onSuccess: () => {
                message.success("Đã bắt đầu thi công thành công");
                onClose(false);
                onSuccess?.(); // callback cho HomeExecution refetch
            },
            onError: (err: any) => {
                message.error(err?.message || "Không thể bắt đầu thi công");
            },
        });
    };

    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ExclamationCircleOutlined style={{ color: "#faad14" }} />
                    <span>Xác nhận bắt đầu thi công</span>
                </div>
            }
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isPending, type: "primary" }}
            onOk={handleConfirm}
        >
            <p>
                Bạn có chắc chắn muốn{" "}
                <strong style={{ color: "#1677ff" }}>bắt đầu thi công</strong>{" "}
                cho phiếu <strong>{requestCode || "..."}</strong> không?
            </p>
            <p style={{ color: "#999" }}>
                Sau khi xác nhận, hệ thống sẽ ghi nhận thời điểm bắt đầu thi công và cập
                nhật trạng thái của phiếu sang <strong>“ĐANG BẢO TRÌ”</strong>.
            </p>
        </Modal>
    );
};

export default ModalStartExecution;
