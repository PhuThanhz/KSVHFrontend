import { useState } from "react";
import {
    Form,
    Input,
    Select,
    Button,
    Upload,
    message,
    Card,
    Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateCustomerMaintenanceRequestMutation } from "@/hooks/useMaintenanceRequests";
import type {
    IReqMaintenanceRequestCustomerDTO,
    PriorityLevel,
    MaintenanceType,
} from "@/types/backend";
import { notify } from "@/components/common/notify";
import { callUploadSingleFile } from "@/config/api";

const { TextArea } = Input;
const { Option } = Select;

const CreateMaintenanceRequestClientPage = () => {
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);

    const { mutateAsync: createRequest, isPending } =
        useCreateCustomerMaintenanceRequestMutation();

    /** Upload file (ảnh, tài liệu đính kèm) */
    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const res = await callUploadSingleFile(file, "MAINTENANCE_REQUEST");
            if (res && res[0]?.fileName) {
                message.success("Tải file thành công!");
                return res[0].fileName;
            } else {
                throw new Error("Upload thất bại");
            }
        } catch (err) {
            message.error("Không thể upload file");
            return "";
        } finally {
            setUploading(false);
        }
    };


    const handleSubmit = async (values: IReqMaintenanceRequestCustomerDTO) => {
        try {
            await createRequest(values);
            form.resetFields();
        } catch (err) {

        }
    };


    /** Custom Upload Props cho 3 ảnh */
    const uploadProps = (fieldName: keyof IReqMaintenanceRequestCustomerDTO) => ({
        beforeUpload: async (file: File) => {
            const uploaded = await handleUpload(file);
            if (uploaded) {
                form.setFieldValue(fieldName, uploaded);
            }
            return false;
        },
        showUploadList: false,
    });

    return (
        <Card
            title="Tạo Phiếu Bảo Trì (Khách hàng)"
            className="max-w-2xl mx-auto mt-8 shadow-md"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    priorityLevel: "TRUNG_BINH" as PriorityLevel,
                    maintenanceType: "DOT_XUAT" as MaintenanceType,
                }}
            >
                {/* Tên thiết bị */}
                <Form.Item
                    label="Tên thiết bị"
                    name="deviceName"
                    rules={[{ required: true, message: "Vui lòng nhập tên thiết bị" }]}
                >
                    <Input placeholder="Nhập tên thiết bị cần bảo trì" />
                </Form.Item>

                {/* Mô tả sự cố */}
                <Form.Item label="Mô tả sự cố" name="issueDescription">
                    <TextArea
                        placeholder="Mô tả chi tiết sự cố hoặc tình trạng thiết bị"
                        rows={3}
                    />
                </Form.Item>

                {/* Mức độ ưu tiên */}
                <Form.Item
                    label="Mức độ ưu tiên"
                    name="priorityLevel"
                    rules={[{ required: true, message: "Chọn mức độ ưu tiên" }]}
                >
                    <Select placeholder="Chọn mức độ ưu tiên">
                        <Option value="KHAN_CAP">Khẩn cấp</Option>
                        <Option value="CAO">Cao</Option>
                        <Option value="TRUNG_BINH">Trung bình</Option>
                        <Option value="THAP">Thấp</Option>
                    </Select>
                </Form.Item>

                {/* Loại bảo trì */}
                <Form.Item
                    label="Loại bảo trì"
                    name="maintenanceType"
                    rules={[{ required: true, message: "Chọn loại bảo trì" }]}
                >
                    <Select placeholder="Chọn loại bảo trì">
                        <Option value="DOT_XUAT">Đột xuất</Option>
                        <Option value="DINH_KY">Định kỳ</Option>
                        <Option value="SUA_CHUA">Sửa chữa</Option>
                    </Select>
                </Form.Item>

                {/* File đính kèm */}
                <Form.Item label="Tệp đính kèm (tối đa 3)">
                    <Space direction="vertical" className="w-full">
                        <Upload {...uploadProps("attachment1")}>
                            <Button
                                icon={<UploadOutlined />}
                                loading={uploading}
                                disabled={uploading}
                            >
                                Tải lên tệp 1
                            </Button>
                        </Upload>

                        <Upload {...uploadProps("attachment2")}>
                            <Button
                                icon={<UploadOutlined />}
                                loading={uploading}
                                disabled={uploading}
                            >
                                Tải lên tệp 2
                            </Button>
                        </Upload>

                        <Upload {...uploadProps("attachment3")}>
                            <Button
                                icon={<UploadOutlined />}
                                loading={uploading}
                                disabled={uploading}
                            >
                                Tải lên tệp 3
                            </Button>
                        </Upload>
                    </Space>
                </Form.Item>

                {/* Nút Submit */}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        className="w-full"
                    >
                        {isPending ? "Đang gửi..." : "Gửi yêu cầu bảo trì"}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CreateMaintenanceRequestClientPage;
