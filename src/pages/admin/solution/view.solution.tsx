import { Drawer, Descriptions, Typography, Spin, Empty, Divider, Badge } from "antd";
import dayjs from "dayjs";
import { useSolutionByIdQuery } from "@/hooks/useSolutions";

const { Title, Text } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    solutionId?: string | number | null;
}

const ViewDetailSolution = ({ onClose, open, solutionId }: IProps) => {
    const { data: solution, isLoading, isError } = useSolutionByIdQuery(solutionId || undefined);

    return (
        <Drawer
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin phương án xử lý
                </Title>
            }
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
            ) : isError || !solution ? (
                <Empty description="Không tìm thấy thông tin phương án xử lý" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        column={2}
                        layout="vertical"
                        labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                    >
                        <Descriptions.Item label="Tên phương án">
                            <Text strong>{solution.solutionName ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="ID">
                            <Text>{solution.id}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {solution.createdAt
                                    ? dayjs(solution.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {solution.updatedAt
                                    ? dayjs(solution.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right" }}>
                        <Badge status="processing" text="Module: SOLUTION" />
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailSolution;
