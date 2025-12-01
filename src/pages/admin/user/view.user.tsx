import { useEffect } from "react";
import {
    Modal,
    Descriptions,
    Typography,
    Spin,
    Empty,
    Divider,
    Badge,
} from "antd";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { useUserByIdQuery } from "@/hooks/user/useUsers";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    userId?: string | null;
}

const ViewDetailUser = ({ onClose, open, userId }: IProps) => {
    const { data: user, isLoading, isError, refetch } = useUserByIdQuery(
        userId || undefined
    );

    /** Tự động refetch khi mở modal */
    useEffect(() => {
        if (open && userId) refetch();
    }, [open, userId, refetch]);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin người dùng
                </Title>
            }
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={isMobile ? "95%" : 800}
            centered
            bodyStyle={{
                maxHeight: isMobile ? "70vh" : "75vh",
                overflowY: "auto",
                paddingBottom: 16,
                background: "#fff",
            }}
            destroyOnClose
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !user ? (
                <Empty description="Không tìm thấy thông tin người dùng" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        size="middle"
                        column={isMobile ? 1 : 2}
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
                            <Text strong>{user?.name ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Email">
                            <Text>{user?.email ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Vai trò">
                            {user?.role?.name ? (
                                <Badge status="processing" text={user.role.name} />
                            ) : (
                                <Badge status="default" text="Chưa có vai trò" />
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Loại tài khoản">
                            <Text>{user?.accountTypeDisplay ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ">
                            <Text>{user?.address ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            {user?.active ? (
                                <Badge status="success" text="Đang hoạt động" />
                            ) : (
                                <Badge status="error" text="Ngừng hoạt động" />
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {user?.createdAt
                                    ? dayjs(user.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {user?.updatedAt
                                    ? dayjs(user.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{user?.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{user?.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ViewDetailUser;
