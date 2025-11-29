import { Descriptions, Drawer, Typography, Divider, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useAssetTypeByIdQuery } from "@/hooks/useAssetTypes";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    assetTypeId?: string | number | null;
}

const ViewDetailAssetType = ({ onClose, open, assetTypeId }: IProps) => {
    const { data: assetType, isLoading, isError } = useAssetTypeByIdQuery(assetTypeId || undefined);

    return (
        <Drawer
            title={<Title level={4}>Thông tin loại tài sản</Title>}
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
            ) : isError || !assetType ? (
                <Empty description="Không tìm thấy thông tin loại tài sản" />
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
                        <Descriptions.Item label="Mã loại tài sản">
                            <Text strong>{assetType.assetTypeCode}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên loại tài sản">
                            <Text>{assetType.assetTypeName}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {assetType.createdAt
                                    ? dayjs(assetType.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {assetType.updatedAt
                                    ? dayjs(assetType.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{assetType?.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{assetType?.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailAssetType;
