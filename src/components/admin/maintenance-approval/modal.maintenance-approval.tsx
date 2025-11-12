import { useState } from "react";
import {
    useApprovePlanMutation,
    useRejectPlanMutation,
    useMaintenancePlanDetailQuery,
} from "@/hooks/useMaintenanceApprovals";
import type { IReqRejectPlanDTO } from "@/types/backend";
import { Modal, Button, Input, Select, Spin } from "antd";
import { notify } from "@/components/common/notify";

interface Props {
    open: boolean;
    onClose: () => void;
    planId: string;
    requestCode: string;
}

export default function ModalMaintenanceApproval({
    open,
    onClose,
    planId,
    requestCode,
}: Props) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectData, setRejectData] = useState<IReqRejectPlanDTO>({
        rejectReasonId: 0,
        note: "",
    });

    const approveMutation = useApprovePlanMutation();
    const rejectMutation = useRejectPlanMutation();

    const { data: detailData, isLoading } = useMaintenancePlanDetailQuery(planId);

    const handleApprove = async () => {
        try {
            await approveMutation.mutateAsync(planId);
            notify.success("Kế hoạch đã được duyệt thành công");
            onClose();
        } catch (err: any) {
            notify.error(err.message || "Không thể duyệt kế hoạch");
        }
    };

    const handleReject = async () => {
        if (!rejectData.rejectReasonId)
            return notify.warning("Vui lòng chọn lý do từ chối");

        try {
            await rejectMutation.mutateAsync({ planId, data: rejectData });
            notify.warning("Đã từ chối kế hoạch bảo trì");
            setShowRejectModal(false);
            onClose();
        } catch (err: any) {
            notify.error(err.message || "Không thể từ chối kế hoạch");
        }
    };

    return (
        <>
            <Modal
                title={`Phê duyệt kế hoạch - ${requestCode}`}
                open={open}
                onCancel={onClose}
                footer={null}
                width={700}
            >
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spin />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Thông tin kế hoạch</h3>

                        <p>
                            <b>Giải pháp:</b> {detailData?.planInfo.solutionName || "—"}
                        </p>
                        <p>
                            <b>Ghi chú:</b> {detailData?.planInfo.note || "Không có"}
                        </p>
                        <p>
                            <b>Người lập:</b> {detailData?.planInfo.createdBy || "—"}
                        </p>
                        <p>
                            <b>Ngày lập:</b>{" "}
                            {detailData?.planInfo.createdAt
                                ? new Date(detailData.planInfo.createdAt).toLocaleDateString()
                                : "—"}
                        </p>

                        <div className="flex flex-col gap-2 mt-6">
                            <Button
                                type="primary"
                                style={{ backgroundColor: "#00C853" }}
                                onClick={() =>
                                    window.open(
                                        `/maintenance-approvals/${planId}/materials`,
                                        "_blank"
                                    )
                                }
                            >
                                Danh sách vật tư
                            </Button>

                            <Button
                                type="default"
                                style={{ backgroundColor: "#0091EA", color: "white" }}
                                onClick={() =>
                                    window.open(
                                        `/maintenance-approvals/${planId}/detail`,
                                        "_blank"
                                    )
                                }
                            >
                                Xem chi tiết
                            </Button>

                            <Button type="primary" onClick={handleApprove}>
                                Duyệt
                            </Button>

                            <Button danger onClick={() => setShowRejectModal(true)}>
                                Không duyệt
                            </Button>

                            <div className="text-sm text-gray-500 mt-4">
                                <p>
                                    Ngày tạo:{" "}
                                    {detailData?.requestInfo?.createdAt
                                        ? new Date(
                                            detailData.requestInfo.createdAt
                                        ).toLocaleDateString()
                                        : "—"}
                                </p>
                                <p>
                                    Ngày lập kế hoạch:{" "}
                                    {detailData?.planInfo?.createdAt
                                        ? new Date(
                                            detailData.planInfo.createdAt
                                        ).toLocaleDateString()
                                        : "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal từ chối */}
            <Modal
                title="Từ chối kế hoạch bảo trì"
                open={showRejectModal}
                onCancel={() => setShowRejectModal(false)}
                onOk={handleReject}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <div className="flex flex-col gap-3">
                    <Select
                        placeholder="Chọn lý do từ chối"
                        onChange={(v) =>
                            setRejectData({ ...rejectData, rejectReasonId: Number(v) })
                        }
                        options={[
                            { label: "Kế hoạch không hợp lý", value: 1 },
                            { label: "Thiếu vật tư", value: 2 },
                            { label: "Không đủ ngân sách", value: 3 },
                        ]}
                    />
                    <Input.TextArea
                        rows={3}
                        placeholder="Ghi chú thêm..."
                        onChange={(e) =>
                            setRejectData({ ...rejectData, note: e.target.value })
                        }
                    />
                </div>
            </Modal>
        </>
    );
}
