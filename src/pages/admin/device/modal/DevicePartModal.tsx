import { Modal, Button, Table, Select, Input, Space, Popconfirm, DatePicker } from "antd";
import dayjs from "dayjs";
import {
    useDevicePartsQuery,
    useCreateDevicePartMutation,
    useUpdateDevicePartStatusMutation,
    useDeleteDevicePartMutation
} from "@/hooks/useDeviceParts";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import { useDeviceByIdQuery } from "@/hooks/useDevices";

import type { DevicePartStatus, IDevicePart } from "@/types/backend";
import { useState } from "react";

const statusOptions: DevicePartStatus[] = ["WORKING", "BROKEN", "REPLACED", "REMOVED"];

interface Props {
    open: boolean;
    onClose: () => void;
    deviceId: string;
}

const DevicePartModal = ({ open, onClose, deviceId }: Props) => {
    const { data: parts } = useDevicePartsQuery(deviceId);
    const { data: device } = useDeviceByIdQuery(deviceId);

    const createMutation = useCreateDevicePartMutation(deviceId);
    const updateStatusMutation = useUpdateDevicePartStatusMutation(deviceId);
    const deleteMutation = useDeleteDevicePartMutation(deviceId);

    const [newPart, setNewPart] = useState({
        partCode: "",
        partName: "",
        dateInUse: null as string | null,
        dateExpired: null as string | null,
    });

    const columns = [
        {
            title: "Mã linh kiện",
            dataIndex: "partCode",
        },
        {
            title: "Tên linh kiện",
            dataIndex: "partName",
        },
        {
            title: "Ngày đưa vào sử dụng",
            dataIndex: "dateInUse",
            render: (value: string | null) =>
                value ? dayjs(value).format("DD/MM/YYYY") : "-",
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "dateExpired",
            render: (value: string | null) =>
                value ? dayjs(value).format("DD/MM/YYYY") : "-",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: DevicePartStatus, row: IDevicePart) => (
                <Access permission={ALL_PERMISSIONS.DEVICE_PART.UPDATE_STATUS} hideChildren>
                    <Select
                        value={status}
                        disabled={updateStatusMutation.isPending}
                        onChange={(newStatus) =>
                            updateStatusMutation.mutate({
                                partId: row.id,
                                payload: { status: newStatus },
                            })
                        }
                        style={{ width: 160 }}
                        options={[
                            { label: "Đang hoạt động", value: "WORKING" },
                            { label: "Hỏng", value: "BROKEN" },
                            { label: "Đã thay thế", value: "REPLACED" },
                            { label: "Đã gỡ bỏ", value: "REMOVED" },
                        ]}
                    />
                </Access>
            ),
        },
        {
            title: "Xóa",
            width: 80,
            render: (row: IDevicePart) => (
                <Access permission={ALL_PERMISSIONS.DEVICE_PART.DELETE} hideChildren>
                    <Popconfirm
                        title="Xác nhận xóa linh kiện"
                        description="Bạn có chắc chắn muốn xóa linh kiện này không?"
                        okText="Xác nhận"
                        cancelText="Hủy"
                        onConfirm={() => deleteMutation.mutate(row.id)}
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </Access>
            ),
        },
    ];

    const handleAddPart = () => {
        createMutation.mutate(newPart, {
            onSuccess: () => {
                setNewPart({
                    partCode: "",
                    partName: "",
                    dateInUse: null,
                    dateExpired: null,
                });
            },
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={`Quản lý linh kiện của thiết bị: ${device?.deviceCode ?? ""}`}
            footer={null}
            width={960}
        >
            <Space direction="vertical" style={{ width: "100%" }}>
                <Space wrap>
                    <Input
                        placeholder="Mã linh kiện"
                        style={{ width: 160 }}
                        value={newPart.partCode}
                        onChange={(e) => setNewPart((p) => ({ ...p, partCode: e.target.value }))}
                    />
                    <Input
                        placeholder="Tên linh kiện"
                        style={{ width: 200 }}
                        value={newPart.partName}
                        onChange={(e) => setNewPart((p) => ({ ...p, partName: e.target.value }))}
                    />
                    <DatePicker
                        placeholder="Ngày đưa vào sử dụng"
                        style={{ width: 180 }}
                        format="DD/MM/YYYY"
                        value={newPart.dateInUse ? dayjs(newPart.dateInUse) : null}
                        onChange={(d) =>
                            setNewPart((p) => ({ ...p, dateInUse: d ? d.toISOString() : null }))
                        }
                    />
                    <DatePicker
                        placeholder="Ngày hết hạn"
                        style={{ width: 180 }}
                        format="DD/MM/YYYY"
                        value={newPart.dateExpired ? dayjs(newPart.dateExpired) : null}
                        onChange={(d) =>
                            setNewPart((p) => ({ ...p, dateExpired: d ? d.toISOString() : null }))
                        }
                    />
                    <Access permission={ALL_PERMISSIONS.DEVICE_PART.CREATE} hideChildren>
                        <Button
                            type="primary"
                            onClick={handleAddPart}
                            loading={createMutation.isPending}
                        >
                            Thêm linh kiện
                        </Button>
                    </Access>
                </Space>

                <Table<IDevicePart>
                    rowKey="id"
                    dataSource={parts || []}
                    columns={columns}
                    pagination={false}
                />
            </Space>
        </Modal>
    );
};

export default DevicePartModal;
