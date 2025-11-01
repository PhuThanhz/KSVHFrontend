import { useState } from "react";
import { Table, Button, Tag, Input, Space, Modal } from "antd";
import { useMaintenanceRequestsQuery, useAutoAssignAllMaintenanceRequestsMutation } from "@/hooks/useMaintenanceRequests";
import type { IResMaintenanceRequestDTO } from "@/types/backend";
import ViewMaintenanceDetail from "./view.maintenance-detail";

const { Search } = Input;

const ViewMaintenancePage = () => {
    const [query, setQuery] = useState("page=1&pageSize=10");
    const [selectedItem, setSelectedItem] = useState<IResMaintenanceRequestDTO | null>(null);

    const { data, isLoading } = useMaintenanceRequestsQuery(query);
    const { mutate: autoAssignAll, isPending } = useAutoAssignAllMaintenanceRequestsMutation();

    const handleSearch = (value: string) => {
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("pageSize", "10");
        if (value) params.set("requestCode", value);
        setQuery(params.toString());
    };

    const handleAutoAssign = () => autoAssignAll();

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Danh sách phiếu bảo trì</h2>
                <Space>
                    <Search
                        placeholder="Tìm theo mã phiếu..."
                        onSearch={handleSearch}
                        enterButton
                        allowClear
                    />
                    <Button
                        type="primary"
                        onClick={handleAutoAssign}
                        loading={isPending}
                    >
                        Phân công tự động
                    </Button>
                </Space>
            </div>

            <Table
                loading={isLoading}
                rowKey={(r) => r.requestInfo.requestId!}
                dataSource={data?.result || []}
                pagination={{
                    total: data?.meta?.total,
                    pageSize: data?.meta?.pageSize,
                    onChange: (page, pageSize) =>
                        setQuery(`page=${page}&pageSize=${pageSize}`),
                }}
                columns={[
                    { title: "Mã phiếu", dataIndex: ["requestInfo", "requestCode"], key: "requestCode" },
                    { title: "Người tạo", dataIndex: ["requestInfo", "fullName"], key: "fullName" },
                    { title: "Thiết bị", dataIndex: ["requestInfo", "deviceName"], key: "deviceName" },
                    {
                        title: "Mức ưu tiên",
                        dataIndex: ["requestInfo", "priorityLevel"],
                        render: (level: string) => {
                            const color =
                                level === "KHAN_CAP" ? "red" :
                                    level === "CAO" ? "volcano" :
                                        level === "TRUNG_BINH" ? "blue" : "default";
                            return <Tag color={color}>{level}</Tag>;
                        },
                    },
                    {
                        title: "Trạng thái",
                        dataIndex: ["requestInfo", "status"],
                        render: (status: string) => <Tag color="gold">{status}</Tag>,
                    },
                    {
                        title: "Kỹ thuật viên",
                        dataIndex: "technicianName",
                        render: (val: string) => val || "-",
                    },
                    {
                        title: "Thao tác",
                        render: (_, record) => (
                            <Button type="link" onClick={() => setSelectedItem(record)}>
                                Xem chi tiết
                            </Button>
                        ),
                    },
                ]}
            />

            {/* Modal chi tiết */}
            <Modal
                open={!!selectedItem}
                title={`Chi tiết phiếu ${selectedItem?.requestInfo.requestCode}`}
                width={900}
                onCancel={() => setSelectedItem(null)}
                footer={null}
            >
                {selectedItem && (
                    <ViewMaintenanceDetail requestId={selectedItem.requestInfo.requestId!} />
                )}
            </Modal>
        </div>
    );
};

export default ViewMaintenancePage;
