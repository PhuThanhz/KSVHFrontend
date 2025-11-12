import { useState } from "react";
import { Card, Descriptions, Spin, Timeline, Tag, Collapse } from "antd";
import { useMaintenancePlanDetailQuery } from "@/hooks/useMaintenanceApprovals";

interface IProps {
    planId: string;
}

export default function ViewMaintenanceApprovalDetail({ planId }: IProps) {
    const { data, isLoading } = useMaintenancePlanDetailQuery(planId);
    const [openRejects, setOpenRejects] = useState(false);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-60">
                <Spin />
            </div>
        );
    }

    if (!data) {
        return <p>Không tìm thấy thông tin kế hoạch bảo trì</p>;
    }

    const { requestInfo, surveyInfo, planInfo, rejectLogs } = data;

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Chi tiết kế hoạch bảo trì</h2>

            {/* ====== Thông tin phiếu bảo trì ====== */}
            <Card title="Thông tin phiếu bảo trì">
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Mã phiếu">{requestInfo.requestCode}</Descriptions.Item>
                    <Descriptions.Item label="Người tạo">{requestInfo.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Vị trí">{requestInfo.locationDetail || "—"}</Descriptions.Item>
                    <Descriptions.Item label="Loại bảo trì">{requestInfo.maintenanceType}</Descriptions.Item>
                    <Descriptions.Item label="Mức độ ưu tiên" span={2}>
                        <Tag color="orange">{requestInfo.priorityLevel}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái" span={2}>
                        <Tag
                            color={
                                requestInfo.status === "DA_PHE_DUYET"
                                    ? "green"
                                    : requestInfo.status === "TU_CHOI_PHE_DUYET"
                                        ? "default"
                                        : "gold"
                            }
                        >
                            {requestInfo.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Thiết bị" span={2}>
                        {requestInfo.device?.deviceName || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã thiết bị">
                        {requestInfo.device?.deviceCode || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Công ty">
                        {requestInfo.device?.companyName || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phòng ban">
                        {requestInfo.device?.departmentName || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo" span={2}>
                        {requestInfo.createdAt
                            ? new Date(requestInfo.createdAt).toLocaleString()
                            : "—"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* ====== Thông tin khảo sát ====== */}
            {surveyInfo && (
                <Card title="Thông tin khảo sát thực tế">
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Sự cố thực tế">
                            {surveyInfo.actualIssueDescription || "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nguyên nhân">
                            {surveyInfo.causeName || "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mức độ hư hỏng">
                            {surveyInfo.damageLevel || "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Hình thức bảo trì">
                            {surveyInfo.maintenanceTypeActual || "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày khảo sát" span={2}>
                            {surveyInfo.surveyDate
                                ? new Date(surveyInfo.surveyDate).toLocaleString()
                                : "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Kỹ thuật viên khảo sát" span={2}>
                            {surveyInfo.technicianName || "—"}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )}

            {/* ====== Thông tin kế hoạch ====== */}
            <Card title="Thông tin kế hoạch bảo trì">
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Mã kế hoạch">{planInfo.planId}</Descriptions.Item>
                    <Descriptions.Item label="Giải pháp">
                        {planInfo.solutionName || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Sử dụng vật tư">
                        {planInfo.useMaterial ? "Có" : "Không"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người lập kế hoạch">
                        {planInfo.createdBy || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày lập kế hoạch" span={2}>
                        {planInfo.createdAt
                            ? new Date(planInfo.createdAt).toLocaleString()
                            : "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ghi chú" span={2}>
                        {planInfo.note || "Không có"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* ====== Lịch sử từ chối kế hoạch ====== */}
            {rejectLogs && rejectLogs.length > 0 && (
                <Card>
                    <Collapse
                        activeKey={openRejects ? ["1"] : []}
                        onChange={() => setOpenRejects(!openRejects)}
                        expandIconPosition="end"
                        items={[
                            {
                                key: "1",
                                label: (
                                    <span className="font-medium text-gray-800">
                                        Lịch sử từ chối kế hoạch ({rejectLogs.length})
                                    </span>
                                ),
                                children: (
                                    <div className="pl-3 pr-1">
                                        <Timeline
                                            mode="left"
                                            style={{ marginLeft: "-10px" }}
                                            items={rejectLogs.map((log, index) => ({
                                                color: "red",
                                                label: (
                                                    <span className="text-xs text-gray-600">
                                                        {log.rejectedAt
                                                            ? new Date(log.rejectedAt).toLocaleString()
                                                            : "—"}
                                                    </span>
                                                ),
                                                children: (
                                                    <div
                                                        className={`text-[13px] leading-6 ${index === 0
                                                                ? "bg-red-50 border border-red-100 rounded-md p-2"
                                                                : ""
                                                            }`}
                                                    >
                                                        <p>
                                                            <strong className="text-gray-700">Lý do:</strong>{" "}
                                                            {log.reasonName || "—"}
                                                        </p>
                                                        <p>
                                                            <strong className="text-gray-700">Ghi chú:</strong>{" "}
                                                            {log.note || "Không có"}
                                                        </p>
                                                        <p>
                                                            <strong className="text-gray-700">Người từ chối:</strong>{" "}
                                                            {log.rejectedBy || "—"}
                                                        </p>
                                                    </div>
                                                ),
                                            }))}
                                        />
                                    </div>
                                ),
                            },
                        ]}
                    />
                </Card>
            )}
        </div>
    );
}
