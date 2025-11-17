import { Modal, Button, Table, Select, Input, Space, Popconfirm } from "antd";
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
        quantity: 1,
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
            title: "SL",
            dataIndex: "quantity",
            width: 60,
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
                        style={{ width: 140 }}
                        options={statusOptions.map((s) => ({ label: s, value: s }))}
                    />
                </Access>
            ),
        },

        {
            title: "Xóa",
            width: 70,
            render: (row: IDevicePart) => (
                <Access permission={ALL_PERMISSIONS.DEVICE_PART.DELETE} hideChildren>
                    <Popconfirm
                        title="Xác nhận xóa linh kiện"
                        description="Bạn có chắc chắn muốn xóa linh kiện này?"
                        okText="Xác nhận"
                        cancelText="Hủy"
                        onConfirm={() => deleteMutation.mutate(row.id)}
                    >
                        <Button danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Access>
            ),
        },

    ];

    const handleAddPart = () => {
        createMutation.mutate(newPart, {
            onSuccess: () => {
                setNewPart({ partCode: "", partName: "", quantity: 1 });
            },
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={`Quản lý linh kiện của thiết bị: ${device?.deviceCode ?? ""}`}
            footer={null}
            width={820}
        >
            <Space direction="vertical" style={{ width: "100%" }}>
                <Space>
                    <Input
                        placeholder="Mã linh kiện"
                        style={{ width: 140 }}
                        value={newPart.partCode}
                        onChange={(e) => setNewPart((p) => ({ ...p, partCode: e.target.value }))}
                    />
                    <Input
                        placeholder="Tên linh kiện"
                        style={{ width: 200 }}
                        value={newPart.partName}
                        onChange={(e) => setNewPart((p) => ({ ...p, partName: e.target.value }))}
                    />
                    <Input
                        placeholder="SL"
                        style={{ width: 80 }}
                        type="number"
                        min={1}
                        value={newPart.quantity}
                        onChange={(e) => setNewPart((p) => ({ ...p, quantity: Number(e.target.value) }))}
                    />

                    <Access permission={ALL_PERMISSIONS.DEVICE_PART.CREATE} hideChildren>
                        <Button type="primary" onClick={handleAddPart} loading={createMutation.isPending}>
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
