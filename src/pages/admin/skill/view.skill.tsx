import { Modal, Descriptions, Typography, Divider, Spin, Empty } from "antd";
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
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Chi tiết kỹ năng</Title>}
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width="600px"
            centered
            maskClosable={false}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !skill ? (
                <Empty description="Không tìm thấy thông tin kỹ năng" />
            ) : (
                <>
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        labelStyle={{ fontWeight: 600, background: "#fafafa" }}
                    >
                        <Descriptions.Item label="Tên kỹ năng">
                            <Text strong>{skill.techniqueName ?? "-"}</Text>
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

                    <Divider style={{ margin: "20px 0 10px" }} />

                    <div style={{ textAlign: "right" }}>
                        <Text type="secondary">Dữ liệu hiển thị từ module Skill</Text>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ViewDetailSkill;
