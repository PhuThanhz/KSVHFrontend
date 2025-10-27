import { Drawer, Descriptions, Typography, Badge, Divider, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useInventoryItemByIdQuery } from "@/hooks/useInventoryItems";
import { formatCurrency } from "@/config/format";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    itemId?: string | number | null;
}

const ViewInventoryItem = ({ onClose, open, itemId }: IProps) => {
    const { data: item, isLoading, isError } = useInventoryItemByIdQuery(itemId || undefined);

    return (
        <Drawer
            title={<Title level={4}>Chi tiết vật tư tồn kho</Title>}
            placement="right"
            onClose={() => onClose(false)}
            open={open}
            width={"42vw"}
            maskClosable={false}
            bodyStyle={{ paddingBottom: 40 }}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !item ? (
                <Empty description="Không tìm thấy dữ liệu vật tư" />
            ) : (
                <>
                    <Descriptions bordered size="middle" column={2}>
                        <Descriptions.Item label="Mã vật tư">
                            <Text strong>{item.itemCode}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên vật tư">
                            <Text>{item.itemName}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số lượng">
                            <Text>{item.quantity}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Đơn giá">
                            <Text>{formatCurrency(item.unitPrice)}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Đơn vị">
                            <Text>{item.unit?.name ?? "-"}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại thiết bị">
                            <Text>{item.deviceType?.typeName ?? "-"}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Kho">
                            <Text>{item.warehouse?.warehouseName ?? "-"}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Nhà cung cấp">
                            <Text>{item.materialSupplier?.supplierName ?? "-"}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {item.createdAt ? dayjs(item.createdAt).format("DD-MM-YYYY HH:mm") : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">
                            {item.updatedAt ? dayjs(item.updatedAt).format("DD-MM-YYYY HH:mm") : "-"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right" }}>
                        <Text type="secondary">
                            Người tạo: <b>{item?.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{item?.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewInventoryItem;
