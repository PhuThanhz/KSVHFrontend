import { Modal, Typography } from "antd";
import { useEffect } from "react";
import { useGenerateDueRequestsMutation } from "@/hooks/useMaintenanceSchedules";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const GenerateAutoRequestModal = ({ open, onClose }: IProps) => {
    const { mutate: generateAuto, isPending, isSuccess } =
        useGenerateDueRequestsMutation();

    // Tự đóng modal khi API thành công
    useEffect(() => {
        if (isSuccess) onClose();
    }, [isSuccess, onClose]);

    const handleOk = () => {
        generateAuto();
    };

    return (
        <Modal
            open={open}
            title="Xác nhận sinh phiếu bảo trì tự động"
            onCancel={onClose}
            onOk={handleOk}
            confirmLoading={isPending}
            okText="Xác nhận"
            cancelText="Hủy"
        >
            <Typography.Paragraph>
                Hệ thống sẽ quét tất cả các lịch bảo trì đến hạn và tự động
                tạo phiếu bảo trì tương ứng.
            </Typography.Paragraph>

            <Typography.Paragraph>
                Bạn có chắc chắn muốn thực hiện hành động này không?
            </Typography.Paragraph>
        </Modal>
    );
};

export default GenerateAutoRequestModal;
