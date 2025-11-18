import { Drawer, Descriptions, Tag, Button } from "antd";
import { useMaintenanceScheduleByIdQuery } from "@/hooks/useMaintenanceSchedules";
import { formatDate } from "@/config/format";

interface Props {
    id: string;
    open: boolean;
    onClose: () => void;
}

const MaintenanceScheduleDetailDrawer = ({ id, open, onClose }: Props) => {
    const { data, isLoading } = useMaintenanceScheduleByIdQuery(id);

    return (
        <Drawer
            title="Chi tiết lịch bảo trì"
            width={520}
            open={open}
            onClose={onClose}
            loading={isLoading}
        >
            {data && (
                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
                    <Descriptions.Item label="Ngày bảo trì">
                        {formatDate(data.scheduledDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Bảo hành">
                        {data.underWarranty ? "Có" : "Không"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ghi chú">
                        {data.note ?? "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Phiếu bảo trì">
                        {data.requestInfo ? (
                            <>
                                <b>{data.requestInfo.requestCode}</b>
                                <br />
                                <Button
                                    type="link"
                                    href={`/admin/maintenance-request/${data.requestInfo.requestId}`}
                                >
                                    Xem phiếu
                                </Button>
                            </>
                        ) : (
                            <Tag>Chưa tạo phiếu</Tag>
                        )}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Drawer>
    );
};

export default MaintenanceScheduleDetailDrawer;
