import { Modal, Typography, Button, Spin, Alert } from "antd";
import { useAutoAssignAllMutation } from "@/hooks/maintenance/useMaintenanceRequests";

const { Text } = Typography;

interface ModalAutoAssignProps {
    open: boolean;
    onClose: () => void;
}

const ModalAutoAssignMaintenance = ({ open, onClose }: ModalAutoAssignProps) => {
    const { mutate: autoAssignAll, isPending } = useAutoAssignAllMutation();

    const handleAutoAssign = () => {
        autoAssignAll(undefined, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title="Phân công tự động kỹ thuật viên"
            footer={null}
            centered
            width={450}
        >
            <div style={{ padding: "12px 8px" }}>
                <Alert
                    message="Hệ thống sẽ tự động tìm kỹ thuật viên phù hợp và phân công cho các phiếu đang chờ."
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Text>Bạn có chắc chắn muốn thực hiện phân công tự động?</Text>
                    <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 12 }}>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button
                            type="primary"
                            loading={isPending}
                            onClick={handleAutoAssign}
                        >
                            Xác nhận phân công
                        </Button>
                    </div>
                </div>

                {isPending && (
                    <div style={{ marginTop: 20, textAlign: "center" }}>
                        <Spin tip="Đang phân công..." />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ModalAutoAssignMaintenance;
