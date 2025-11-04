import { useState } from "react";
import { Modal } from "antd";
import { useAutoAssignAllMaintenanceRequestsMutation } from "@/hooks/useMaintenanceRequests";

const ButtonAutoAssign = () => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openResult, setOpenResult] = useState(false);
    const [summary, setSummary] = useState<any>(null);

    const autoAssignMutation = useAutoAssignAllMaintenanceRequestsMutation();

    const handleConfirm = async () => {
        try {
            const res = await autoAssignMutation.mutateAsync();
            setSummary(res);
            setOpenConfirm(false);
            setOpenResult(true);
        } catch (err: unknown) {
            setOpenConfirm(false);
            const errorMessage =
                (err as Error)?.message || "Không thể thực hiện hành động này.";
            Modal.error({
                title: "Lỗi khi phân công kỹ thuật viên tự động",
                content: errorMessage,
            });
        }
    };

    return (
        <>
            <button
                onClick={() => setOpenConfirm(true)}
                disabled={autoAssignMutation.isPending}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition 
                    ${autoAssignMutation.isPending
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 active:bg-gray-200"
                    }`}
            >
                {autoAssignMutation.isPending
                    ? "Đang xử lý..."
                    : "Phân công tự động"}
            </button>

            {/* Modal xác nhận */}
            <Modal
                open={openConfirm}
                title="Phân công kỹ thuật viên tự động"
                okText="Xác nhận"
                cancelText="Huỷ"
                confirmLoading={autoAssignMutation.isPending}
                onCancel={() => setOpenConfirm(false)}
                onOk={handleConfirm}
            >
                Hệ thống sẽ tự động phân công kỹ thuật viên cho tất cả các phiếu đang
                chờ. Bạn có chắc chắn muốn thực hiện không?
            </Modal>

            <Modal
                open={openResult}
                title="Kết quả phân công tự động"
                footer={null}
                onCancel={() => setOpenResult(false)}
            >
                <div className="space-y-1 text-[15px] text-gray-700">
                    <p>
                        <b>Tổng số phiếu:</b> {summary?.totalRequests ?? "-"}
                    </p>
                    <p>
                        <b>Đã phân công tự động:</b> {summary?.autoAssigned ?? "-"}
                    </p>
                    <p>
                        <b>Còn chờ xử lý thủ công:</b> {summary?.pendingForAdmin ?? "-"}
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default ButtonAutoAssign;
