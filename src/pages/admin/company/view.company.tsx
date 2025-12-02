import { Modal, Descriptions, Typography, Divider, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { useCompanyByIdQuery } from "@/hooks/useCompanies";

const { Text, Title } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    companyId?: string | number | null;
}

const ViewDetailCompany = ({ onClose, open, companyId }: IProps) => {
    const { data: company, isLoading, isError } = useCompanyByIdQuery(companyId || undefined);

    return (
        <Modal
            title={<Title level={4}>Thông tin công ty</Title>}
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={isMobile ? "100%" : 700}
            maskClosable={false}
            destroyOnClose
            centered
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !company ? (
                <Empty description="Không tìm thấy thông tin công ty" />
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
                        <Descriptions.Item label="Mã công ty">
                            <Text strong>{company.companyCode}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên công ty">
                            <Text>{company.name}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ">
                            <Text>{company.address || "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Số điện thoại">
                            <Text>{company.phone || "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Email">
                            <Text>{company.email || "-"}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">
                            <Text type="secondary">
                                {company.createdAt
                                    ? dayjs(company.createdAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            <Text type="secondary">
                                {company.updatedAt
                                    ? dayjs(company.updatedAt).format("DD-MM-YYYY HH:mm")
                                    : "-"}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Text type="secondary">
                            Người tạo: <b>{company?.createdBy ?? "Không rõ"}</b> <br />
                            Người cập nhật: <b>{company?.updatedBy ?? "Không rõ"}</b>
                        </Text>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ViewDetailCompany;
