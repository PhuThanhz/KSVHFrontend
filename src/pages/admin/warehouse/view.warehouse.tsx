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
import { useWarehouseByIdQuery } from "@/hooks/useWarehouses";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    warehouseId?: string | number | null;
}

const ViewDetailWarehouse = ({ onClose, open, warehouseId }: IProps) => {
    const { data: warehouse, isLoading, isError } = useWarehouseByIdQuery(
        warehouseId || undefined
    );

    /** Responsive width Modal */
    const [modalWidth, setModalWidth] = useState<string | number>("50vw");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                // Mobile → full width
                setModalWidth("100vw");
            } else if (window.innerWidth < 1200) {
                // Tablet → chiếm khoảng 70%
                setModalWidth("70vw");
            } else {
                // Desktop → 50%
                setModalWidth("50vw");
            }
        };

        handleResize(); // chạy lần đầu khi mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin kho
                </Title>
            }
            open={open}
            onCancel={() => onClose(false)}
            width={modalWidth}
            footer={null}
            centered
            maskClosable={false}
            bodyStyle={{
                maxHeight: "80vh",
                overflowY: "auto",
                paddingBottom: 40,
            }}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !warehouse ? (
                <Empty description="Không tìm thấy thông tin kho" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        column={2}
                        layout="vertical"
                        labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                    >
                        <Descriptions.Item label="Tên kho">
                            <Text strong>{warehouse.warehouseName ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ">
                            <Text>{warehouse.address ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {warehouse.createdAt
                                    ? dayjs(warehouse.createdAt).format(
                                        "DD-MM-YYYY HH:mm"
                                    )
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {warehouse.updatedAt
                                    ? dayjs(warehouse.updatedAt).format(
                                        "DD-MM-YYYY HH:mm"
                                    )
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right" }}>
                        <Badge status="processing" text="Module: WAREHOUSE" />
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ViewDetailWarehouse;
