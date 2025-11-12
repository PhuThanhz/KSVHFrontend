import { useParams } from "react-router-dom";
import { useMaintenancePlanDetailQuery } from "@/hooks/useMaintenanceApprovals";
import { Card, Descriptions, Spin } from "antd";

export default function ViewMaintenanceApprovalDetail() {
    const { planId } = useParams();
    const { data, isLoading } = useMaintenancePlanDetailQuery(planId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-60">
                <Spin />
            </div>
        );
    }

    if (!data) return <p>Không tìm thấy thông tin kế hoạch</p>;

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Chi tiết kế hoạch bảo trì</h2>

            <Card title="Thông tin phiếu bảo trì">
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Mã phiếu">{data.requestInfo.requestCode}</Descriptions.Item>
                    <Descriptions.Item label="Người tạo">{data.requestInfo.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Vị trí">{data.requestInfo.locationDetail}</Descriptions.Item>
                    <Descriptions.Item label="Loại bảo trì">{data.requestInfo.maintenanceType}</Descriptions.Item>
                    <Descriptions.Item label="Mức độ ưu tiên" span={2}>
                        {data.requestInfo.priorityLevel}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {data.surveyInfo && (
                <Card title="Thông tin khảo sát thực tế">
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Sự cố thực tế">{data.surveyInfo.actualIssueDescription}</Descriptions.Item>
                        <Descriptions.Item label="Nguyên nhân">{data.surveyInfo.causeName}</Descriptions.Item>
                        <Descriptions.Item label="Mức độ hư hỏng">{data.surveyInfo.damageLevel}</Descriptions.Item>
                        <Descriptions.Item label="Hình thức bảo trì">{data.surveyInfo.maintenanceTypeActual}</Descriptions.Item>
                        <Descriptions.Item label="Ngày khảo sát" span={2}>
                            {data.surveyInfo.surveyDate
                                ? new Date(data.surveyInfo.surveyDate).toLocaleDateString()
                                : "—"}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )}

            <Card title="Thông tin kế hoạch bảo trì">
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Mã kế hoạch">{data.planInfo.planId}</Descriptions.Item>
                    <Descriptions.Item label="Giải pháp">{data.planInfo.solutionName}</Descriptions.Item>
                    <Descriptions.Item label="Sử dụng vật tư">{data.planInfo.useMaterial ? "Có" : "Không"}</Descriptions.Item>
                    <Descriptions.Item label="Người lập kế hoạch">{data.planInfo.createdBy}</Descriptions.Item>
                    <Descriptions.Item label="Ngày lập kế hoạch" span={2}>
                        {data.planInfo.createdAt
                            ? new Date(data.planInfo.createdAt).toLocaleDateString()
                            : "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ghi chú" span={2}>
                        {data.planInfo.note || "Không có"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
}
