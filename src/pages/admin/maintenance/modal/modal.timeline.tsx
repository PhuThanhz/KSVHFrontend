import React from "react";
import { Modal, Spin, Empty } from "antd";
import {
    ClockCircleOutlined,
    UserOutlined,
    LoadingOutlined,
    FileTextOutlined
} from "@ant-design/icons";
import { useMaintenanceTimelineQuery } from "@/hooks/maintenance/useMaintenanceRequests";

interface MaintenanceTimelineModalProps {
    open: boolean;
    onClose: () => void;
    requestId: string;
    requestCode?: string;
}

const MaintenanceTimelineModal: React.FC<MaintenanceTimelineModalProps> = ({
    open,
    onClose,
    requestId,
    requestCode,
}) => {
    const { data, isLoading } = useMaintenanceTimelineQuery(requestId);

    const getStatusColor = (status: string) => {
        const statusMap: Record<string, string> = {
            "CHO_PHAN_CONG": "bg-yellow-50 text-yellow-700 border-yellow-200",
            "DANG_PHAN_CONG": "bg-blue-50 text-blue-700 border-blue-200",
            "DA_XAC_NHAN": "bg-cyan-50 text-cyan-700 border-cyan-200",
            "DA_KHAO_SAT": "bg-indigo-50 text-indigo-700 border-indigo-200",
            "DA_LAP_KE_HOACH": "bg-purple-50 text-purple-700 border-purple-200",
            "TU_CHOI_PHE_DUYET": "bg-red-50 text-red-700 border-red-200",
            "DA_PHE_DUYET": "bg-emerald-50 text-emerald-700 border-emerald-200",
            "DANG_BAO_TRI": "bg-orange-50 text-orange-700 border-orange-200",
            "CHO_NGHIEM_THU": "bg-amber-50 text-amber-700 border-amber-200",
            "TU_CHOI_NGHIEM_THU": "bg-rose-50 text-rose-700 border-rose-200",
            "HOAN_THANH": "bg-green-50 text-green-700 border-green-200",
            "HUY": "bg-gray-50 text-gray-700 border-gray-200",
        };
        return statusMap[status] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={
                <div className="flex items-center gap-2 text-lg">
                    <FileTextOutlined className="text-blue-500" />
                    <span className="font-semibold">
                        Nhật ký hoạt động – {requestCode || "Phiếu bảo trì"}
                    </span>
                </div>
            }
            footer={null}
            centered
            width={800}
            styles={{
                body: { maxHeight: "70vh", overflowY: "auto", padding: "24px" }
            }}
        >
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin
                        size="large"
                        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                    />
                </div>
            ) : (
                <div className="space-y-0">
                    {data?.timeline?.map((item, index) => (
                        <div
                            key={index}
                            className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-none last:pb-0"
                        >
                            {/* Timeline dot with glow effect */}
                            <div className="absolute -left-[9px] top-[4px] w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />

                            {/* Content card */}
                            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200">
                                {/* Header with title and time */}
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h4 className="font-semibold text-gray-900 text-base flex-1">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap">
                                        <ClockCircleOutlined />
                                        <span>
                                            {new Date(item.createdAt).toLocaleString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 text-sm leading-relaxed mb-3 bg-gray-50 rounded px-3 py-2">
                                    {item.description}
                                </p>

                                {/* Footer with actor and status */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <UserOutlined className="text-gray-400" />
                                        <span className="font-medium text-blue-600">
                                            {item.actor}
                                        </span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!data?.timeline?.length && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span className="text-gray-500 text-base">
                                        Không có nhật ký hoạt động
                                    </span>
                                }
                            />
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default MaintenanceTimelineModal;