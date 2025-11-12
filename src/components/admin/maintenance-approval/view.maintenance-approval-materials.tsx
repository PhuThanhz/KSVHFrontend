import { useParams } from "react-router-dom";
import { useMaintenancePlanMaterialsQuery } from "@/hooks/useMaintenanceApprovals";
import { Table, Tag, Spin, Card } from "antd";

export default function ViewMaintenanceApprovalMaterials() {
    const { planId } = useParams();
    const { data, isLoading } = useMaintenancePlanMaterialsQuery(planId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-60">
                <Spin />
            </div>
        );
    }

    if (!data) return <p>Không tìm thấy vật tư của kế hoạch</p>;

    const columns = [
        { title: "Mã linh kiện", dataIndex: "partCode", key: "partCode" },
        { title: "Tên linh kiện", dataIndex: "partName", key: "partName" },
        { title: "Số lượng cần", dataIndex: "quantity", key: "quantity" },
        { title: "Kho", dataIndex: "warehouseName", key: "warehouseName" },
        {
            title: "Tồn kho",
            dataIndex: "stock",
            key: "stock",
            render: (v: number) => (v != null ? v : "—"),
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (_: any, record: any) => (
                <>
                    {record.isNewProposal && <Tag color="blue">Đề xuất mới</Tag>}
                    {record.isShortage && <Tag color="red">Thiếu hàng</Tag>}
                    {!record.isNewProposal && !record.isShortage && (
                        <Tag color="green">Đủ vật tư</Tag>
                    )}
                </>
            ),
        },
    ];

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold mb-2">
                Danh sách vật tư - {data.requestCode}
            </h2>

            <Card title="Vật tư đầy đủ">
                <Table
                    rowKey="partCode"
                    columns={columns}
                    dataSource={data.availableMaterials}
                    pagination={false}
                />
            </Card>

            <Card title="Vật tư thiếu">
                <Table
                    rowKey="partCode"
                    columns={columns}
                    dataSource={data.shortageMaterials}
                    pagination={false}
                />
            </Card>

            <Card title="Vật tư đề xuất mới">
                <Table
                    rowKey="partCode"
                    columns={columns}
                    dataSource={data.newProposals}
                    pagination={false}
                />
            </Card>
        </div>
    );
}
