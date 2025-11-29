import { Badge, Descriptions, Drawer, Typography, Divider, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useDepartmentByIdQuery } from "@/hooks/useDepartments";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    departmentId?: string | number | null;
}

const ViewDetailDepartment = ({ onClose, open, departmentId }: IProps) => {
    const { data: dept, isLoading, isError } = useDepartmentByIdQuery(departmentId || undefined);

    return (
        <Drawer
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Thông tin phòng ban
                </Title>
            }
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
            ) : isError || !dept ? (
                <Empty description="Không tìm thấy thông tin phòng ban" />
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
                        <Descriptions.Item label="Mã phòng ban">
                            <Text strong>{dept.departmentCode ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên phòng ban">
                            <Text>{dept.name ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Công ty">
                            {dept.company?.name ? (
                                <Badge status="processing" text={dept.company.name} />
                            ) : (
                                <Badge status="default" text="Chưa có công ty" />
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {dept.createdAt
                                    ? dayjs(dept.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {dept.updatedAt
                                    ? dayjs(dept.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{dept?.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{dept?.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailDepartment;
