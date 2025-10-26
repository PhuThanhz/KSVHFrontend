import { Drawer, Descriptions, Typography, Spin, Empty, Divider, Badge } from "antd";
import dayjs from "dayjs";
import { useWarehouseByIdQuery } from "@/hooks/useWarehouses";

const { Title, Text } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    warehouseId?: string | number | null;
}

const ViewDetailWarehouse = ({ onClose, open, warehouseId }: IProps) => {
    const { data: warehouse, isLoading, isError } = useWarehouseByIdQuery(warehouseId || undefined);

    return (
        <Drawer
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin kho
                </Title>
            }
            placement="right"
            onClose={() => onClose(false)}
            open={open}
            width={"40vw"}
            maskClosable={false}
            bodyStyle={{ paddingBottom: 40 }}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !warehouse ? (
                <Empty description="Không tìm thấy thông tin kho" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        column={2}
                        layout="vertical"
                        labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                    >
                        <Descriptions.Item label="Tên kho">
                            <Text strong>{warehouse.warehouseName ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ">
                            <Text>{warehouse.address ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {warehouse.createdAt
                                    ? dayjs(warehouse.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {warehouse.updatedAt
                                    ? dayjs(warehouse.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right" }}>
                        <Badge status="processing" text="Module: WAREHOUSE" />
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailWarehouse;
