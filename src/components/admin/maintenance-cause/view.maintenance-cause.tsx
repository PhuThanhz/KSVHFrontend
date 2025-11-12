import { Drawer, Descriptions, Typography, Spin, Empty, Divider } from "antd";
import { useMaintenanceCauseByIdQuery } from "@/hooks/maintenance/useMaintenanceCause";
import dayjs from "dayjs";

const { Text, Title } = Typography;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    causeId?: string | null;
}

const ViewMaintenanceCause = ({ open, onClose, causeId }: IProps) => {
    const { data: cause, isLoading, isError } = useMaintenanceCauseByIdQuery(causeId || undefined);

    return (
        <Drawer
            title={<Title level={4}>Chi tiết nguyên nhân hư hỏng</Title>}
            placement="right"
            open={open}
            onClose={() => onClose(false)}
            width={"40vw"}
            maskClosable={false}
            bodyStyle={{ paddingBottom: 40 }}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !cause ? (
                <Empty description="Không tìm thấy thông tin nguyên nhân" />
            ) : (
                <>
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="ID">{cause.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên nguyên nhân">
                            <Text strong>{cause.causeName}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {cause.createdAt
                                ? dayjs(cause.createdAt).format("DD-MM-YYYY HH:mm")
                                : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">
                            {cause.updatedAt
                                ? dayjs(cause.updatedAt).format("DD-MM-YYYY HH:mm")
                                : "-"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right" }}>
                        <Text type="secondary">
                            Người tạo: <b>{cause.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{cause.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewMaintenanceCause;
