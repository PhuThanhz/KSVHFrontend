import type { IUser } from "@/types/backend";
import { Badge, Descriptions, Drawer, Typography, Divider } from "antd";
import dayjs from "dayjs";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IUser | null;
    setDataInit: (v: any) => void;
}

const ViewDetailUser = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;

    return (
        <Drawer
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin người dùng
                </Title>
            }
            placement="right"
            onClose={() => {
                onClose(false);
                setDataInit(null);
            }}
            open={open}
            width={"42vw"}
            maskClosable={false}
            bodyStyle={{ paddingBottom: 40 }}
        >
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
                <Descriptions.Item label="Tên hiển thị">
                    <Text strong>{dataInit?.name ?? "-"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Email">
                    <Text>{dataInit?.email ?? "-"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Vai trò">
                    {dataInit?.role?.name ? (
                        <Badge
                            status="processing"
                            text={dataInit.role.name}
                        />
                    ) : (
                        <Badge status="default" text="Chưa có vai trò" />
                    )}
                </Descriptions.Item>

                <Descriptions.Item label="Loại tài khoản">
                    <Text>{dataInit?.accountTypeDisplay ?? "-"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Địa chỉ">
                    <Text>{dataInit?.address ?? "-"}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Trạng thái">
                    {dataInit?.active ? (
                        <Badge status="success" text="Đang hoạt động" />
                    ) : (
                        <Badge status="error" text="Ngừng hoạt động" />
                    )}
                </Descriptions.Item>

                <Descriptions.Item label="Ngày tạo">
                    <Text type="secondary">
                        {dataInit?.createdAt
                            ? dayjs(dataInit.createdAt).format("DD-MM-YYYY HH:mm")
                            : "-"}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Ngày cập nhật">
                    <Text type="secondary">
                        {dataInit?.updatedAt
                            ? dayjs(dataInit.updatedAt).format("DD-MM-YYYY HH:mm")
                            : "-"}
                    </Text>
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div style={{ textAlign: "right", marginTop: 10 }}>
                <Text type="secondary">
                    Người tạo: <b>{dataInit?.createdBy ?? "Không rõ"}</b> <br />
                    Người cập nhật: <b>{dataInit?.updatedBy ?? "Không rõ"}</b>
                </Text>
            </div>
        </Drawer>
    );
};

export default ViewDetailUser;
