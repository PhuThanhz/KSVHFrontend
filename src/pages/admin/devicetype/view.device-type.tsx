import { Badge, Descriptions, Modal, Typography, Divider, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { useDeviceTypeByIdQuery } from "@/hooks/useDeviceTypes";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    deviceTypeId?: string | number | null;
}

const ViewDetailDeviceType = ({ onClose, open, deviceTypeId }: IProps) => {
    const { data: deviceType, isLoading, isError } = useDeviceTypeByIdQuery(deviceTypeId || undefined);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin loại thiết bị
                </Title>
            }
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={isMobile ? "100%" : 700}
            maskClosable={false}
            destroyOnClose
            centered
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !deviceType ? (
                <Empty description="Không tìm thấy thông tin loại thiết bị" />
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
                        <Descriptions.Item label="Mã loại thiết bị">
                            <Text strong>{deviceType.deviceTypeCode ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên loại thiết bị">
                            <Text strong>{deviceType.typeName ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Loại tài sản">
                            {deviceType.assetType?.assetTypeName ? (
                                <Badge
                                    status="processing"
                                    text={deviceType.assetType.assetTypeName}
                                />
                            ) : (
                                <Badge status="default" text="Chưa có loại tài sản" />
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {deviceType.createdAt
                                    ? dayjs(deviceType.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {deviceType.updatedAt
                                    ? dayjs(deviceType.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{deviceType.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{deviceType.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ViewDetailDeviceType;
