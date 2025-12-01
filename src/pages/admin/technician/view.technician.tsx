import { Modal, Descriptions, Divider, Spin, Empty, Badge, Typography } from "antd";
import { useTechnicianByIdQuery } from "@/hooks/user/useTechnicians";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { formatCurrency } from "@/utils/format";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    technicianId?: string | null;
}

const ViewTechnician = ({ onClose, open, technicianId }: IProps) => {
    const { data: technician, isLoading, isError } = useTechnicianByIdQuery(technicianId || undefined);
    const isOutsource = technician?.technicianType === "OUTSOURCE";

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Thông tin kỹ thuật viên</Title>}
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            centered
            maskClosable={false}
            width={isMobile ? "100%" : 750}
            bodyStyle={{
                maxHeight: "70vh",
                overflowY: "auto",
                padding: isMobile ? "12px 16px" : "20px 24px",
            }}
            destroyOnClose
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !technician ? (
                <Empty description="Không tìm thấy thông tin kỹ thuật viên" />
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
                        <Descriptions.Item label="Mã kỹ thuật viên">
                            <Text strong>{technician.technicianCode ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Họ và tên">
                            <Text>{technician.fullName ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Loại kỹ thuật viên">
                            {technician.technicianType === "INTERNAL" ? (
                                <Badge status="processing" text="Nội bộ" />
                            ) : (
                                <Badge status="success" text="Thuê ngoài" />
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            {technician.active ? (
                                <Badge status="success" text="Đang hoạt động" />
                            ) : (
                                <Badge status="error" text="Ngừng hoạt động" />
                            )}
                        </Descriptions.Item>

                        {/* Hiển thị thêm nếu là thuê ngoài */}
                        {isOutsource && (
                            <>
                                <Descriptions.Item label="Nhà cung cấp">
                                    <Text>{technician.supplier?.name ?? "-"}</Text>
                                </Descriptions.Item>

                                <Descriptions.Item label="Chi phí thuê (VNĐ)">
                                    <Text>
                                        {technician.costPerHire
                                            ? formatCurrency(technician.costPerHire)
                                            : "-"}
                                    </Text>
                                </Descriptions.Item>
                            </>
                        )}

                        <Descriptions.Item label="Email">
                            <Text>{technician.email ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Điện thoại">
                            <Text>{technician.phone ?? "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Kỹ năng" span={2}>
                            {technician.skills?.length ? (
                                technician.skills.map((skill, idx) => (
                                    <Badge
                                        key={idx}
                                        color="purple"
                                        text={skill.techniqueName}
                                        style={{ marginRight: 5 }}
                                    />
                                ))
                            ) : (
                                <Text type="secondary">Chưa có kỹ năng</Text>
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {technician.createdAt
                                    ? dayjs(technician.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {technician.updatedAt
                                    ? dayjs(technician.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{technician.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{technician.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ViewTechnician;
