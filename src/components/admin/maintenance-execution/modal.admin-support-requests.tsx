import { Modal, Table, Tag, Button, Space, Typography, Popconfirm, message, Spin } from "antd";
import dayjs from "dayjs";
import {
    useApproveSupportRequestMutation,
    useSupportRequestsQuery,
} from "@/hooks/maintenance/useMaintenanceExecutions";
import type { IResSupportRequestDTO } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

const { Title } = Typography;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId: string;
}

const ModalAdminSupportRequests = ({ open, onClose, requestId }: IProps) => {
    const { data, isFetching, refetch } = useSupportRequestsQuery(requestId);
    const { mutate: approveSupport, isPending } = useApproveSupportRequestMutation();

    const list: IResSupportRequestDTO[] = data?.result || [];

    /** ==================== PHÊ DUYỆT ==================== */
    const handleApprove = (supportId: string, approve: boolean) => {
        approveSupport(
            { supportId, data: { approve } },
            {
                onSuccess: () => {
                    message.success(
                        approve
                            ? "Đã phê duyệt yêu cầu hỗ trợ"
                            : "Đã từ chối yêu cầu hỗ trợ"
                    );
                    refetch();
                },
                onError: (err: any) => {
                    message.error(err?.message || "Không thể xử lý yêu cầu");
                },
            }
        );
    };

    /** ==================== CỘT BẢNG ==================== */
    const columns = [
        {
            title: "Người gửi yêu cầu",
            dataIndex: "requesterName",
            key: "requesterName",
        },
        {
            title: "Người được mời hỗ trợ",
            dataIndex: "supporterName",
            key: "supporterName",
        },
        {
            title: "Lý do hỗ trợ",
            dataIndex: "reason",
            key: "reason",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const colors: Record<string, string> = {
                    PENDING: "gold",
                    APPROVED: "green",
                    REJECTED: "red",
                };
                const labels: Record<string, string> = {
                    PENDING: "Chờ duyệt",
                    APPROVED: "Đã duyệt",
                    REJECTED: "Từ chối",
                };
                return <Tag color={colors[status]}>{labels[status]}</Tag>;
            },
        },
        {
            title: "Thời gian gửi",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_: any, record: IResSupportRequestDTO) =>
                record.status === "PENDING" ? (
                    <Access
                        permission={
                            ALL_PERMISSIONS
                                .MAINTENANCE_EXECUTION_ADMIN
                                .APPROVE_SUPPORT_REQUEST
                        }
                        hideChildren
                    >
                        <Space>

                            <Popconfirm
                                title="Phê duyệt yêu cầu hỗ trợ?"
                                okText="Duyệt"
                                cancelText="Hủy"
                                onConfirm={() => handleApprove(record.id, true)}
                            >
                                <Button type="primary" size="small" loading={isPending}>
                                    Duyệt
                                </Button>
                            </Popconfirm>

                            <Popconfirm
                                title="Từ chối yêu cầu hỗ trợ?"
                                okText="Từ chối"
                                cancelText="Hủy"
                                onConfirm={() => handleApprove(record.id, false)}
                            >
                                <Button danger size="small" loading={isPending}>
                                    Từ chối
                                </Button>
                            </Popconfirm>
                        </Space>
                    </Access>

                ) : null,
        },
    ];

    /** ==================== RENDER ==================== */
    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={800}
            title={<Title level={4}>Yêu cầu hỗ trợ của phiếu</Title>}
        >
            {isFetching ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Spin tip="Đang tải dữ liệu..." />
                </div>
            ) : (
                <Table
                    rowKey="id"
                    dataSource={list}
                    columns={columns}
                    pagination={false}
                    bordered
                    size="middle"
                    locale={{
                        emptyText: "Không có yêu cầu hỗ trợ nào cho phiếu này",
                    }}
                />
            )}
        </Modal>
    );
};

export default ModalAdminSupportRequests;
