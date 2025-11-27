import { useState } from "react";
import { Button, Modal, Typography } from "antd";
import CreateMaintenanceRequestClientPage from "./maintenance-request/create-request-client";
import {
    ToolOutlined,
    SafetyOutlined,
    ClockCircleOutlined,
    FileProtectOutlined,
    RocketOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { usePermission } from "@/hooks/usePermission";

const { Title, Paragraph } = Typography;

const HomeClientPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { hasPermission } = usePermission();
    const canCreateMaintenance = hasPermission(
        "UI_MODULE",
        "VIEW",
        "/ui/client/maintenance/create-request"
    );

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const features = [
        {
            icon: <ClockCircleOutlined className="text-3xl md:text-4xl text-blue-500" />,
            title: "Phản hồi nhanh chóng",
            description: "Xử lý yêu cầu bảo trì trong vòng 24 giờ, đảm bảo thiết bị hoạt động liên tục"
        },
        {
            icon: <SafetyOutlined className="text-3xl md:text-4xl text-green-500" />,
            title: "Bảo dưỡng định kỳ",
            description: "Lập lịch bảo dưỡng chủ động, kéo dài tuổi thọ thiết bị và giảm chi phí sửa chữa"
        },
        {
            icon: <FileProtectOutlined className="text-3xl md:text-4xl text-purple-500" />,
            title: "Quản lý hiệu quả",
            description: "Theo dõi lịch sử bảo trì, tình trạng thiết bị và tối ưu hóa quy trình quản lý"
        },
        {
            icon: <TeamOutlined className="text-3xl md:text-4xl text-orange-500" />,
            title: "Đội ngũ chuyên nghiệp",
            description: "Kỹ thuật viên giàu kinh nghiệm, được đào tạo bài bản về các loại thiết bị"
        },
        {
            icon: <ThunderboltOutlined className="text-3xl md:text-4xl text-red-500" />,
            title: "Khẩn cấp 24/7",
            description: "Hỗ trợ sửa chữa khẩn cấp mọi lúc, đảm bảo hoạt động sản xuất không bị gián đoạn"
        },
        {
            icon: <SettingOutlined className="text-3xl md:text-4xl text-cyan-500" />,
            title: "Công cụ hiện đại",
            description: "Trang bị thiết bị kiểm tra và sửa chữa tiên tiến, đáp ứng mọi yêu cầu kỹ thuật"
        }
    ];

    const steps = [
        {
            number: "01",
            title: "Tạo phiếu yêu cầu",
            description: "Điền thông tin thiết bị và mô tả sự cố"
        },
        {
            number: "02",
            title: "Xác nhận yêu cầu",
            description: "Chúng tôi sẽ xem xét và phản hồi sớm nhất"
        },
        {
            number: "03",
            title: "Kỹ thuật viên đến",
            description: "Đội ngũ chuyên nghiệp thực hiện bảo trì"
        },
        {
            number: "04",
            title: "Hoàn thành",
            description: "Thiết bị hoạt động trở lại bình thường"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
                    <div className="text-center">
                        {/* Icon */}
                        <div className="flex justify-center mb-4 sm:mb-6">
                            <div className="bg-blue-100 rounded-full p-3 sm:p-4">
                                <ToolOutlined className="text-3xl sm:text-4xl md:text-5xl text-blue-600" />
                            </div>
                        </div>

                        {/* Title */}
                        <Title
                            level={1}
                            className="!text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl !font-bold !mb-4 sm:!mb-6 !text-gray-800"
                            style={{ marginBottom: '1rem' }}
                        >
                            Phần Mềm Quản Lý Bảo Trì<br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Thiết Bị & Công Cụ Dụng Cụ
                            </span>
                        </Title>

                        {/* Description */}
                        <Paragraph className="!text-base sm:!text-lg !text-gray-600 max-w-2xl mx-auto !mb-6 sm:!mb-8 px-4">
                            Chào mừng bạn đến với hệ thống quản lý bảo trì công cụ dụng cụ.
                            Chúng tôi cung cấp dịch vụ bảo trì chuyên nghiệp,
                            nhanh chóng và đáng tin cậy cho mọi thiết bị của bạn.
                        </Paragraph>

                        {/* CTA Button */}
                        {canCreateMaintenance && (
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleOpenModal}
                                icon={<RocketOutlined />}
                                className="!h-10 sm:!h-12 !px-6 sm:!px-8 !text-base sm:!text-lg !font-semibold bg-gradient-to-r from-blue-600 to-purple-600 !border-none hover:from-blue-700 hover:to-purple-700 !shadow-lg hover:!shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <span className="hidden sm:inline">Tạo Phiếu Bảo Trì Ngay</span>
                                <span className="sm:hidden">Tạo Phiếu</span>
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center mb-8 sm:mb-12">
                    <Title level={2} className="!text-2xl sm:!text-3xl !font-bold !mb-3 sm:!mb-4 !text-gray-800">
                        Tại Sao Chọn Chúng Tôi?
                    </Title>
                    <Paragraph className="!text-gray-600 !text-base sm:!text-lg px-4">
                        Cam kết mang đến trải nghiệm dịch vụ tốt nhất
                    </Paragraph>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex justify-center mb-4 sm:mb-6">
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full p-3 sm:p-4">
                                    {feature.icon}
                                </div>
                            </div>
                            <Title level={4} className="!text-center !mb-2 sm:!mb-3 !text-gray-800 !text-base sm:!text-lg">
                                {feature.title}
                            </Title>
                            <Paragraph className="!text-center !text-gray-600 !text-sm sm:!text-base !mb-0">
                                {feature.description}
                            </Paragraph>
                        </div>
                    ))}
                </div>
            </section>

            {/* Process Steps Section */}
            <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <Title level={2} className="!text-2xl sm:!text-3xl !font-bold !mb-3 sm:!mb-4 !text-gray-800">
                            Quy Trình Bảo Trì
                        </Title>
                        <Paragraph className="!text-gray-600 !text-base sm:!text-lg px-4">
                            Đơn giản, nhanh chóng và hiệu quả
                        </Paragraph>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                                    <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full text-xl sm:text-2xl font-bold mb-3 sm:mb-4 mx-auto shadow-lg">
                                        {step.number}
                                    </div>
                                    <Title level={5} className="!text-center !mb-2 sm:!mb-3 !text-gray-800 !text-sm sm:!text-base">
                                        {step.title}
                                    </Title>
                                    <Paragraph className="!text-center !text-gray-600 !text-xs sm:!text-sm !mb-0">
                                        {step.description}
                                    </Paragraph>
                                </div>

                                {/* Connector Line - Only visible on desktop */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-7 sm:top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 -translate-y-1/2 z-0"
                                        style={{ width: 'calc(100% - 3rem)', left: 'calc(50% + 2rem)' }}>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            <Modal
                title={
                    <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Tạo Phiếu Bảo Trì
                    </div>
                }
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width="90%"
                style={{ maxWidth: '700px' }}
                destroyOnClose
                centered
                className="custom-modal"
            >
                <CreateMaintenanceRequestClientPage onSuccess={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default HomeClientPage;