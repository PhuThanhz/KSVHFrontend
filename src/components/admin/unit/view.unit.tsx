import { Drawer, Descriptions, Typography, Spin, Empty, Divider, Badge } from "antd";
import dayjs from "dayjs";
import { useUnitByIdQuery } from "@/hooks/useUnits";

const { Title, Text } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    unitId?: string | number | null;
}

const ViewDetailUnit = ({ onClose, open, unitId }: IProps) => {
    const { data: unit, isLoading, isError } = useUnitByIdQuery(unitId || undefined);

    return (
        <Drawer
            title={<Title level={4} style={{ margin: 0 }}>Thông tin đơn vị</Title>}
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
            ) : isError || !unit ? (
                <Empty description="Không tìm thấy thông tin đơn vị" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        column={2}
                        layout="vertical"
                        labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                    >
                        <Descriptions.Item label="Tên đơn vị">
                            <Text strong>{unit.name ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Người tạo">
                            <Text>{unit.createdBy ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {unit.createdAt
                                    ? dayjs(unit.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {unit.updatedAt
                                    ? dayjs(unit.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />
                    <div style={{ textAlign: "right" }}>
                        <Badge status="processing" text="Module: UNIT" />
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailUnit;
