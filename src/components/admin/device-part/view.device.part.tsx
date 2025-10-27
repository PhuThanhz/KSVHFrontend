import { Drawer, Descriptions, Typography, Divider, Spin, Empty, Badge } from "antd";
import dayjs from "dayjs";
import { useDevicePartByIdQuery } from "@/hooks/useDeviceParts";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    partId?: string | number | null;
}

const ViewDetailDevicePart = ({ onClose, open, partId }: IProps) => {
    const { data: part, isLoading, isError } = useDevicePartByIdQuery(partId || undefined);

    return (
        <Drawer
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin linh kiện
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
            ) : isError || !part ? (
                <Empty description="Không tìm thấy thông tin linh kiện" />
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
                        <Descriptions.Item label="Mã linh kiện">
                            <Text strong>{part?.partCode ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên linh kiện">
                            <Text>{part?.partName ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Số lượng">
                            <Badge status="processing" text={part?.quantity ?? 0} />
                        </Descriptions.Item>

                        <Descriptions.Item label="Thiết bị">
                            <Text>{part?.device?.name ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {part?.createdAt
                                    ? dayjs(part.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {part?.updatedAt
                                    ? dayjs(part.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{part?.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{part?.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailDevicePart;
