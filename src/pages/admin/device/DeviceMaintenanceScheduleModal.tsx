import { Modal, Table, Tag, Spin } from "antd";
import { useSchedulesByDeviceQuery } from "@/hooks/useMaintenanceSchedules";
import dayjs from "dayjs";

interface Props {
    open: boolean;
    onClose: () => void;
    deviceId: string;
}

const DeviceMaintenanceScheduleModal = ({ open, onClose, deviceId }: Props) => {
    const { data, isFetching } = useSchedulesByDeviceQuery(deviceId);

    return (
        <Modal
            open={open}
            title="Lịch bảo trì định kỳ"
            onCancel={onClose}
            footer={null}
            width={800}
            destroyOnClose
        >
            {isFetching ? (
                <Spin tip="Đang tải lịch bảo trì..." />
            ) : (
                <Table
                    size="small"
                    bordered
                    rowKey="id"
                    pagination={false}
                    dataSource={data || []}
                    columns={[
                        {
                            title: "Ngày bảo trì",
                            dataIndex: "scheduledDate",
                            render: (v: string) => dayjs(v).format("DD/MM/YYYY"),
                        },
                        {
                            title: "Trong bảo hành",
                            dataIndex: "underWarranty",
                            align: "center",
                            render: (v: boolean) =>
                                v ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>,
                        },
                        {
                            title: "Trạng thái",
                            dataIndex: "status",
                            align: "center",
                            render: (v: string) => {
                                const map: Record<string, { text: string; color: string }> = {
                                    CHUA_THUC_HIEN: { text: "Chưa thực hiện", color: "blue" },
                                    DA_TAO_PHIEU: { text: "Đã tạo phiếu", color: "orange" },
                                    HOAN_THANH: { text: "Hoàn thành", color: "green" },
                                };
                                const item = map[v] || { text: v || "-", color: "default" };
                                return <Tag color={item.color}>{item.text}</Tag>;
                            },
                        },
                        {
                            title: "Mã phiếu (nếu có)",
                            dataIndex: "requestCode",
                            render: (v?: string) => v || "-",
                        },
                    ]}
                />
            )}
        </Modal>
    );
};

export default DeviceMaintenanceScheduleModal;
