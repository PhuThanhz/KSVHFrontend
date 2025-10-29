import { Drawer, Descriptions, Typography, Badge, Divider, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useEmployeeByIdQuery } from "@/hooks/useEmployees";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    employeeId?: string | null;
}

const ViewDetailEmployee = ({ onClose, open, employeeId }: IProps) => {
    const { data, isLoading, isError } = useEmployeeByIdQuery(employeeId || undefined);

    return (
        <Drawer
            title={<Title level={4}>Chi tiết nhân viên</Title>}
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
            ) : isError || !data ? (
                <Empty description="Không tìm thấy thông tin nhân viên" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        size="middle"
                        column={2}
                        layout="vertical"
                        labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                    >
                        <Descriptions.Item label="Mã nhân viên">
                            <Text strong>{data.employeeCode}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Họ và tên">
                            <Text>{data.fullName}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            <Text>{data.email ?? "-"}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            <Text>{data.phone ?? "-"}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Công ty">
                            <Badge status="processing" text={data.company?.name ?? "-"} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Phòng ban">
                            <Badge status="default" text={data.department?.name ?? "-"} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Chức vụ">
                            <Badge status="success" text={data.position?.name ?? "-"} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {data.createdAt
                                    ? dayjs(data.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {data.updatedAt
                                    ? dayjs(data.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />
                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{data.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{data.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailEmployee;
