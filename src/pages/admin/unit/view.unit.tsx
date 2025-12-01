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
import { useUnitByIdQuery } from "@/hooks/useUnits";

const { Title, Text } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    unitId?: string | number | null;
}

const ViewDetailUnit = ({ onClose, open, unitId }: IProps) => {
    const { data: unit, isLoading, isError, refetch } = useUnitByIdQuery(
        unitId || undefined
    );

    /** Tự động refetch khi mở modal */
    useEffect(() => {
        if (open && unitId) refetch();
    }, [open, unitId, refetch]);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin đơn vị
                </Title>
            }
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={isMobile ? "95%" : 700}
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
            ) : isError || !unit ? (
                <Empty description="Không tìm thấy thông tin đơn vị" />
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
                            padding: "10px 12px",
                        }}
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

                    <div style={{ textAlign: "right", marginTop: 8 }}>
                        <Badge status="processing" text="Module: UNIT" />
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ViewDetailUnit;
