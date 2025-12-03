import { Modal } from "antd";
import { useGenerateScheduleRequestMutation } from "@/hooks/useMaintenanceSchedules";

interface Props {
    id: string;
    open: boolean;
    onClose: () => void;
}

const GenerateRequestModal = ({ id, open, onClose }: Props) => {
    const mutation = useGenerateScheduleRequestMutation();

    const handleConfirm = () => {
        mutation.mutate(id, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal
            title="Tạo phiếu bảo trì"
            open={open}
            onCancel={onClose}
            onOk={handleConfirm}
            okButtonProps={{ loading: mutation.isPending }}
        >
            Bạn có chắc chắn muốn tạo phiếu bảo trì cho lịch này?
        </Modal>
    );
};

export default GenerateRequestModal;
