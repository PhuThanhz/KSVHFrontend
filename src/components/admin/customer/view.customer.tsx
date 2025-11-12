import { Drawer, Descriptions, Typography, Divider, Spin, Empty, Badge } from "antd";
import dayjs from "dayjs";
import { useCustomerByIdQuery } from "@/hooks/user/useCustomers";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    customerId?: string | null;
}

const ViewDetailCustomer = ({ onClose, open, customerId }: IProps) => {
    const { data, isLoading, isError } = useCustomerByIdQuery(customerId || undefined);

    return (
        <Drawer
            title={<Title level={4}>Chi tiết khách hàng</Title>}
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
            ) : isError || !data ? (
                <Empty description="Không tìm thấy thông tin khách hàng" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        size="middle"
                        column={2}
                        layout="vertical"
                        labelStyle={{
                            fontWeight: 600,
                            background: "#fafafa",
                        }}
                    >
                        <Descriptions.Item label="Mã khách hàng">
                            <Text strong>{data.customerCode ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên khách hàng">
                            <Text>{data.name ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Email">
                            <Text>{data.email ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Số điện thoại">
                            <Text>{data.phone ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ" span={2}>
                            <Text>{data.address ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            {data.active ? (
                                <Badge status="success" text="Đang hoạt động" />
                            ) : (
                                <Badge status="error" text="Ngừng hoạt động" />
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {data.createdAt
                                    ? dayjs(data.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {data.updatedAt
                                    ? dayjs(data.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{data.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{data.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailCustomer;
