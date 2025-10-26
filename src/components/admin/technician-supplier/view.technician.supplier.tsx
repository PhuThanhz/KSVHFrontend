import { Badge, Descriptions, Drawer, Typography, Divider, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useTechnicianSupplierByIdQuery } from "@/hooks/useTechnicianSuppliers";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    supplierId?: string | number | null;
}

const ViewDetailTechnicianSupplier = ({ onClose, open, supplierId }: IProps) => {
    const { data: supplier, isLoading, isError } = useTechnicianSupplierByIdQuery(supplierId || undefined);

    return (
        <Drawer
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin nhà cung cấp kỹ thuật viên
                </Title>
            }
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
            ) : isError || !supplier ? (
                <Empty description="Không tìm thấy thông tin nhà cung cấp kỹ thuật viên" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        size="middle"
                        column={2}
                        layout="vertical"
                        labelStyle={{
                            fontWeight: 600,
                            color: "#595959",
                            background: "#fafafa",
                        }}
                        contentStyle={{
                            fontSize: 14,
                            color: "#262626",
                        }}
                    >
                        <Descriptions.Item label="Mã nhà cung cấp">
                            <Text strong>{supplier?.supplierCode ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên nhà cung cấp">
                            <Text>{supplier?.name ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Số điện thoại">
                            <Text>{supplier?.phone ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Email">
                            <Text>{supplier?.email ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ">
                            <Text>{supplier?.address ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {supplier?.createdAt
                                    ? dayjs(supplier.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {supplier?.updatedAt
                                    ? dayjs(supplier.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{supplier?.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{supplier?.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailTechnicianSupplier;
