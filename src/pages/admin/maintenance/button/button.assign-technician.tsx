import React, { useState } from "react";
import {
    Modal,
    Table,
    Button,
    Tag,
    Spin,
    Space,
    Typography,
    Popconfirm,
    Divider,
} from "antd";
import {
    CheckCircleOutlined,
    CalendarOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useAssignTechnicianManualMutation } from "@/hooks/maintenance/useMaintenanceRequests";
import { useTechniciansQuery } from "@/hooks/user/useTechnicians";
import ScheduleDrawer from "./schedule-drawer";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

const { Text, Title } = Typography;

interface ButtonAssignTechnicianProps {
    requestId: string;
}

/* ========================= Component chính ========================= */
const ButtonAssignTechnician = ({ requestId }: ButtonAssignTechnicianProps) => {
    const [open, setOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState<any>(null);

    const assignMutation = useAssignTechnicianManualMutation();
    const { data: techData, isLoading: loadingTechs } = useTechniciansQuery(
        "page=1&pageSize=20"
    );

    /** ========================= Phân công kỹ thuật viên ========================= */
    const handleAssign = async (tech: any) => {
        try {
            await assignMutation.mutateAsync({
                requestId,
                technicianId: tech.id,
            });
            setOpen(false);
        } catch {
            // Lỗi đã được notify.handle trong mutation
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
            render: (text: string) => (
                <Space>
                    <UserOutlined />
                    <Text strong>{text}</Text>
                </Space>
            ),
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
                <Tag color={type === "INTERNAL" ? "blue" : "purple"}>
                    {type === "INTERNAL" ? "Nội bộ" : "Bên ngoài"}
                </Tag>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email: string) => (
                <Text copyable type="secondary">
                    {email || "—"}
                </Text>
            ),
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            render: (phone: string) => <Text>{phone || "—"}</Text>,
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
                                style={{
                                    borderRadius: 6,
                                    fontSize: 13,
                                    padding: "2px 6px",
                                }}
                            >
                                {s.techniqueName}
                            </Tag>
                        ))}
                    </Space>
                ) : (
                    <Text type="secondary">Không có</Text>
                ),
        },
        {
            title: "Hành động",
            key: "actions",
            fixed: "right" as const,
            render: (_: any, record: any) => (
                <Space wrap>
                    <Button
                        type="link"
                        icon={<CalendarOutlined />}
                        onClick={() => handleViewSchedule(record)}
                    >
                        Xem lịch
                    </Button>

                    <Popconfirm
                        title="Xác nhận phân công"
                        description={
                            <div style={{ maxWidth: 250 }}>
                                Bạn có chắc muốn phân công kỹ thuật viên{" "}
                                <b>{record.fullName}</b> (Mã:{" "}
                                {record.technicianCode}) cho yêu cầu này?
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

    /** ========================= Giao diện chính ========================= */
    return (
        <>
            <Access
                permission={
                    ALL_PERMISSIONS.MAINTENANCE_REQUESTS.ASSIGN_TECHNICIAN
                }
                hideChildren
            >
                <Button
                    type="primary"
                    size="middle"
                    style={{
                        borderRadius: 6,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                    onClick={() => setOpen(true)}
                    loading={assignMutation.isPending}
                    icon={<CheckCircleOutlined />}
                >
                    Phân công
                </Button>
            </Access>

            <Modal
                open={open}
                title={
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: 8,
                        }}
                    >
                        <Title level={4} style={{ margin: 0 }}>
                            Phân công kỹ thuật viên
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Chọn kỹ thuật viên phù hợp để thực hiện yêu cầu
                        </Text>
                    </div>
                }
                onCancel={() => setOpen(false)}
                footer={null}
                width="100%"
                style={{
                    top: "5vh",
                    padding: 0,
                    maxWidth: 1200,
                }}
                bodyStyle={{
                    padding: "16px 20px 24px",
                    borderRadius: 12,
                    background: "#fff",
                }}
                destroyOnClose
                centered
            >
                {loadingTechs ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                        <Spin size="large" />
                    </div>
                ) : techData?.result?.length ? (
                    <>
                        <Table
                            rowKey="id"
                            dataSource={techData.result}
                            columns={columns}
                            pagination={{
                                pageSize: 6,
                                position: ["bottomCenter"],
                                showSizeChanger: false,
                            }}
                            scroll={{ x: "max-content" }}
                        />
                    </>
                ) : (
                    <p
                        style={{
                            textAlign: "center",
                            color: "#888",
                            marginTop: 20,
                        }}
                    >
                        Không có kỹ thuật viên nào phù hợp
                    </p>
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
