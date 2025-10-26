import { Drawer, Descriptions, Typography, Divider, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useSkillByIdQuery } from "@/hooks/useSkills";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    skillId?: string | number | null;
}

const ViewDetailSkill = ({ onClose, open, skillId }: IProps) => {
    const { data: skill, isLoading, isError } = useSkillByIdQuery(skillId || undefined);

    return (
        <Drawer
            title={<Title level={4}>Chi tiết kỹ năng</Title>}
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
            ) : isError || !skill ? (
                <Empty description="Không tìm thấy thông tin kỹ năng" />
            ) : (
                <>
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="Tên kỹ năng">
                            <Text strong>{skill.techniqueName}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {skill?.createdAt
                                    ? dayjs(skill.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {skill?.updatedAt
                                    ? dayjs(skill.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />
                    <Text type="secondary">Dữ liệu hiển thị từ module Skill</Text>
                </>
            )}
        </Drawer>
    );
};

export default ViewDetailSkill;
