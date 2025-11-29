// src/pages/technician/TechnicianAssignmentPage.tsx
import { useState } from "react";
import {
    Card,
    Space,
    Tag,
    Button,
    Image,
    Typography,
    Popconfirm,
    Empty,
    Divider,
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import {
    useTechnicianAssignmentsQuery,
    useAcceptTechnicianAssignmentMutation,
} from "@/hooks/maintenance/useTechnicianAssignments";
import ModalRejectAssignment from "./modal.technician.assignment";
import ViewTechnicianAssignment from "./view.technician.assignment";
import queryString from "query-string";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import Breadcrumb from "@/components/navigation/Breadcrumb";

dayjs.locale("vi");
const { Text, Title } = Typography;

const TechnicianAssignmentPage = () => {
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | number | null>(null);
    const [openViewModal, setOpenViewModal] = useState(false);

    const [query] = useState<string>(() =>
        queryString.stringify({
            page: 1,
            size: 20,
            sort: "assignedAt,desc",
        })
    );

    const { data, isFetching } = useTechnicianAssignmentsQuery(query);
    const { mutate: acceptAssignment, isPending: isAccepting } =
        useAcceptTechnicianAssignmentMutation();

    const assignments = data?.result || [];
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    return (
        <div className="px-4 py-5 pb-24 bg-gradient-to-b from-pink-50 to-white min-h-screen sm:px-6 lg:px-8">
            <Breadcrumb />

            {/* Header */}
            <div className="mb-6">
                <Title level={4} className="m-0 text-lg sm:text-xl font-bold text-gray-800">
                    Danh sách công việc được phân công
                </Title>
                <Text type="secondary" className="text-xs sm:text-sm">
                    Tổng: <strong>{assignments.length}</strong> công việc
                </Text>
            </div>

            {/* Loading */}
            {isFetching && (
                <div className="text-center py-8">
                    <Text type="secondary">Đang tải dữ liệu...</Text>
                </div>
            )}

            {/* Empty */}
            {!isFetching && assignments.length === 0 && (
                <Empty
                    description="Không có công việc nào được phân công"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="py-12"
                />
            )}

            {/* List */}
            <Space direction="vertical" size={20} className="w-full">
                {assignments.map((item) => {
                    const { requestInfo } = item;
                    const device = requestInfo.device || {};
                    const attachmentImages = [
                        requestInfo.attachment1,
                        requestInfo.attachment2,
                        requestInfo.attachment3,
                    ].filter(Boolean);
                    const deviceImages = [
                        device.image1,
                        device.image2,
                        device.image3,
                    ].filter(Boolean);

                    return (
                        <Card
                            key={item.id}
                            className="shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                            bodyStyle={{ padding: 0 }}
                        >
                            <div className="p-4 sm:p-5">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                    {/* Cột 1: Ảnh */}
                                    <div className="space-y-4">
                                        {/* Ảnh phiếu bảo trì */}
                                        <div>
                                            <Text strong className="block text-xs text-gray-600 mb-2">
                                                Ảnh phiếu bảo trì
                                            </Text>
                                            {attachmentImages.length > 0 ? (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {attachmentImages.map((img, idx) => (
                                                        <Image
                                                            key={idx}
                                                            width="100%"
                                                            className="rounded-lg object-cover aspect-square border border-gray-200"
                                                            src={`${backendURL}/storage/maintenance_request/${img}`}
                                                            alt={`phiếu-${idx + 1}`}
                                                            preview
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <Text type="secondary" className="text-xs">
                                                    Không có ảnh
                                                </Text>
                                            )}
                                        </div>

                                        {/* Ảnh thiết bị */}
                                        <div>
                                            <Text strong className="block text-xs text-gray-600 mb-2">
                                                Ảnh thiết bị
                                            </Text>
                                            {deviceImages.length > 0 ? (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {deviceImages.map((img, idx) => (
                                                        <Image
                                                            key={idx}
                                                            width="100%"
                                                            className="rounded-lg object-cover aspect-square border border-gray-200"
                                                            src={`${backendURL}/storage/DEVICE/${img}`}
                                                            alt={`thiết bị-${idx + 1}`}
                                                            preview
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <Text type="secondary" className="text-xs">
                                                    Không có ảnh
                                                </Text>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cột 2: Thông tin */}
                                    <div className="lg:col-span-2 space-y-3">
                                        {/* Tags */}
                                        <Space wrap size={4}>
                                            <Tag color="blue" className="text-xs rounded-md">
                                                {requestInfo.requestCode}
                                            </Tag>
                                            <Tag color="orange" className="text-xs rounded-md">
                                                {requestInfo.maintenanceType}
                                            </Tag>
                                            <Tag color="gold" className="text-xs rounded-md">
                                                {requestInfo.priorityLevel}
                                            </Tag>
                                            <Tag color="geekblue" className="text-xs rounded-md">
                                                {requestInfo.status}
                                            </Tag>
                                        </Space>

                                        {/* Tên sự cố */}
                                        <Title level={5} className="m-0 text-base font-semibold text-gray-800">
                                            {requestInfo.issueName || "Chưa có tên sự cố"}
                                        </Title>

                                        {/* Thông tin nhanh */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                            <div>
                                                <Text type="secondary">Người tạo:</Text>{" "}
                                                <span className="font-medium">{requestInfo.fullName}</span>
                                            </div>
                                            <div>
                                                <Text type="secondary">Vị trí:</Text>{" "}
                                                <span className="font-medium">{requestInfo.locationDetail || "-"}</span>
                                            </div>
                                            <div>
                                                <Text type="secondary">Ngày tạo:</Text>{" "}
                                                <span className="font-medium">
                                                    {dayjs(requestInfo.createdAt).format("DD/MM HH:mm")}
                                                </span>
                                            </div>
                                            <div>
                                                <Text type="secondary">Phân công bởi:</Text>{" "}
                                                <span className="font-medium">{item.assignedBy || "-"}</span>
                                            </div>
                                            <div>
                                                <Text type="secondary">Thời gian phân công:</Text>{" "}
                                                <span className="font-medium">
                                                    {dayjs(item.assignedAt).format("DD/MM HH:mm")}
                                                </span>
                                            </div>
                                            <div>
                                                <Text type="secondary">Ghi chú:</Text>{" "}
                                                <span className="font-medium">{requestInfo.note || "-"}</span>
                                            </div>
                                        </div>

                                        <Divider className="my-3" />

                                        {/* Thiết bị */}
                                        <div>
                                            <Text strong className="block text-xs text-gray-600 mb-1">
                                                Thông tin thiết bị
                                            </Text>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                                <div>
                                                    <Text type="secondary">Mã:</Text>{" "}
                                                    <b>{device.deviceCode}</b>
                                                </div>
                                                <div>
                                                    <Text type="secondary">Tên:</Text>{" "}
                                                    <b>{device.deviceName}</b>
                                                </div>
                                                <div>
                                                    <Text type="secondary">Công ty:</Text>{" "}
                                                    {device.companyName || "-"}
                                                </div>
                                                <div>
                                                    <Text type="secondary">Bộ phận:</Text>{" "}
                                                    {device.departmentName || "-"}
                                                </div>
                                                <div>
                                                    <Text type="secondary">Sở hữu:</Text>{" "}
                                                    {device.ownershipType === "CUSTOMER" ? (
                                                        <Tag color="magenta" className="text-xs">Khách hàng</Tag>
                                                    ) : (
                                                        <Tag color="green" className="text-xs">Nội bộ</Tag>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Divider className="my-3" />

                                        {/* Hành động */}
                                        <Space wrap>
                                            <Popconfirm
                                                title="Xác nhận nhận việc"
                                                description="Bạn có chắc chắn muốn nhận công việc này?"
                                                okText="Đồng ý"
                                                cancelText="Hủy"
                                                onConfirm={() => item.id && acceptAssignment(item.id)}
                                            >
                                                <Button
                                                    type="primary"
                                                    icon={<CheckOutlined />}
                                                    size="small"
                                                    className="bg-blue-500 border-blue-500 rounded-full text-xs shadow-sm"
                                                    loading={isAccepting}
                                                >
                                                    Nhận việc
                                                </Button>
                                            </Popconfirm>

                                            <Button
                                                danger
                                                icon={<CloseOutlined />}
                                                size="small"
                                                className="rounded-full text-xs shadow-sm"
                                                onClick={() => {
                                                    setSelectedAssignmentId(item.id!);
                                                    setOpenRejectModal(true);
                                                }}
                                            >
                                                Từ chối
                                            </Button>

                                            <Button
                                                icon={<EyeOutlined />}
                                                size="small"
                                                className="rounded-full text-xs shadow-sm"
                                                onClick={() => {
                                                    setSelectedAssignmentId(item.id!);
                                                    setOpenViewModal(true);
                                                }}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Space>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </Space>

            {/* Modal Từ chối */}
            <ModalRejectAssignment
                openModal={openRejectModal}
                setOpenModal={setOpenRejectModal}
                assignmentId={selectedAssignmentId}
            />

            {/* Modal Xem chi tiết */}
            <ViewTechnicianAssignment
                open={openViewModal}
                onClose={setOpenViewModal}
                assignmentId={selectedAssignmentId}
            />
        </div>
    );
};

export default TechnicianAssignmentPage;
