import { useState } from "react";
import { Table, Button, Tag, Space, Spin } from "antd";
import { useMaintenanceApprovalsQuery } from "@/hooks/useMaintenanceApprovals";
import ModalMaintenanceApproval from "./modal.maintenance-approval";
import type { IResMaintenancePlanSimpleDTO } from "@/types/backend";

export default function ViewMaintenanceApproval() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{
        planId: string;
        requestCode: string;
    } | null>(null);

    const { data, isLoading } = useMaintenanceApprovalsQuery("page=1&pageSize=20");

    const handleOpenModal = (plan: IResMaintenancePlanSimpleDTO) => {
        setSelectedPlan({ planId: plan.planId, requestCode: plan.requestCode });
        setOpenModal(true);
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
                Danh sách kế hoạch chờ phê duyệt
            </h2>

            {isLoading ? (
                <div className="flex justify-center items-center h-60">
                    <Spin />
                </div>
            ) : (
                <Table
                    rowKey="planId"
                    dataSource={data?.result || []}
                    pagination={{
                        pageSize: data?.meta?.pageSize || 20,
                        total: data?.meta?.total || 0,
                        current: data?.meta?.page || 1,
                    }}
                >
                    <Table.Column
                        title="Mã phiếu"
                        dataIndex="requestCode"
                        key="requestCode"
                    />
                    <Table.Column title="Thiết bị" dataIndex="deviceName" key="deviceName" />
                    <Table.Column
                        title="Giải pháp"
                        dataIndex="solutionName"
                        key="solutionName"
                    />
                    <Table.Column
                        title="Mức độ ưu tiên"
                        dataIndex="priorityLevel"
                        key="priorityLevel"
                        render={(level: string) => <Tag color="blue">{level}</Tag>}
                    />
                    <Table.Column
                        title="Trạng thái"
                        dataIndex="status"
                        key="status"
                        render={(status: string) => (
                            <Tag color="green">{status.replaceAll("_", " ")}</Tag>
                        )}
                    />
                    <Table.Column
                        title="Ngày tạo"
                        dataIndex="createdAt"
                        key="createdAt"
                        render={(v: string) =>
                            v ? new Date(v).toLocaleDateString() : "—"
                        }
                    />
                    <Table.Column
                        title="Thao tác"
                        key="action"
                        render={(_: any, record: IResMaintenancePlanSimpleDTO) => (
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => handleOpenModal(record)}
                                >
                                    Phê duyệt
                                </Button>
                            </Space>
                        )}
                    />
                </Table>
            )}

            {selectedPlan && (
                <ModalMaintenanceApproval
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    planId={selectedPlan.planId}
                    requestCode={selectedPlan.requestCode}
                />
            )}
        </div>
    );
}
