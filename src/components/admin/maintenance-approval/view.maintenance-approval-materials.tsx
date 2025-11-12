import { useMaintenancePlanMaterialsQuery } from "@/hooks/useMaintenanceApprovals";
import { Table, Tag, Spin, Card } from "antd";

interface IProps {
    planId: string;
}

export default function ViewMaintenanceApprovalMaterials({ planId }: IProps) {
    const { data, isLoading } = useMaintenancePlanMaterialsQuery(planId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-60">
                <Spin />
            </div>
        );
    }

    if (!data) {
        return <p>Không tìm thấy danh sách vật tư cho kế hoạch này.</p>;
    }

    const { requestCode, availableMaterials, shortageMaterials, newProposals } = data;

    const columns = [
        {
            title: "Mã linh kiện",
            dataIndex: "partCode",
            key: "partCode",
            render: (v: string) => v || "—",
        },
        {
            title: "Tên linh kiện",
            dataIndex: "partName",
            key: "partName",
            render: (v: string) => v || "—",
        },
        {
            title: "Số lượng cần",
            dataIndex: "quantity",
            key: "quantity",
            render: (v: number) => v ?? "—",
        },
        {
            title: "Kho",
            dataIndex: "warehouseName",
            key: "warehouseName",
            render: (v: string) => v || "—",
        },
        {
            title: "Tồn kho",
            dataIndex: "stock",
            key: "stock",
            render: (v: number) => (v != null ? v : "—"),
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (_: any, record: any) => {
                if (record.isNewProposal)
                    return <Tag color="blue">Đề xuất mới</Tag>;
                if (record.isShortage)
                    return <Tag color="red">Thiếu hàng</Tag>;
                return <Tag color="green">Đủ vật tư</Tag>;
            },
        },
    ];

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold mb-2">
                Danh sách vật tư của kế hoạch - {requestCode}
            </h2>

            {/* === Vật tư có sẵn === */}
            <Card title="Vật tư đầy đủ">
                <Table
                    rowKey="partCode"
                    columns={columns}
                    dataSource={availableMaterials || []}
                    pagination={false}
                    locale={{ emptyText: "Không có vật tư đầy đủ" }}
                />
            </Card>

            {/* === Vật tư thiếu === */}
            <Card title="Vật tư thiếu">
                <Table
                    rowKey="partCode"
                    columns={columns}
                    dataSource={shortageMaterials || []}
                    pagination={false}
                    locale={{ emptyText: "Không có vật tư thiếu" }}
                />
            </Card>

            {/* === Vật tư đề xuất mới === */}
            <Card title="Vật tư đề xuất mới">
                <Table
                    rowKey="partCode"
                    columns={columns}
                    dataSource={newProposals || []}
                    pagination={false}
                    locale={{ emptyText: "Không có vật tư đề xuất mới" }}
                />
            </Card>
        </div>
    );
}
