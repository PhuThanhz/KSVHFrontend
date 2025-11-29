import { Drawer, Descriptions, Typography, Divider, Spin, Empty, Badge } from "antd";
import dayjs from "dayjs";
import { useShiftTemplateByIdQuery } from "@/hooks/useShiftTemplate";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    shiftTemplateId?: string | number | null;
}

const ViewDetailShiftTemplate = ({ onClose, open, shiftTemplateId }: IProps) => {
    const { data: template, isLoading, isError } = useShiftTemplateByIdQuery(
        shiftTemplateId ? String(shiftTemplateId) : undefined
    );

    return (
        <Drawer
            title={<Title level={4} style={{ margin: 0 }}>Thông tin ca mẫu</Title>}
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
            ) : isError || !template ? (
                <Empty description="Không tìm thấy thông tin ca mẫu" />
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
                        <Descriptions.Item label="Tên ca">
                            <Text strong>{template.name ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            {template.active ? (
                                <Badge status="success" text="Đang hoạt động" />
                            ) : (
                                <Badge status="error" text="Ngừng hoạt động" />
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Giờ bắt đầu">
                            <Text>{template.startTime ? String(template.startTime) : "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Giờ kết thúc">
                            <Text>{template.endTime ? String(template.endTime) : "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ghi chú" span={2}>
                            <Text>{template.note || "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {template.createdAt
                                    ? dayjs(template.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {template.updatedAt
                                    ? dayjs(template.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{template?.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{template?.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailShiftTemplate;
