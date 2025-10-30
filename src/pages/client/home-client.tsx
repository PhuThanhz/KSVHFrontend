import { useState } from "react";
import { Button, Modal, Typography } from "antd";
import CreateMaintenanceRequestClientPage from "./maintenance-request/create-request-client";

const { Title, Paragraph } = Typography;

const HomeClientPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto text-center">
                <Title level={2}>Trang chủ khách hàng</Title>
                <Paragraph className="text-gray-600 text-base mb-6">
                    Chào mừng bạn đến với giao diện dành cho khách hàng.
                    Tại đây, bạn có thể gửi yêu cầu bảo trì cho thiết bị của mình.
                </Paragraph>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleOpenModal}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Tạo phiếu bảo trì
                </Button>
            </div>
            <Modal
                title="Tạo Phiếu Bảo Trì Khách Hàng"
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={700}
                destroyOnClose
            >
                <CreateMaintenanceRequestClientPage />
            </Modal>
        </div>
    );
};

export default HomeClientPage;
