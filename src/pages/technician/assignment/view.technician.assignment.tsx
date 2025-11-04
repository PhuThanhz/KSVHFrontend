// src/pages/client/technician/assignment/view.technician.assignment.tsx
import { Drawer, Descriptions, Typography, Badge, Divider, Spin, Empty } from "antd";
import { useTechnicianAssignmentByIdQuery } from "@/hooks/useTechnicianAssignments";
import dayjs from "dayjs";

const { Text, Title } = Typography;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    assignmentId?: string | number | null;
}

const ViewTechnicianAssignment = ({ open, onClose, assignmentId }: IProps) => {
    const { data: assignment, isLoading, isError } = useTechnicianAssignmentByIdQuery(assignmentId || undefined);

    return (
        <Drawer
            title={<Title level={4}>Chi tiết công việc được phân công</Title>}
            placement="right"
            width={"42vw"}
            onClose={() => onClose(false)}
            open={open}
            maskClosable={false}
            bodyStyle={{ paddingBottom: 40 }}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !assignment ? (
                <Empty description="Không tìm thấy thông tin công việc" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        column={2}
                        layout="vertical"
                        labelStyle={{
                            fontWeight: 600,
                            color: "#595959",
                            background: "#fafafa",
                        }}
                    >
                        <Descriptions.Item label="Mã phiếu">{assignment.requestInfo.requestCode}</Descriptions.Item>
                        <Descriptions.Item label="Người tạo">{assignment.requestInfo.fullName}</Descriptions.Item>
                        <Descriptions.Item label="Thiết bị">{assignment.requestInfo.device?.deviceName ?? "-"}</Descriptions.Item>
                        <Descriptions.Item label="Loại bảo trì">{assignment.requestInfo.maintenanceType}</Descriptions.Item>
                        <Descriptions.Item label="Mức độ ưu tiên">
                            <Badge color="orange" text={assignment.requestInfo.priorityLevel} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Vị trí">{assignment.requestInfo.locationDetail ?? "-"}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái phiếu">
                            <Badge status="processing" text={assignment.requestInfo.status} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {dayjs(assignment.requestInfo.createdAt).format("DD-MM-YYYY HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Người phân công">{assignment.assignedBy}</Descriptions.Item>
                        <Descriptions.Item label="Thời gian phân công">
                            {dayjs(assignment.assignedAt).format("DD-MM-YYYY HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">{assignment.requestInfo.note ?? "-"}</Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {assignment.requestInfo.device && (
                        <>
                            <Title level={5} style={{ marginTop: 10 }}>
                                Thông tin thiết bị
                            </Title>
                            <Descriptions bordered column={2} size="small">
                                <Descriptions.Item label="Mã thiết bị">
                                    {assignment.requestInfo.device.deviceCode}
                                </Descriptions.Item>
                                <Descriptions.Item label="Đơn vị sở hữu">
                                    {assignment.requestInfo.device.companyName ?? "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Bộ phận">
                                    {assignment.requestInfo.device.departmentName ?? "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Loại sở hữu">
                                    {assignment.requestInfo.device.ownershipType ?? "-"}
                                </Descriptions.Item>
                            </Descriptions>
                        </>
                    )}
                </>
            )}
        </Drawer>
    );
};

export default ViewTechnicianAssignment;
