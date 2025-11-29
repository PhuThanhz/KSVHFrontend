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
            title: "Mã vật tư",
            dataIndex: "partCode",
            key: "partCode",
            render: (v: string) => v || "—",
        },
        {
            title: "Tên vật tư",
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
            title: "Kho hàng",
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
            title: "Trạng thái vật tư",
            key: "status",
            render: (_: any, record: any) => {
                if (record.isNewProposal)
                    return <Tag color="blue">Đề xuất mua bổ sung</Tag>;
                if (record.isShortage)
                    return <Tag color="orange">Thiếu hàng (đề xuất mua mới)</Tag>;
                return <Tag color="green">Đủ vật tư </Tag>;

            },
        },
    ];

    return (
        <div className="p-4 space-y-5">
            <h2 className="text-xl font-semibold mb-2">
                Danh sách vật tư của kế hoạch – {requestCode}
            </h2>

            {/* === Nhóm 1: Đủ vật tư trong kho === */}
            <Card title="Vật tư đủ trong kho (đã trừ tồn)">
                <Table
                    rowKey={(r) => r.partCode + "_avail"}
                    columns={columns}
                    dataSource={availableMaterials || []}
                    pagination={false}
                    locale={{ emptyText: "Không có vật tư đủ trong kho" }}
                />
            </Card>

            {/* === Nhóm 2: Thiếu vật tư trong kho === */}
            <Card title="Vật tư thiếu (đề xuất mua mới)">
                <Table
                    rowKey={(r) => r.partCode + "_short"}
                    columns={columns}
                    dataSource={shortageMaterials || []}
                    pagination={false}
                    locale={{ emptyText: "Không có vật tư thiếu" }}
                />
            </Card>

            {/* === Nhóm 3: Vật tư không có trong kho === */}
            <Card title="Vật tư không có trong kho (đề xuất mua bổ sung)">
                <Table
                    rowKey={(r) => r.partCode + "_new"}
                    columns={columns}
                    dataSource={newProposals || []}
                    pagination={false}
                    locale={{ emptyText: "Không có vật tư đề xuất mới" }}
                />
            </Card>
        </div>
    );
}
