import React, { useState } from "react";
import { Modal, Table, Button, Tag, Spin, Space, Typography, Popconfirm } from "antd";
import { CheckCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { useAssignTechnicianManualMutation } from "@/hooks/useMaintenanceRequests";
import { useTechniciansQuery } from "@/hooks/useTechnicians";
import ScheduleDrawer from "@/components/admin/maintenance/button/schedule-drawer";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

const { Text } = Typography;

interface ButtonAssignTechnicianProps {
    requestId: string;
}

/* ========================= Component chính ========================= */
const ButtonAssignTechnician = ({ requestId }: ButtonAssignTechnicianProps) => {
    const [open, setOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState<any>(null);

    const assignMutation = useAssignTechnicianManualMutation();
    const { data: techData, isLoading: loadingTechs } = useTechniciansQuery("page=1&pageSize=20");

    /** ========================= Phân công kỹ thuật viên ========================= */
    const handleAssign = async (tech: any) => {
        try {
            await assignMutation.mutateAsync({ requestId, technicianId: tech.id });
            setOpen(false);
        } catch {
            // lỗi đã được notify.handle trong mutation
        }
    };

    /** ========================= Mở Drawer xem lịch ========================= */
    const handleViewSchedule = (tech: any) => {
        setSelectedTechnician(tech);
        setDrawerOpen(true);
    };

    /** ========================= Cột bảng kỹ thuật viên ========================= */
    const columns = [
        {
            title: "Họ tên",
            dataIndex: "fullName",
            key: "fullName",
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: "Mã KTV",
            dataIndex: "technicianCode",
            key: "technicianCode",
            render: (code: string) => <Text type="secondary">{code}</Text>,
        },
        {
            title: "Loại KTV",
            dataIndex: "technicianType",
            key: "technicianType",
            render: (type: string) => (
                <Tag color={type === "INTERNAL" ? "blue" : "purple"}>{type}</Tag>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Kỹ năng",
            key: "skills",
            render: (_: any, record: any) =>
                record.skills?.length ? (
                    <Space size={[0, 8]} wrap>
                        {record.skills.map((s: any, index: number) => (
                            <Tag
                                key={index}
                                color={
                                    index % 3 === 0
                                        ? "green"
                                        : index % 3 === 1
                                            ? "geekblue"
                                            : "volcano"
                                }
                                className="px-2 py-1 text-sm font-medium"
                            >
                                {s.techniqueName}
                            </Tag>
                        ))}
                    </Space>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="link"
                        icon={<CalendarOutlined />}
                        onClick={() => handleViewSchedule(record)}
                    >
                        Xem lịch
                    </Button>

                    <Popconfirm
                        title={
                            <div className="font-semibold text-base">
                                Phân công kỹ thuật viên
                            </div>
                        }
                        description={
                            <div className="text-gray-700">
                                Bạn có chắc muốn phân công kỹ thuật viên{" "}
                                <strong>{record.fullName}</strong>{" "}
                                (Mã: {record.technicianCode})<br />
                                cho yêu cầu này?
                            </div>
                        }
                        okText="Xác nhận"
                        cancelText="Hủy"
                        onConfirm={() => handleAssign(record)}
                    >
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            loading={assignMutation.isPending}
                        >
                            Chọn
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>

            <Access permission={ALL_PERMISSIONS.MAINTENANCE_REQUESTS.ASSIGN_TECHNICIAN} hideChildren>
                <Button
                    onClick={() => setOpen(true)}
                    disabled={assignMutation.isPending}
                    loading={assignMutation.isPending}
                >
                    Phân công
                </Button>
            </Access>
            <Modal
                open={open}
                title="Phân công kỹ thuật viên"
                onCancel={() => setOpen(false)}
                footer={null}
                width={1200} // modal to hơn
                bodyStyle={{ padding: "24px 28px" }}
            >
                {loadingTechs ? (
                    <div className="flex justify-center py-8">
                        <Spin />
                    </div>
                ) : techData?.result?.length ? (
                    <Table
                        rowKey="id"
                        dataSource={techData.result}
                        columns={columns}
                        pagination={{ pageSize: 6 }}
                    />
                ) : (
                    <p className="text-gray-600 text-center">Không có kỹ thuật viên nào</p>
                )}
            </Modal>

            {selectedTechnician && (
                <ScheduleDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    technician={selectedTechnician}
                />
            )}
        </>
    );
};

export default ButtonAssignTechnician;
